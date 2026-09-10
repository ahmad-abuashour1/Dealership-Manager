import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import path from "path";
import pinoHttp from "pino-http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import carsRouter from "./routes/cars";
import contactRouter from "./routes/contact";
import uploadRouter from "./routes/upload";
import { logger } from "./lib/logger";

const app: Express = express();

/* Trust the reverse proxy (Replit's shared proxy sends X-Forwarded-For) */
app.set("trust proxy", 1);

/* ── Security headers ─────────────────────────────────────────────────────── */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow images served from /api/uploads
    contentSecurityPolicy: false, // frontend handles its own CSP
  })
);

/* Remove fingerprinting header */
app.disable("x-powered-by");

/* ── CORS ─────────────────────────────────────────────────────────────────── */
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || true, // tighten in production via env var
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ── Rate limiting ────────────────────────────────────────────────────────── */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // strict: max 10 login attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // max 5 contact submissions per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent, please try again later." },
});

/* ── Logging ──────────────────────────────────────────────────────────────── */
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

/* ── Body parsing ─────────────────────────────────────────────────────────── */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* ── Static: uploaded car images ──────────────────────────────────────────── */
const uploadsDir = path.join(process.cwd(), "..", "..", "uploads");
app.use("/api/uploads", express.static(uploadsDir, { maxAge: "7d" }));

/* ── Routes with targeted rate limits ────────────────────────────────────── */
app.use("/api/auth/login", authLimiter);
app.use("/api/contact", contactLimiter);
app.use(
  "/api",
  generalLimiter,
  healthRouter,
  authRouter,
  carsRouter,
  contactRouter,
  uploadRouter,
);

/* ── Global error handler — never leak stack traces ──────────────────────── */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err: err.message }, "Unhandled error");
  res.status(500).json({ error: "An unexpected error occurred." });
});

export default app;
