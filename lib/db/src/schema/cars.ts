/* Cars table — stores the vehicle inventory */
import { pgTable, text, serial, timestamp, numeric, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const carsTable = pgTable("cars", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  /* price stored as numeric for precision */
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  engine: text("engine"),
  transmission: text("transmission"),
  fuelType: text("fuel_type"),
  seats: integer("seats"),
  color: text("color"),
  mileage: integer("mileage"),
  available: boolean("available").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  /* images stored as comma-separated URLs */
  images: text("images").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCarSchema = createInsertSchema(carsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof carsTable.$inferSelect;
