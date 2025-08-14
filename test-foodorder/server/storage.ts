import type { Order } from '../shared/schema';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

interface Database {
  users?: User[];
  products?: any[];
  orders?: Order[];
}

export class DataAccessLayer {
  private dbPath = './server/data/database.json';

  private async loadDatabase(): Promise<Database> {
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile(this.dbPath, 'utf-8');
      return JSON.parse(data) as Database;
    } catch (error) {
      console.error('Failed to load database:', error);
      return { users: [], products: [], orders: [] };
    }
  }

  private async saveDatabase(db: Database): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
      await fs.writeFile(this.dbPath, JSON.stringify(db, null, 2));
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }

  // Initialize default restaurant data
  async initializeDefaultData(): Promise<void> {
    const db = await this.loadDatabase();
    
    // Initialize default data structure if needed
    if (!db.users) db.users = [];
    if (!db.orders) db.orders = [];
    
    await this.saveDatabase(db);
  }

  // Restaurant data
  async getRestaurant() {
    return {
      id: "1",
      name: "ซ้อมคอ",
      description: "เกาหลี-ไทย ฟิวชัน",
      logo: "/images/logo.jpg"
    };
  }

  // Categories data
  async getCategories() {
    return [
      { id: "1", name: "ลูกชิ้น", icon: "🍖", description: "ลูกชิ้นหลากหลาย" },
      { id: "2", name: "เส้น", icon: "🍜", description: "เส้นแบบต่าง ๆ" },
      { id: "3", name: "ผัก", icon: "🥬", description: "ผักสด ๆ" },
      { id: "4", name: "เครื่องดื่ม", icon: "🥤", description: "เครื่องดื่มเย็น" }
    ];
  }

  // Food items data
  async getFoodItems() {
    return [
      {
        id: "1",
        name: "ลูกชิ้นหมู",
        description: "ลูกชิ้นหมูสดใหม่",
        price: "15",
        categoryId: "1",
        image: "/images/meatball.jpg",
        isAvailable: true,
        rating: 4.5
      },
      {
        id: "2", 
        name: "ลูกชิ้นปลา",
        description: "ลูกชิ้นปลาเนื้อแน่น",
        price: "18",
        categoryId: "1",
        image: "/images/fishball.jpg", 
        isAvailable: true,
        rating: 4.3
      },
      {
        id: "3",
        name: "เส้นบะหมี่",
        description: "เส้นบะหมี่เหลือง",
        price: "10",
        categoryId: "2", 
        image: "/images/noodles.jpg",
        isAvailable: true,
        rating: 4.2
      },
      {
        id: "4",
        name: "ผักกาดขาว",
        description: "ผักกาดขาวสด",
        price: "8",
        categoryId: "3",
        image: "/images/vegetables.jpg",
        isAvailable: true,
        rating: 4.0
      },
      {
        id: "5",
        name: "น้ำแข็ง",
        description: "น้ำแข็งเย็น ๆ",
        price: "5",
        categoryId: "4",
        image: "/images/ice.jpg",
        isAvailable: true,
        rating: 4.1
      }
    ];
  }

  // Banners data
  async getBanners() {
    return [
      {
        id: "1",
        title: "โปรโมชั่นพิเศษ",
        description: "ลด 20% สำหรับลูกค้าใหม่",
        image: "/images/banner1.jpg",
        isActive: true
      }
    ];
  }

  // User Management
  async getUserByEmail(email: string): Promise<User | null> {
    const db = await this.loadDatabase();
    return db.users?.find(user => user.email === email) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const db = await this.loadDatabase();
    return db.users?.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const db = await this.loadDatabase();
    if (!db.users) db.users = [];

    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    await this.saveDatabase(db);
    return newUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const db = await this.loadDatabase();
    if (!db.users) return null;

    const userIndex = db.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    await this.saveDatabase(db);
    return db.users[userIndex];
  }

  async getAllUsers(): Promise<User[]> {
    const db = await this.loadDatabase();
    return db.users || [];
  }

  async updateUserRole(id: string, role: string): Promise<User | null> {
    return this.updateUser(id, { role: role as 'customer' | 'admin' });
  }

  async deleteUser(id: string): Promise<boolean> {
    const db = await this.loadDatabase();
    if (!db.users) return false;

    const initialLength = db.users.length;
    db.users = db.users.filter(user => user.id !== id);
    
    if (db.users.length < initialLength) {
      await this.saveDatabase(db);
      return true;
    }
    return false;
  }

  // Orders
  async getOrders() {
    const db = await this.loadDatabase();
    return db.orders || [];
  }

  async createOrder(orderData: any) {
    const db = await this.loadDatabase();
    if (!db.orders) db.orders = [];

    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    db.orders.push(newOrder);
    await this.saveDatabase(db);
    return newOrder;
  }

  async resetOrders(): Promise<void> {
    const db = await this.loadDatabase();
    db.orders = [];
    await this.saveDatabase(db);
  }
}

// Create and export the storage instance
const storage = new DataAccessLayer();
export default storage;