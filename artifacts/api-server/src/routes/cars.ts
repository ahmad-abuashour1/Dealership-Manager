/* Car inventory CRUD routes */
import { Router } from "express";
import { db, carsTable } from "@workspace/db";
import { eq, and, SQL } from "drizzle-orm";
import {
  CreateCarBody,
  UpdateCarBody,
  ListCarsQueryParams,
  GetCarParams,
  UpdateCarParams,
  DeleteCarParams,
} from "@workspace/api-zod";
import { requireAdmin } from "./auth";

const router = Router();

/* Helper: convert DB row to API response shape */
function serializeCar(row: typeof carsTable.$inferSelect) {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    year: row.year,
    price: Number(row.price),
    description: row.description ?? null,
    engine: row.engine ?? null,
    transmission: row.transmission ?? null,
    fuelType: row.fuelType ?? null,
    seats: row.seats ?? null,
    color: row.color ?? null,
    mileage: row.mileage ?? null,
    available: row.available,
    featured: row.featured,
    images: row.images ? row.images.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/* GET /api/cars */
router.get("/cars", async (req, res): Promise<void> => {
  const parsed = ListCarsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { brand, featured, available } = parsed.data;
  const conditions: SQL[] = [];

  if (brand) conditions.push(eq(carsTable.brand, brand));
  if (featured !== undefined) conditions.push(eq(carsTable.featured, featured));
  if (available !== undefined) conditions.push(eq(carsTable.available, available));

  const rows =
    conditions.length > 0
      ? await db.select().from(carsTable).where(and(...conditions))
      : await db.select().from(carsTable);

  res.json(rows.map(serializeCar));
});

/* GET /api/cars/stats — must be before /cars/:id */
router.get("/cars/stats", async (_req, res): Promise<void> => {
  const all = await db.select().from(carsTable);
  const total = all.length;
  const available = all.filter((c) => c.available).length;
  const featured = all.filter((c) => c.featured).length;

  const brandMap: Record<string, number> = {};
  for (const car of all) {
    brandMap[car.brand] = (brandMap[car.brand] ?? 0) + 1;
  }
  const byBrand = Object.entries(brandMap).map(([brand, count]) => ({ brand, count }));

  res.json({ total, available, featured, byBrand });
});

/* POST /api/cars */
router.post("/cars", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateCarBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { images, price, ...rest } = parsed.data;
  const imagesStr = Array.isArray(images) ? images.join(",") : "";

  const [inserted] = await db
    .insert(carsTable)
    .values({ ...rest, price: String(price), images: imagesStr })
    .returning();

  res.status(201).json(serializeCar(inserted));
});

/* GET /api/cars/:id */
router.get("/cars/:id", async (req, res): Promise<void> => {
  const parsed = GetCarParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [car] = await db
    .select()
    .from(carsTable)
    .where(eq(carsTable.id, parsed.data.id))
    .limit(1);

  if (!car) {
    res.status(404).json({ error: "Car not found" });
    return;
  }

  res.json(serializeCar(car));
});

/* PATCH /api/cars/:id */
router.patch("/cars/:id", requireAdmin, async (req, res): Promise<void> => {
  const paramsParsed = UpdateCarParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParsed = UpdateCarBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const { images, price, ...rest } = bodyParsed.data;
  const updateData: Record<string, unknown> = { ...rest };
  if (price !== undefined) updateData.price = String(price);
  if (images !== undefined) {
    updateData.images = images.join(",");
  }

  const [updated] = await db
    .update(carsTable)
    .set(updateData)
    .where(eq(carsTable.id, paramsParsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Car not found" });
    return;
  }

  res.json(serializeCar(updated));
});

/* DELETE /api/cars/:id */
router.delete("/cars/:id", requireAdmin, async (req, res): Promise<void> => {
  const parsed = DeleteCarParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(carsTable)
    .where(eq(carsTable.id, parsed.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Car not found" });
    return;
  }

  res.status(204).end();
});

export default router;
