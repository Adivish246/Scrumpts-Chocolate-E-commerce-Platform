import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, insertChatHistorySchema, Message } from "@shared/schema";
import { WebSocketServer } from "ws";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // PREFIX ALL ROUTES WITH /api
  
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:uid", async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      const user = await storage.getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.patch("/api/users/:uid/preferences", async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      const { preferences } = req.body;
      
      const updatedUser = await storage.updateUserPreferences(uid, preferences);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Product routes
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const { category, type } = req.query;
      const filter: { category?: string; type?: string } = {};
      
      if (typeof category === "string") filter.category = category;
      if (typeof type === "string") filter.type = type;
      
      const products = await storage.getProducts(filter);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to get products" });
    }
  });

  app.get("/api/products/featured", async (req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to get featured products" });
    }
  });

  app.get("/api/products/bestsellers", async (req: Request, res: Response) => {
    try {
      const products = await storage.getBestsellers();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bestseller products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to get product" });
    }
  });

  app.get("/api/products/search", async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (typeof q !== "string") {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const products = await storage.searchProducts(q);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Collection routes
  app.get("/api/collections", async (req: Request, res: Response) => {
    try {
      const collections = await storage.getCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to get collections" });
    }
  });

  app.get("/api/collections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const collection = await storage.getCollectionById(id);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: "Failed to get collection" });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const cartItems = await storage.getCartItemWithProduct(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get cart items" });
    }
  });

  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add to cart" });
      }
    }
  });

  app.patch("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { quantity } = req.body;
      
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItemQuantity(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.removeCartItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/user/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      await storage.clearCart(userId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const { order, items } = req.body;
      
      const orderData = insertOrderSchema.parse(order);
      const orderItemsData = z.array(insertOrderItemSchema).parse(items);
      
      const createdOrder = await storage.createOrder(orderData, orderItemsData);
      res.status(201).json(createdOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  app.get("/api/orders/user/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const orders = await storage.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get orders" });
    }
  });

  app.get("/api/orders/:orderId/items", async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const orderItems = await storage.getOrderItems(orderId);
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get order items" });
    }
  });

  // Chat routes
  app.get("/api/chat/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const chatHistory = await storage.getChatHistory(userId);
      
      if (!chatHistory) {
        return res.json({ messages: [] });
      }
      
      res.json(chatHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat history" });
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const chatData = insertChatHistorySchema.parse(req.body);
      const chatHistory = await storage.saveChatHistory(chatData);
      res.status(201).json(chatHistory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save chat history" });
      }
    }
  });

  // AI recommendation endpoint
  app.post("/api/recommend", async (req: Request, res: Response) => {
    try {
      const { preferences, mood, occasion } = req.body;
      
      // Get products for recommendation
      const products = await storage.getProducts();
      
      const promptContent = `
        I need chocolate recommendations based on the following:
        ${preferences ? `Preferences: ${preferences}` : ""}
        ${mood ? `Current mood: ${mood}` : ""}
        ${occasion ? `Occasion: ${occasion}` : ""}
        
        Here's information about our chocolate products:
        ${products.map(p => `
          - ID: ${p.id}
          - Name: ${p.name}
          - Description: ${p.description}
          - Type: ${p.type}
          - Flavors: ${p.flavors || "Various"}
          - Price: ${(p.price / 100).toFixed(2)} INR
        `).join('\n')}
        
        Recommend the top 3 chocolates based on the given preferences, mood and occasion. 
        For each recommendation, provide the product ID, a score between 0-100, 
        and a personalized reason for the recommendation.
        
        Format your response as a JSON object with a 'recommendations' array.
      `;
      
      // Call OpenAI API
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a chocolate recommendation expert who helps customers find the perfect chocolates." },
          { role: "user", content: promptContent }
        ],
        response_format: { type: "json_object" }
      });
      
      // Parse the response
      const resultContent = response.choices[0].message.content || "";
      const result = JSON.parse(resultContent);
      
      res.json(result);
    } catch (error) {
      console.error("AI recommendation error:", error);
      res.status(500).json({ 
        message: "Failed to get recommendations",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Create HTTP server from Express
  const httpServer = createServer(app);
  
  // Use a different path for WebSockets to avoid conflicts with Vite's HMR
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/api/ws/chat'
  });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");
    
    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const { userId, content } = data;
        
        if (!userId || !content) {
          throw new Error("Missing userId or content in message");
        }
        
        console.log(`Received message from user ${userId}: ${content.substring(0, 50)}...`);
        
        // Get chat history or create a new one
        let chatHistory = await storage.getChatHistory(userId);
        
        // Initialize messages array if needed
        const messages: Message[] = chatHistory && Array.isArray(chatHistory.messages) ? [...chatHistory.messages] : [];
        
        // Add user message to history
        messages.push({
          role: "user",
          content,
          timestamp: Date.now()
        });
        
        try {
          // Get OpenAI response
          // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { 
                role: "system", 
                content: "You are Cocoa Assistant, an AI helper for a luxury chocolate e-commerce store named Scrumpts. Help customers find the perfect chocolates based on their preferences, mood, occasion, or dietary requirements. Be friendly, helpful, and knowledgeable about chocolate-making processes, flavors, and pairings. Provide concise, helpful responses, and suggest specific products from Scrumpts' collection when appropriate." 
              },
              ...messages.map(m => ({ 
                role: m.role, 
                content: m.content 
              }))
            ]
          });
          
          // Get assistant response
          const assistantMessage = {
            role: "assistant" as const,
            content: response.choices[0].message.content || "I'm sorry, I couldn't generate a response at this time.",
            timestamp: Date.now()
          };
          
          // Add assistant message to history
          messages.push(assistantMessage);
          
          // Update or create chat history
          if (chatHistory) {
            chatHistory = await storage.updateChatHistory(chatHistory.id, messages);
          } else {
            chatHistory = await storage.saveChatHistory({
              userId,
              messages
            });
          }
          
          // Send response back to client
          ws.send(JSON.stringify({
            message: assistantMessage,
            history: messages
          }));
          
          console.log(`Sent response to user ${userId}`);
        } catch (aiError) {
          console.error("OpenAI API error:", aiError);
          
          // Fallback response if OpenAI fails
          const fallbackMessage = {
            role: "assistant" as const,
            content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
            timestamp: Date.now()
          };
          
          messages.push(fallbackMessage);
          
          ws.send(JSON.stringify({
            message: fallbackMessage,
            history: messages,
            error: "AI service temporarily unavailable"
          }));
        }
      } catch (error) {
        console.error("WebSocket message processing error:", error);
        ws.send(JSON.stringify({
          error: "Failed to process message",
          details: error instanceof Error ? error.message : String(error)
        }));
      }
    });
    
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
    
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  return httpServer;
}
