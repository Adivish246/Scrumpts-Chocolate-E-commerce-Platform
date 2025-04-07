import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  preferences: jsonb("preferences")
});

export const insertUserSchema = createInsertSchema(users).pick({
  uid: true,
  email: true,
  displayName: true,
  photoURL: true,
  preferences: true
});

// Product table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(), // dark, milk, white
  rating: real("rating").default(5),
  featured: boolean("featured").default(false),
  bestseller: boolean("bestseller").default(false),
  weightGrams: integer("weight_grams"),
  flavors: text("flavors"),
  ingredients: text("ingredients"),
  shelfLife: text("shelf_life"),
  vegetarian: boolean("vegetarian").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});

// Collection table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull()
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true
});

// Cart table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true
});

// Order table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull()
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});

// Chat history table
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  messages: jsonb("messages").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).omit({
  id: true,
  createdAt: true
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;

// Message type for chat
export type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

// Product recommendation type
export type ProductRecommendation = {
  productId: number;
  score: number;
  reason: string;
};
