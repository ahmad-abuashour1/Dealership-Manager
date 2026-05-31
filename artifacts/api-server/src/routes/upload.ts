/* Image upload route — accepts multipart form data, saves to /uploads directory */
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin } from "./auth";

const router = Router();

/* Ensure the uploads directory exists */
const UPLOADS_DIR = path.join(process.cwd(), "..", "..", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/* Multer storage config — keep original extension, add timestamp to avoid collisions */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `car-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max per file
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpg, png, webp, gif)"));
    }
  },
});

/* POST /api/upload — upload up to 5 images, admin only */
router.post(
  "/upload",
  requireAdmin,
  upload.array("images", 5),
  (req: any, res: any): void => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }
    const urls = (req.files as Express.Multer.File[]).map(
      (f) => `/api/uploads/${f.filename}`
    );
    res.json({ urls });
  }
);

export default router;
