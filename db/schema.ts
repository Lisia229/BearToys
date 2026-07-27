import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  provider: text("provider", { enum: ["email", "facebook"] }).notNull(),
  defaultStore: text("default_store"),
  defaultAddress: text("default_address"),
  createdAt: text("created_at").notNull(),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  stock: integer("stock").notNull(),
  status: text("status", { enum: ["listed", "preorder", "hidden"] }).notNull(),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: integer("member_id").references(() => members.id),
  orderNumber: text("order_number").notNull().unique(),
  subtotal: integer("subtotal").notNull(),
  shippingFee: integer("shipping_fee").notNull(),
  total: integer("total").notNull(),
  paymentMethod: text("payment_method", { enum: ["line_pay"] }).notNull(),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "failed", "refunded"],
  }).notNull(),
  deliveryMethod: text("delivery_method", { enum: ["seven_eleven", "home"] })
    .notNull(),
  deliveryStatus: text("delivery_status", {
    enum: ["pending", "ready", "shipped", "delivered"],
  }).notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: text("created_at").notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
});

export const linePayTransactions = sqliteTable("line_pay_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  transactionId: text("transaction_id"),
  requestToken: text("request_token"),
  status: text("status", { enum: ["created", "confirmed", "failed"] }).notNull(),
  rawPayload: text("raw_payload"),
  createdAt: text("created_at").notNull(),
});
