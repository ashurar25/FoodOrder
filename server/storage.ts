import { 
  restaurants, categories, foodItems, banners, orders, orderItems,
  type Restaurant, type InsertRestaurant,
  type Category, type InsertCategory,
  type FoodItem, type InsertFoodItem,
  type Banner, type InsertBanner,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type User, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

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
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // For demo purposes, return a mock admin user
    if (username === 'admin') {
      return { id: 'admin-id', username: 'admin', password: 'hashed-password' };
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Mock implementation
    return { id: 'new-user-id', ...insertUser };
  }

  // Restaurant methods
  async getRestaurant(): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).limit(1);
    return restaurant || undefined;
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [created] = await db.insert(restaurants).values(restaurant).returning();
    return created;
  }

  async updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant> {
    const [updated] = await db.update(restaurants)
      .set(restaurant)
      .where(eq(restaurants.id, id))
      .returning();
    return updated;
  }

  // Category methods
  async getCategories(restaurantId: string): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.restaurantId, restaurantId));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  // Food item methods
  async getFoodItems(restaurantId: string, categoryId?: string): Promise<FoodItem[]> {
    const query = db.select().from(foodItems).where(eq(foodItems.restaurantId, restaurantId));
    
    if (categoryId) {
      return await query.where(and(eq(foodItems.restaurantId, restaurantId), eq(foodItems.categoryId, categoryId)));
    }
    
    return await query;
  }

  async searchFoodItems(restaurantId: string, query: string): Promise<FoodItem[]> {
    return await db.select().from(foodItems)
      .where(and(
        eq(foodItems.restaurantId, restaurantId),
        sql`LOWER(${foodItems.name}) LIKE LOWER(${'%' + query + '%'})`
      ));
  }

  async createFoodItem(foodItem: InsertFoodItem): Promise<FoodItem> {
    const [created] = await db.insert(foodItems).values(foodItem).returning();
    return created;
  }

  async deleteFoodItem(id: string): Promise<void> {
    await db.delete(foodItems).where(eq(foodItems.id, id));
  }

  async updateFoodItem(id: string, foodItem: Partial<InsertFoodItem>): Promise<FoodItem> {
    const [updated] = await db.update(foodItems)
      .set(foodItem)
      .where(eq(foodItems.id, id))
      .returning();
    return updated;
  }

  // Banner methods
  async getBanners(restaurantId: string): Promise<Banner[]> {
    return await db.select().from(banners)
      .where(and(eq(banners.restaurantId, restaurantId), eq(banners.isActive, true)))
      .orderBy(desc(banners.createdAt));
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const [created] = await db.insert(banners).values(banner).returning();
    return created;
  }

  async updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner> {
    const [updated] = await db.update(banners)
      .set(banner)
      .where(eq(banners.id, id))
      .returning();
    return updated;
  }

  async deleteBanner(id: string): Promise<void> {
    await db.update(banners)
      .set({ isActive: false })
      .where(eq(banners.id, id));
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values(order).returning();
    return created;
  }

  async getOrders(restaurantId: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.restaurantId, restaurantId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrderWithItems(orderId: string): Promise<(Order & { orderItems: (OrderItem & { foodItem: FoodItem })[] }) | undefined> {
    const order = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order[0]) return undefined;

    const items = await db.select({
      orderItem: orderItems,
      foodItem: foodItems,
    })
    .from(orderItems)
    .leftJoin(foodItems, eq(orderItems.foodItemId, foodItems.id))
    .where(eq(orderItems.orderId, orderId));

    return {
      ...order[0],
      orderItems: items.map(item => ({
        ...item.orderItem,
        foodItem: item.foodItem!,
      })),
    };
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [created] = await db.insert(orderItems).values(orderItem).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
