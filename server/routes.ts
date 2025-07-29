import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRestaurantSchema, insertCategorySchema, insertFoodItemSchema, insertBannerSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize restaurant and default data
  app.post("/api/init", async (req, res) => {
    try {
      // Check if restaurant already exists
      const existingRestaurant = await storage.getRestaurant();
      if (existingRestaurant) {
        return res.json(existingRestaurant);
      }

      // Create default restaurant
      const restaurant = await storage.createRestaurant({
        name: "ร้านอาหารไทยแท้",
        description: "อาหารไทยต้นตำรับ",
        logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      });

      // Create default categories
      const categories = [
        { name: "ลูกชิ้น", icon: "🍲", restaurantId: restaurant.id },
        { name: "อาหาร", icon: "🍛", restaurantId: restaurant.id },
        { name: "เครื่องดื่ม", icon: "🥤", restaurantId: restaurant.id }
      ];

      for (const category of categories) {
        await storage.createCategory(category);
      }

      // Create default banners
      await storage.createBanner({
        title: "10 ไข่ ฟรี 1",
        subtitle: "โปรโมชั่นพิเศษ",
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        restaurantId: restaurant.id
      });

      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Failed to initialize restaurant" });
    }
  });

  // Restaurant routes
  app.get("/api/restaurant", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Failed to get restaurant" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      const categories = await storage.getCategories(restaurant.id);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Food item routes
  app.get("/api/food-items", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      const categoryId = req.query.categoryId as string;
      const foodItems = await storage.getFoodItems(restaurant.id, categoryId);
      res.json(foodItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get food items" });
    }
  });

  app.get("/api/food-items/search", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const foodItems = await storage.searchFoodItems(restaurant.id, query);
      res.json(foodItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to search food items" });
    }
  });

  app.post("/api/food-items", async (req, res) => {
    try {
      const foodItemData = insertFoodItemSchema.parse(req.body);
      const foodItem = await storage.createFoodItem(foodItemData);
      res.status(201).json(foodItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid food item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create food item" });
    }
  });

  // Banner routes
  app.get("/api/banners", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      const banners = await storage.getBanners(restaurant.id);
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: "Failed to get banners" });
    }
  });

  app.post("/api/banners", async (req, res) => {
    try {
      const bannerData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(bannerData);
      res.status(201).json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid banner data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create banner" });
    }
  });

  app.patch("/api/banners/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const bannerData = req.body;
      const banner = await storage.updateBanner(id, bannerData);
      res.json(banner);
    } catch (error) {
      res.status(500).json({ message: "Failed to update banner" });
    }
  });

  app.delete("/api/banners/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteBanner(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete banner" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, total } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order items are required" });
      }

      const restaurant = await storage.getRestaurant();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Create order
      const order = await storage.createOrder({
        restaurantId: restaurant.id,
        total: total.toString(),
        status: "confirmed"
      });

      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          foodItemId: item.foodItemId,
          quantity: item.quantity,
          price: item.price.toString()
        });
      }

      // Get complete order with items
      const completeOrder = await storage.getOrderWithItems(order.id);
      res.status(201).json(completeOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      const orders = await storage.getOrders(restaurant.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const order = await storage.getOrderWithItems(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to get order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
