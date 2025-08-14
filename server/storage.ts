import { 
  users, 
  restaurants,
  categories,
  foodItems,
  banners,
  orders,
  type User,
  type InsertUser,
  type UpsertUser,
  type Restaurant,
  type Category,
  type FoodItem,
  type Banner,
  type Order,
  type InsertOrder
} from '../shared/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { hashPassword } from './auth';

interface Database {
  users?: User[];
  products?: any[];
  orders?: Order[];
}

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Restaurant operations
  getRestaurant(): Promise<Restaurant | undefined>;
  updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: any): Promise<Category>;
  
  // Food item operations
  getFoodItems(): Promise<FoodItem[]>;
  getFoodItemsByCategory(categoryId: string): Promise<FoodItem[]>;
  searchFoodItems(query: string): Promise<FoodItem[]>;
  createFoodItem(item: any): Promise<FoodItem>;
  
  // Banner operations
  getBanners(): Promise<Banner[]>;
  createBanner(banner: any): Promise<Banner>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  getUserOrders(userId: string): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await hashPassword(userData.password);
    
    const [user] = await db
      .insert(users)
      .values({ 
        ...userData, 
        password: hashedPassword 
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Restaurant operations
  async getRestaurant(): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).limit(1);
    return restaurant;
  }

  async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
    const [restaurant] = await db
      .update(restaurants)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(restaurants.id, id))
      .returning();
    return restaurant;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(categoryData: any): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(categoryData)
      .returning();
    return category;
  }

  // Food item operations
  async getFoodItems(): Promise<FoodItem[]> {
    return await db.select().from(foodItems);
  }

  async getFoodItemsByCategory(categoryId: string): Promise<FoodItem[]> {
    return await db.select().from(foodItems).where(eq(foodItems.categoryId, categoryId));
  }

  async searchFoodItems(query: string): Promise<FoodItem[]> {
    // Simple search implementation - can be enhanced with full-text search
    return await db.select().from(foodItems);
  }

  async createFoodItem(itemData: any): Promise<FoodItem> {
    const [item] = await db
      .insert(foodItems)
      .values(itemData)
      .returning();
    return item;
  }

  // Banner operations
  async getBanners(): Promise<Banner[]> {
    return await db.select().from(banners);
  }

  async createBanner(bannerData: any): Promise<Banner> {
    const [banner] = await db
      .insert(banners)
      .values(bannerData)
      .returning();
    return banner;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(orderData)
      .returning();
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
}

// Legacy class for backward compatibility
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
      createdAt: new Date(),
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
const dataAccessLayer = new DataAccessLayer();
export default dataAccessLayer;
export { dataAccessLayer };

// Database storage for PostgreSQL (when DATABASE_URL is available)
export const storage = new DatabaseStorage();