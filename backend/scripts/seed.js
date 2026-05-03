/**
 * Loads demo users, vendor shop, categories, and menu items.
 * Run after importing database/schema.sql into MySQL.
 * Usage: npm run seed
 */
require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../db");

const rounds = 12;

async function upsertUser(email, password, full_name, phone, role) {
  const hash = await bcrypt.hash(password, rounds);
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) {
    await pool.query(
      "UPDATE users SET password_hash = ?, full_name = ?, phone = ?, role = ? WHERE email = ?",
      [hash, full_name, phone, role, email]
    );
    const [[row]] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    return row.id;
  }
  const [r] = await pool.query(
    "INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)",
    [email, hash, full_name, phone, role]
  );
  return r.insertId;
}

async function ensureCategory(name, slug) {
  const [rows] = await pool.query("SELECT id FROM categories WHERE slug = ?", [slug]);
  if (rows.length) return rows[0].id;
  const [r] = await pool.query(
    "INSERT INTO categories (name, slug) VALUES (?, ?)",
    [name, slug]
  );
  return r.insertId;
}

async function ensureVendor(userId, business_name, address) {
  const [rows] = await pool.query("SELECT id FROM vendors WHERE user_id = ?", [userId]);
  if (rows.length) return rows[0].id;
  const [r] = await pool.query(
    `INSERT INTO vendors (user_id, business_name, description, address, status)
     VALUES (?, ?, ?, ?, 'active')`,
    [
      userId,
      business_name,
      "Fresh meals prepared daily. Demo restaurant for the delivery platform.",
      address
    ]
  );
  return r.insertId;
}

async function ensureProduct(vendorId, categoryId, name, description, price, image_url) {
  const [rows] = await pool.query(
    "SELECT id FROM products WHERE vendor_id = ? AND name = ?",
    [vendorId, name]
  );
  if (rows.length) return rows[0].id;
  const [r] = await pool.query(
    `INSERT INTO products (vendor_id, category_id, name, description, price, image_url, is_available)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [vendorId, categoryId, name, description, price, image_url]
  );
  return r.insertId;
}

async function main() {
  const adminId = await upsertUser(
    "admin@demo.com",
    "Admin12345!",
    "Platform Admin",
    "+15550000001",
    "admin"
  );
  const customerId = await upsertUser(
    "customer@demo.com",
    "Customer12345!",
    "Alex Customer",
    "+15550000002",
    "customer"
  );
  const vendorUserId = await upsertUser(
    "vendor@demo.com",
    "Vendor12345!",
    "Jamie Vendor",
    "+15550000003",
    "vendor"
  );
  const riderId = await upsertUser(
    "delivery@demo.com",
    "Delivery12345!",
    "Taylor Rider",
    "+15550000004",
    "delivery"
  );

  await pool.query(
    "INSERT IGNORE INTO delivery_persons (user_id, vehicle_type, is_available) VALUES (?, ?, 1)",
    [riderId, "e-bike"]
  );

  const catBurgers = await ensureCategory("Burgers", "burgers");
  const catPizza = await ensureCategory("Pizza", "pizza");
  const catDrinks = await ensureCategory("Drinks", "drinks");

  const vendorId = await ensureVendor(
    vendorUserId,
    "Neon Bites Kitchen",
    "120 Market Street, Metro City"
  );

  await ensureProduct(
    vendorId,
    catBurgers,
    "Smoky BBQ Burger",
    "Angus patty, cheddar, caramelized onions, house BBQ.",
    12.99,
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80"
  );
  await ensureProduct(
    vendorId,
    catBurgers,
    "Truffle Mushroom Burger",
    "Plant-forward blend or beef upgrade, truffle aioli.",
    14.5,
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80"
  );
  await ensureProduct(
    vendorId,
    catPizza,
    "Stone Oven Margherita",
    "San Marzano tomato, bufala mozzarella, basil.",
    11.0,
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80"
  );
  await ensureProduct(
    vendorId,
    catDrinks,
    "Citrus Sparkling Ade",
    "House-made sparkling citrus refresher.",
    3.75,
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80"
  );

  console.log("Seed complete.");
  console.log({
    admin: { email: "admin@demo.com", password: "Admin12345!" },
    customer: { email: "customer@demo.com", password: "Customer12345!" },
    vendor: { email: "vendor@demo.com", password: "Vendor12345!" },
    delivery: { email: "delivery@demo.com", password: "Delivery12345!" },
    vendorId,
    adminId,
    customerId,
    vendorUserId,
    riderId,
    categories: { catBurgers, catPizza, catDrinks }
  });
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
