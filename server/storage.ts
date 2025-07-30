import { 
  type Restaurant, type InsertRestaurant,
  type Category, type InsertCategory,
  type FoodItem, type InsertFoodItem,
  type Banner, type InsertBanner,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type User, type InsertUser
} from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');

interface DatabaseData {
  restaurants: Restaurant[];
  categories: Category[];
  foodItems: FoodItem[];
  banners: Banner[];
  orders: Order[];
  orderItems: OrderItem[];
  users: User[];
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Restaurant methods
  getRestaurant(): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant>;

  // Category methods
  getCategories(restaurantId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Food item methods
  getFoodItems(restaurantId: string, categoryId?: string): Promise<FoodItem[]>;
  searchFoodItems(restaurantId: string, query: string): Promise<FoodItem[]>;
  createFoodItem(foodItem: InsertFoodItem): Promise<FoodItem>;
  updateFoodItem(id: string, foodItem: Partial<InsertFoodItem>): Promise<FoodItem>;

  // Banner methods
  getBanners(restaurantId: string): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner>;
  deleteBanner(id: string): Promise<void>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(restaurantId: string): Promise<Order[]>;
  getOrderWithItems(orderId: string): Promise<(Order & { orderItems: (OrderItem & { foodItem: FoodItem })[] }) | undefined>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  updateOrderStatus(orderId: string, status: string): Promise<Order | undefined>;
  
  // Food item methods (additional)
  deleteFoodItem(id: string): Promise<void>;
  
  // Database methods
  exportData(): Promise<DatabaseData>;
  importData(data: DatabaseData): Promise<void>;
}

export class FileStorage implements IStorage {
  private dataFile = path.join(DATA_DIR, 'database.json');

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  private async loadData(): Promise<DatabaseData> {
    await this.ensureDataDir();

    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch {
      // Initialize empty database
      const emptyData: DatabaseData = {
        restaurants: [],
        categories: [],
        foodItems: [],
        banners: [],
        orders: [],
        orderItems: [],
        users: []
      };
      await this.saveData(emptyData);
      return emptyData;
    }
  }

  private async saveData(data: DatabaseData): Promise<void> {
    await this.ensureDataDir();
    await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
  }

  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // For demo purposes, return a mock admin user
    if (username === 'admin') {
      return { id: 'admin-id', username: 'admin', password: 'hashed-password' };
    }

    const data = await this.loadData();
    return data.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const data = await this.loadData();
    const user: User = {
      id: this.generateId(),
      ...insertUser
    };
    data.users.push(user);
    await this.saveData(data);
    return user;
  }

  // Restaurant methods
  async getRestaurant(): Promise<Restaurant | undefined> {
    const data = await this.loadData();
    return data.restaurants[0];
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const data = await this.loadData();
    const newRestaurant: Restaurant = {
      id: this.generateId(),
      createdAt: new Date(),
      ...restaurant
    };
    data.restaurants.push(newRestaurant);
    await this.saveData(data);
    return newRestaurant;
  }

  async updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant> {
    const data = await this.loadData();
    const index = data.restaurants.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Restaurant not found');
    }

