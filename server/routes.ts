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
          { name: "ลูกชิ้นหมู", description: "ลูกชิ้นหมูสด เนื้อแน่น รสชาติเข้มข้น", price: "25.00", imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.7", categoryId: meatballCategory.id, restaurantId: restaurant.id },
          { name: "ลูกชิ้นเนื้อ", description: "ลูกชิ้นเนื้อวัว เนื้อแน่น หอมหวาน", price: "30.00", imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.4", categoryId: meatballCategory.id, restaurantId: restaurant.id },
          { name: "ลูกชิ้นปลาหมึก", description: "ลูกชิ้นปลาหมึกสด เคี้ยวเหนียว", price: "28.00", imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.2", categoryId: meatballCategory.id, restaurantId: restaurant.id },
          { name: "ลูกชิ้นปลา", description: "ลูกชิ้นปลาสดใหม่ หวานหอม", price: "27.00", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.5", categoryId: meatballCategory.id, restaurantId: restaurant.id },
          { name: "ลูกชิ้นกุ้ง", description: "ลูกชิ้นกุ้งแท้ เนื้อกุ้งแน่น", price: "35.00", imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.6", categoryId: meatballCategory.id, restaurantId: restaurant.id }
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
          { name: "น้ำส้ม", description: "น้ำส้มคั้นสด เซาต์จัด", price: "15.00", imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.3", categoryId: drinkCategory.id, restaurantId: restaurant.id },
          { name: "ชาเย็น", description: "ชาเย็นหอมหวาน รสชาติเข้มข้น", price: "18.00", imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.5", categoryId: drinkCategory.id, restaurantId: restaurant.id },
          { name: "กาแฟเย็น", description: "กาแฟเย็นเข้มข้น หอมกรุ่น", price: "20.00", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.6", categoryId: drinkCategory.id, restaurantId: restaurant.id },
          { name: "น้ำแข็งใส", description: "น้ำแข็งใสเย็นชื่นใจ", price: "10.00", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.2", categoryId: drinkCategory.id, restaurantId: restaurant.id },
          { name: "น้ำมะนาว", description: "น้ำมะนาวสด เซาต์เปรี้ยว", price: "12.00", imageUrl: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", rating: "4.4", categoryId: drinkCategory.id, restaurantId: restaurant.id }
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

      console.log(`[DEBUG] Filtering by categoryId: ${categoryId || 'all'}, found ${foodItems.length} items`);

      res.json(foodItems);
    } catch (error) {
      console.error("[ERROR] Failed to get food items:", error);
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
        return res.status(404).json({ error: "Restaurant not found" });
      }

      const banners = await storage.getBanners(restaurant.id);
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  app.post("/api/banners", async (req, res) => {
    try {
      const { title, description, imageUrl, linkUrl, restaurantId } = req.body;

      if (!title || !imageUrl || !restaurantId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const banner = await storage.createBanner({
        title,
        imageUrl,
        restaurantId
      });

      res.status(201).json(banner);
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({ error: "Failed to create banner" });
    }
  });

  app.put("/api/banners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const banner = await storage.updateBanner(id, updateData);
      res.json(banner);
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).json({ error: "Failed to update banner" });
    }
  });

  app.delete("/api/banners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBanner(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting banner:", error);
      res.status(500).json({ error: "Failed to delete banner" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, total, customerName, tableNumber, notes } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order items are required" });
      }

      if (!customerName || !customerName.trim()) {
        return res.status(400).json({ message: "Customer name is required" });
      }

      const restaurant = await storage.getRestaurant();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Parse and validate order data
      const orderData = insertOrderSchema.parse({
        restaurantId: restaurant.id,
        total: total.toString(),
        status: "confirmed",
        customerName: customerName.trim(),
        tableNumber: tableNumber?.trim() || null,
        notes: notes?.trim() || null,
      });

      // Create order
      const order = await storage.createOrder(orderData);

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
      console.error("Order creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid order data", 
          errors: error.errors 
        });
      }
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

  // Export orders to CSV - must come before the /:id route
  app.get("/api/orders/export", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      const orders = await storage.getOrders(restaurant.id);
      
      // Create CSV header
      const csvHeader = [
        'Order ID',
        'Date',
        'Customer Name',
        'Table Number',
        'Total Amount',
        'Status',
        'Notes'
      ].join(',');

      // Create CSV rows
      const csvRows = orders.map(order => {
        const date = order.createdAt ? new Date(order.createdAt).toLocaleString('th-TH') : '';
        return [
          order.id,
          `"${date}"`,
          `"${order.customerName || ''}"`,
          `"${order.tableNumber || ''}"`,
          order.total,
          order.status,
          `"${order.notes || ''}"`
        ].join(',');
      });

      const csvContent = [csvHeader, ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="orders-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send('\ufeff' + csvContent); // Add BOM for Excel UTF-8 support
    } catch (error) {
      console.error("Error exporting orders:", error);
      res.status(500).json({ message: "Failed to export orders" });
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

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      // Validate status
      const validStatuses = ['pending', 'preparing', 'confirmed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedOrder = await storage.updateOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });



  // Database management routes
  app.get("/api/admin/database/config", async (req, res) => {
    try {
      // Return current database configuration (local for now)
      res.json({ 
        type: 'local',
        status: 'connected'
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get database config" });
    }
  });

  app.post("/api/admin/database/config", async (req, res) => {
    try {
      const config = req.body;
      // For now, just acknowledge the config update
      res.json({ success: true, message: "Database configuration updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update database config" });
    }
  });

  app.get("/api/admin/database/status", async (req, res) => {
    try {
      res.json({ 
        connected: true,
        type: 'local',
        dataPath: 'server/data/database.json'
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get database status" });
    }
  });

  app.post("/api/admin/database/export", async (req, res) => {
    try {
      const format = req.query.format as string || 'json';
      const data = await storage.exportData();
      
      if (format === 'csv') {
        // Convert data to CSV format
        let csv = '';
        
        // Orders CSV
        if (data.orders.length > 0) {
          const orderHeaders = ['Order ID', 'Date', 'Customer Name', 'Table', 'Total', 'Status', 'Notes'];
          csv += orderHeaders.join(',') + '\n';
          
          data.orders.forEach(order => {
            const row = [
              order.id,
              new Date(order.createdAt || '').toLocaleDateString('th-TH'),
              order.customerName || '',
              order.tableNumber || '',
              order.total,
              order.status,
              order.notes || ''
            ].map(field => `"${String(field).replace(/"/g, '""')}"`);
            csv += row.join(',') + '\n';
          });
        }
        
        res.json({ csv });
      } else {
        res.json(data);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  app.post("/api/admin/database/import", async (req, res) => {
    try {
      const data = req.body;
      await storage.importData(data);
      res.json({ success: true, message: "Data imported successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to import data" });
    }
  });

  // Image upload route
  app.post("/api/upload/image", async (req, res) => {
    try {
      // For now, return a placeholder since we're storing data locally
      // In a real implementation, you would handle file upload here
      res.json({ 
        url: "/images/placeholder.jpg",
        message: "Image upload functionality requires a proper file storage service" 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Restaurant management routes
  app.put("/api/restaurant/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log("Updating restaurant:", id, updateData);
      
      const restaurant = await storage.updateRestaurant(id, updateData);
      res.json(restaurant);
    } catch (error: any) {
      console.error("Error updating restaurant:", error);
      res.status(500).json({ error: error.message || "Failed to update restaurant" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}