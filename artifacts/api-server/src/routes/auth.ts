/* Admin authentication routes — login and get current user */
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

/* JWT secret — use SESSION_SECRET env var */
const JWT_SECRET = process.env.SESSION_SECRET ?? "fallback-secret-change-in-prod";

/* Middleware: verify JWT and attach adminId to request */
export function requireAdmin(req: any, res: any, next: any): void {
  const authHeader = req.headers["authorization"] as string | undefined;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId: number };
    req.adminId = payload.adminId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/* POST /api/auth/login */
router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, username))
    .limit(1);

  if (!admin) {
    req.log.warn({ username }, "Login failed — user not found");
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    req.log.warn({ username }, "Login failed — wrong password");
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "7d" });
  req.log.info({ adminId: admin.id }, "Admin logged in");

  res.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      createdAt: admin.createdAt.toISOString(),
    },
  });
});

/* GET /api/auth/me */
router.get("/auth/me", requireAdmin, async (req: any, res): Promise<void> => {
  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, req.adminId))
    .limit(1);

  if (!admin) {
    res.status(401).json({ error: "Admin not found" });
    return;
  }

  res.json({
    id: admin.id,
    username: admin.username,
    createdAt: admin.createdAt.toISOString(),
  });
});

export default router;
