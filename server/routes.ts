import { Express, Request, Response } from "express";
import { createServer } from "http";
import * as storage from "./storage"; // สมมติว่ามีไฟล์ storage.ts ที่จัดการฐานข้อมูล

// Export the registerRoutes function
export function registerRoutes(app: Express) {
  const server = createServer(app);

// User Authentication Routes
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    // Create new user
    const newUser = await storage.createUser({ email, password, name, role: 'customer' });
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

    const user = await storage.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

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
    const user = await storage.getUserById(userId);

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

return server;
} // ปิด registerRoutes function