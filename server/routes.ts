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

      // Create default food items
      const createdCategories = await storage.getCategories(restaurant.id);

      // Find categories by name
      const meatballCategory = createdCategories.find(c => c.name === "ลูกชิ้น");
      const foodCategory = createdCategories.find(c => c.name === "อาหาร");
      const drinkCategory = createdCategories.find(c => c.name === "เครื่องดื่ม");

      // Sample meatball items
      if (meatballCategory) {
        const meatballItems = [
          { name: "ลูกชิ้นหมู", description: "ลูกชิ้นหมูสด เนื้อแน่น รสชาติเข้มข้น", price: "25", imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.7", categoryId: meatballCategory.id, restaurantId: restaurant.id },
          { name: "ลูกชิ้นเนื้อ", description: "ลูกชิ้นเนื้อวัว เนื้อแน่น หอมหวาน", price: "30", imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.4", categoryId: meatballCategory.id, restaurantId: restaurant.id },
          { name: "ลูกชิ้นปลาหมึก", description: "ลูกชิ้นปลาหมึกสด เคี้ยวเหนียว", price: "28", imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.2", categoryId: meatballCategory.id, restaurantId: restaurant.id },
          { name: "ลูกชิ้นปลา", description: "ลูกชิ้นปลาสดใหม่ หวานหอม", price: "27", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.5", categoryId: meatballCategory.id, restaurantId: restaurant.id },
          { name: "ลูกชิ้นกุ้ง", description: "ลูกชิ้นกุ้งแท้ เนื้อกุ้งแน่น", price: "35", imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.6", categoryId: meatballCategory.id, restaurantId: restaurant.id }
        ];

        for (const item of meatballItems) {
          await storage.createFoodItem(item);
        }
      }

      // Sample food items
      if (foodCategory) {
        const foodItems = [
          { name: "ข้าวผัดกุ้ง", description: "ข้าวผัดกุ้งสด หอมกรุ่น", price: "45.00", imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.6", categoryId: foodCategory.id, restaurantId: restaurant.id },
          { name: "ผัดไทย", description: "ผัดไทยแท้ รสชาติต้นตำรับ", price: "40.00", imageUrl: "https://images.unsplash.com/photo-1559314809-0f31657b9ccd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.8", categoryId: foodCategory.id, restaurantId: restaurant.id },
          { name: "ต้มยำกุ้ง", description: "ต้มยำกุ้งน้ำข้น รสเข้มข้น", price: "55.00", imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.9", categoryId: foodCategory.id, restaurantId: restaurant.id },
          { name: "แกงเขียวหวานไก่", description: "แกงเขียวหวานไก่ เผ็ดร้อน", price: "50.00", imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.5", categoryId: foodCategory.id, restaurantId: restaurant.id },
          { name: "ส้มตำไทย", description: "ส้มตำไทยแซ่บ เผ็ดจี๊ดจ๊าด", price: "35.00", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.7", categoryId: foodCategory.id, restaurantId: restaurant.id }
        ];

        for (const item of foodItems) {
          await storage.createFoodItem(item);
        }
      }

      // Sample drink items
      if (drinkCategory) {
        const drinkItems = [
          { name: "น้ำส้ม", description: "น้ำส้มคั้นสด เซาต์จัด", price: "15", imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.3", categoryId: drinkCategory.id, restaurantId: restaurant.id },
          { name: "ชาเย็น", description: "ชาเย็นหอมหวาน รสชาติเข้มข้น", price: "18", imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.5", categoryId: drinkCategory.id, restaurantId: restaurant.id },
          { name: "กาแฟเย็น", description: "กาแฟเย็นเข้มข้น หอมกรุ่น", price: "20", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.6", categoryId: drinkCategory.id, restaurantId: restaurant.id },
          { name: "น้ำแข็งใส", description: "น้ำแข็งใสเย็นชื่นใจ", price: "10", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.2", categoryId: drinkCategory.id, restaurantId: restaurant.id },
          { name: "น้ำมะนาว", description: "น้ำมะนาวสด เซาต์เปรี้ยว", price: "12", imageUrl: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.4", categoryId: drinkCategory.id, restaurantId: restaurant.id }
        ];

        for (const item of drinkItems) {
          await storage.createFoodItem(item);
        }
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

  app.delete("/api/food-items/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteFoodItem(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete food item" });
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