/* One-time seed script: creates admin user + sample car inventory */
import bcrypt from "bcrypt";
import { db, adminsTable, carsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const SAMPLE_CARS = [
  {
    brand: "Kia",
    model: "Bongo 3",
    year: 2025,
    price: "18500",
    description: "The Kia Bongo 3 is a versatile light-duty pickup truck ideal for commercial and personal use. Reliable, efficient, and built for hard work.",
    engine: "2.5L Diesel",
    transmission: "Manual 5-speed",
    fuelType: "Diesel",
    seats: 3,
    color: "White",
    mileage: 0,
    available: true,
    featured: true,
    images: "",
  },
  {
    brand: "Hyundai",
    model: "H500",
    year: 2024,
    price: "22000",
    description: "The Hyundai H500 is a robust light commercial truck with flat cargo bed. Perfect for businesses requiring dependable transportation.",
    engine: "2.5L CRDi Diesel",
    transmission: "Manual 5-speed",
    fuelType: "Diesel",
    seats: 3,
    color: "White",
    mileage: 0,
    available: true,
    featured: true,
    images: "",
  },
  {
    brand: "Peugeot",
    model: "Partner",
    year: 2024,
    price: "19900",
    description: "The Peugeot Partner is a compact yet spacious cargo van perfect for city deliveries. Comfortable, fuel-efficient, and easy to maneuver.",
    engine: "1.6L BlueHDi Diesel",
    transmission: "Automatic 6-speed",
    fuelType: "Diesel",
    seats: 2,
    color: "Silver",
    mileage: 0,
    available: true,
    featured: false,
    images: "",
  },
  {
    brand: "Porter",
    model: "H100",
    year: 2023,
    price: "15500",
    description: "The Porter H100 is a compact pickup truck renowned for its durability and low running costs. A top choice for small business owners.",
    engine: "2.5L Diesel",
    transmission: "Manual 5-speed",
    fuelType: "Diesel",
    seats: 2,
    color: "White",
    mileage: 5000,
    available: true,
    featured: false,
    images: "",
  },
  {
    brand: "Kia",
    model: "Bongo 3 Double Cab",
    year: 2025,
    price: "21500",
    description: "The Kia Bongo 3 Double Cab offers extra seating for crew transport alongside a practical cargo bed. Built for teams on the go.",
    engine: "2.5L Diesel",
    transmission: "Automatic 6-speed",
    fuelType: "Diesel",
    seats: 6,
    color: "Black",
    mileage: 0,
    available: true,
    featured: true,
    images: "",
  },
  {
    brand: "Hyundai",
    model: "Porter II",
    year: 2024,
    price: "17800",
    description: "The Hyundai Porter II is a reliable workhorse for everyday commercial use. Known for its high payload capacity and excellent fuel economy.",
    engine: "1.4L CRDi Diesel",
    transmission: "Manual 5-speed",
    fuelType: "Diesel",
    seats: 3,
    color: "White",
    mileage: 2000,
    available: true,
    featured: false,
    images: "",
  },
];

async function seed() {
  console.log("Seeding database...");

  /* Admin user */
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await db
    .insert(adminsTable)
    .values({ username: ADMIN_USERNAME, passwordHash: hash })
    .onConflictDoUpdate({
      target: adminsTable.username,
      set: { passwordHash: hash },
    });
  console.log(`Admin user "${ADMIN_USERNAME}" created/updated. Password: ${ADMIN_PASSWORD}`);

  /* Cars */
  for (const car of SAMPLE_CARS) {
    const existing = await db
      .select()
      .from(carsTable)
      .where(eq(carsTable.model, car.model));
    if (existing.length === 0) {
      await db.insert(carsTable).values(car);
      console.log(`  Car inserted: ${car.brand} ${car.model}`);
    } else {
      console.log(`  Car already exists, skipping: ${car.brand} ${car.model}`);
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
