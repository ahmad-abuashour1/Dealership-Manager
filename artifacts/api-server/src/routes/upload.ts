/* Image upload route — accepts multipart form data, saves to Netlify Blobs */
import { Router } from "express";
import multer from "multer";
import path from "path";
import { getStore } from "@netlify/blobs";
import { requireAdmin } from "./auth";

const router = Router();

/* Serverless functions have no persistent local disk — hold uploads in memory
   long enough to write them to the car-images blob store. */
const upload = multer({
  storage: multer.memoryStorage(),
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

export const carImagesStore = () => getStore("car-images");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/* GET /api/uploads/:key — serve a previously uploaded car image */
router.get("/uploads/:key", async (req: any, res: any): Promise<void> => {
  const { key } = req.params;
  const data = await carImagesStore().get(key, { type: "arrayBuffer" });
  if (!data) {
    res.status(404).end();
    return;
  }
  const contentType = CONTENT_TYPES[path.extname(key).toLowerCase()] || "application/octet-stream";
  res.set("Content-Type", contentType);
  res.set("Cache-Control", "public, max-age=604800");
  res.send(Buffer.from(data));
});

/* POST /api/upload — upload up to 5 images, admin only */
router.post(
  "/upload",
  requireAdmin,
  upload.array("images", 5),
  async (req: any, res: any): Promise<void> => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    const store = carImagesStore();
    const urls = await Promise.all(
      files.map(async (f) => {
        const ext = path.extname(f.originalname).toLowerCase();
        const key = `car-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        await store.set(key, f.buffer);
        return `/api/uploads/${key}`;
      })
    );
    res.json({ urls });
  }
);

export default router;