    data.restaurants[index] = { ...data.restaurants[index], ...restaurant };
    await this.saveData(data);
    return data.restaurants[index];
  }

  // Category methods
  async getCategories(restaurantId: string): Promise<Category[]> {
    const data = await this.loadData();
    return data.categories.filter(category => category.restaurantId === restaurantId);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const data = await this.loadData();
    const newCategory: Category = {
      id: this.generateId(),
      ...category
    };
    data.categories.push(newCategory);
    await this.saveData(data);
    return newCategory;
  }

  // Food item methods
  async getFoodItems(restaurantId: string, categoryId?: string): Promise<FoodItem[]> {
    console.log(`[DEBUG getFoodItems] restaurantId: ${restaurantId}, categoryId: ${categoryId}`);

    const data = await this.loadData();
    let result = data.foodItems.filter(item => item.restaurantId === restaurantId);

    if (categoryId && categoryId.trim() !== '') {
      result = result.filter(item => item.categoryId === categoryId);
      console.log(`[DEBUG getFoodItems] Filtered by categoryId ${categoryId} - found ${result.length} items`);
    } else {
      console.log(`[DEBUG getFoodItems] No category filter - showing all ${result.length} items`);
    }

    // Sort by category for better organization
    result.sort((a, b) => {
      if (a.categoryId && b.categoryId) {
        return a.categoryId.localeCompare(b.categoryId);
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }

  async searchFoodItems(restaurantId: string, query: string): Promise<FoodItem[]> {
    const data = await this.loadData();
    return data.foodItems.filter(item => 
      item.restaurantId === restaurantId && 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createFoodItem(foodItem: InsertFoodItem): Promise<FoodItem> {
    const data = await this.loadData();
    const newFoodItem: FoodItem = {
      id: this.generateId(),
      isAvailable: true,
      rating: "0.0",
      ...foodItem
    };
    data.foodItems.push(newFoodItem);
    await this.saveData(data);
    return newFoodItem;
  }

  async deleteFoodItem(id: string): Promise<void> {
    const data = await this.loadData();
    data.foodItems = data.foodItems.filter(item => item.id !== id);
    await this.saveData(data);
  }

  async updateFoodItem(id: string, foodItem: Partial<InsertFoodItem>): Promise<FoodItem> {
    const data = await this.loadData();
    const index = data.foodItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Food item not found');
    }

    data.foodItems[index] = { ...data.foodItems[index], ...foodItem };
    await this.saveData(data);
    return data.foodItems[index];
  }

  // Banner methods
  async getBanners(restaurantId: string): Promise<Banner[]> {
    const data = await this.loadData();
    return data.banners
      .filter(banner => banner.restaurantId === restaurantId && banner.isActive)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const data = await this.loadData();
    const newBanner: Banner = {
      id: this.generateId(),
      isActive: true,
      createdAt: new Date(),
      ...banner
    };
    data.banners.push(newBanner);
    await this.saveData(data);
    return newBanner;
  }

  async updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner> {
    const data = await this.loadData();
    const index = data.banners.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Banner not found');
    }

    data.banners[index] = { ...data.banners[index], ...banner };
    await this.saveData(data);
    return data.banners[index];
  }

  async deleteBanner(id: string): Promise<void> {
    const data = await this.loadData();
    const index = data.banners.findIndex(b => b.id === id);
    if (index !== -1) {
      data.banners[index].isActive = false;
      await this.saveData(data);
    }
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const data = await this.loadData();
    const newOrder: Order = {
      id: this.generateId(),
      createdAt: new Date(),
      ...order
    };
    data.orders.push(newOrder);
    await this.saveData(data);
    return newOrder;
  }

  async getOrders(restaurantId: string): Promise<Order[]> {
    const data = await this.loadData();
    return data.orders
      .filter(order => order.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getOrderWithItems(orderId: string): Promise<(Order & { orderItems: (OrderItem & { foodItem: FoodItem })[] }) | undefined> {
    const data = await this.loadData();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return undefined;

    const orderItems = data.orderItems
      .filter(item => item.orderId === orderId)
      .map(orderItem => {
        const foodItem = data.foodItems.find(fi => fi.id === orderItem.foodItemId);
        return {
          ...orderItem,
          foodItem: foodItem!
        };
      });

    return {
      ...order,
      orderItems
    };
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
    const data = await this.loadData();
    const index = data.orders.findIndex(o => o.id === orderId);
    if (index === -1) return undefined;

    data.orders[index].status = status;
    await this.saveData(data);
    return data.orders[index];
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const data = await this.loadData();
    const newOrderItem: OrderItem = {
      id: this.generateId(),
      ...orderItem
    };
    data.orderItems.push(newOrderItem);
    await this.saveData(data);
    return newOrderItem;
  }

  // Database management methods
  async exportData(): Promise<DatabaseData> {
    return await this.loadData();
  }

  async importData(data: DatabaseData): Promise<void> {
    await this.saveData(data);
  }

  async updateRestaurant(id: string, updateData: any): Promise<Restaurant | null> {
    const data = await this.loadData();
    const index = data.restaurants.findIndex((r: Restaurant) => r.id === id);
    if (index === -1) {
      throw new Error("Restaurant not found");
    }

    data.restaurants[index] = { ...data.restaurants[index], ...updateData, updatedAt: new Date() };
    await this.saveData(data);
    return data.restaurants[index];
  }

  // User methods (placeholder implementation)
  async getUser(id: string): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users.find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const data = await this.loadData();
    const newUser: User = {
      id: this.generateId(),
      createdAt: new Date(),
      ...user
    };
    data.users.push(newUser);
    await this.saveData(data);
    return newUser;
  }
}

export const storage = new FileStorage();