import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import storage, { dataAccessLayer } from "./storage";
import { getSessionConfig } from "./session";
import { requireAuth, requireAdmin, optionalAuth, hashPassword, verifyPassword } from "./auth";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Export the registerRoutes function
export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);

  // Session middleware
  app.use(getSessionConfig());

// User Authentication Routes
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // Check if user already exists  
    const existingUser = await dataAccessLayer.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    // Create new user using legacy storage method
    const newUser = await dataAccessLayer.createUser({ email, password, name, role: 'customer' });
    
    // Store user in session
    (req as any).session.user = newUser;
    
    res.json({ 
      message: "สมัครสมาชิกสำเร็จ",
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก" });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }

    const user = await dataAccessLayer.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // Store user in session
    (req as any).session.user = user;

    res.json({ 
      message: "เข้าสู่ระบบสำเร็จ",
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
});

app.get("/api/profile/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await dataAccessLayer.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    res.json({ 
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
  }
});

// Get current user session
app.get("/api/auth/me", (req: Request, res: Response) => {
  const user = (req as any).session?.user;
  if (!user) {
    return res.status(401).json({ message: "ไม่ได้เข้าสู่ระบบ" });
  }
  res.json(user);
});

// Logout route
app.post("/api/auth/logout", (req: Request, res: Response) => {
  (req as any).session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการออกจากระบบ" });
    }
    res.json({ message: "ออกจากระบบสำเร็จ" });
  });
});

app.put("/api/profile/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    const updatedUser = await storage.updateUser(userId, { name, email, password });
    if (!updatedUser) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    res.json({ 
      message: "อัปเดตข้อมูลสำเร็จ",
      user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
});

// Admin Routes
app.get("/api/admin/users", async (req: Request, res: Response) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users.map(user => ({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role,
      createdAt: user.createdAt 
    })));
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
  }
});

app.put("/api/admin/users/:userId/role", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await storage.updateUserRole(userId, role);
    if (!updatedUser) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    res.json({ 
      message: "อัปเดตสิทธิ์สำเร็จ",
      user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role }
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสิทธิ์" });
  }
});

app.delete("/api/admin/users/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const success = await storage.deleteUser(userId);

    if (!success) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    res.json({ message: "ลบผู้ใช้สำเร็จ" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบผู้ใช้" });
  }
});

app.delete("/api/orders", async (req: Request, res: Response) => {
  try {
    const { resetCode } = req.body;

    if (resetCode !== "kenginol") {
      return res.status(403).json({ message: "Invalid reset code" });
    }

    // Reset all orders
    await storage.resetOrders();
    res.json({ message: "ลบคำสั่งซื้อทั้งหมดเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("Reset orders error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบคำสั่งซื้อ" });
  }
});

// Initialize default data endpoint
app.post("/api/init", async (req: Request, res: Response) => {
  try {
    await storage.initializeDefaultData();
    await storage.createDefaultAdmin();
    res.json({ message: "Data initialized successfully" });
  } catch (error) {
    console.error("Init error:", error);
    res.status(500).json({ message: "Failed to initialize data" });
  }
});

// Restaurant endpoint
app.get("/api/restaurant", async (req: Request, res: Response) => {
  try {
    const restaurant = await storage.getRestaurant();
    res.json(restaurant);
  } catch (error) {
    console.error("Get restaurant error:", error);
    res.status(500).json({ message: "Failed to get restaurant data" });
  }
});

// Categories endpoint
app.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Failed to get categories" });
  }
});

// Food items endpoint
app.get("/api/food-items", async (req: Request, res: Response) => {
  try {
    const foodItems = await storage.getFoodItems();
    res.json(foodItems);
  } catch (error) {
    console.error("Get food items error:", error);
    res.status(500).json({ message: "Failed to get food items" });
  }
});

// Banners endpoint
app.get("/api/banners", async (req: Request, res: Response) => {
  try {
    const banners = await storage.getBanners();
    res.json(banners);
  } catch (error) {
    console.error("Get banners error:", error);
    res.status(500).json({ message: "Failed to get banners" });
  }
});

// Protected orders endpoint - only authenticated users can view their orders
app.get("/api/orders", async (req: Request, res: Response) => {
  try {
    const user = (req as any).session?.user;
    if (!user) {
      return res.status(401).json({ message: "กรุณาเข้าสู่ระบบเพื่อดูคำสั่งซื้อ" });
    }

    // If admin, get all orders; if customer, get only their orders
    const orders = user.role === 'admin' 
      ? await storage.getOrders()
      : await storage.getOrdersByUserId(user.id);
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ" });
  }
});

// Protected order creation - only authenticated users can place orders
app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const user = (req as any).session?.user;
    if (!user) {
      return res.status(401).json({ message: "กรุณาเข้าสู่ระบบก่อนสั่งอาหาร" });
    }

    const { items, total, customerInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "กรุณาเลือกรายการอาหาร" });
    }

    // Create order with user info
    const orderData = {
      items,
      total,
      customerInfo: {
        ...customerInfo,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
      },
      status: 'pending' as const,
    };

    const newOrder = await storage.createOrder(orderData);
    
    res.json({ 
      message: "สั่งอาหารสำเร็จ",
      order: newOrder
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสั่งอาหาร" });
  }
});

return server;
} // ปิด registerRoutes function