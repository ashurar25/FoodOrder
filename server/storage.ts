import { db } from './db';
import { restaurants, categories, foodItems, banners, orders, orderItems } from '../shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Initialize database with default data if empty
export async function initDatabase() {
  try {
    // Check if restaurant exists
    const existingRestaurant = await db.select().from(restaurants).limit(1);

    if (existingRestaurant.length === 0) {
      // Create default restaurant
      const restaurantId = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;

      await db.insert(restaurants).values({
        id: restaurantId,
        name: 'ซ้อมคอ',
        description: 'เกาหลี-ไทย ฟิวชัน',
        logoUrl: '/api/images/1753907698507_logo.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create default categories
      const categoryIds = [
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`, name: 'ลาบ/ส้มตำ' },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 1}`, name: 'ข้าวผัด/เส้น' },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 2}`, name: 'ทอด/ย่าง' },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 3}`, name: 'เครื่องดื่ม' }
      ];

      for (const cat of categoryIds) {
        await db.insert(categories).values({
          id: cat.id,
          restaurantId: restaurantId,
          name: cat.name,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      console.log('Database initialized with default data');
    }

    return await db.select().from(restaurants).limit(1);
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Restaurant operations
export async function getRestaurant() {
  const result = await db.select().from(restaurants).limit(1);
  return result[0] || null;
}

export async function updateRestaurant(data: any) {
  const restaurant = await getRestaurant();
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  await db.update(restaurants)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(restaurants.id, restaurant.id));

  return await getRestaurant();
}

// Category operations
export async function getCategories(restaurantId: string) {
  return await db.select().from(categories)
    .where(eq(categories.restaurantId, restaurantId))
    .orderBy(categories.createdAt);
}

// Food items operations
export async function getFoodItems(restaurantId: string, categoryId?: string) {
  let query = db.select().from(foodItems)
    .where(eq(foodItems.restaurantId, restaurantId));

  if (categoryId && categoryId !== 'all') {
    query = query.where(and(
      eq(foodItems.restaurantId, restaurantId),
      eq(foodItems.categoryId, categoryId)
    ));
  }

  return await query.orderBy(foodItems.createdAt);
}

export async function createFoodItem(data: any) {
  const id = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;
  const foodItem = {
    id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await db.insert(foodItems).values(foodItem);
  return foodItem;
}

export async function updateFoodItem(id: string, data: any) {
  await db.update(foodItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(foodItems.id, id));

  const result = await db.select().from(foodItems).where(eq(foodItems.id, id));
  return result[0];
}

export async function deleteFoodItem(id: string) {
  await db.delete(foodItems).where(eq(foodItems.id, id));
}

// Banner operations
export async function getBanners(restaurantId: string) {
  return await db.select().from(banners)
    .where(eq(banners.restaurantId, restaurantId))
    .orderBy(banners.createdAt);
}

export async function createBanner(data: any) {
  const id = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;
  const banner = {
    id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await db.insert(banners).values(banner);
  return banner;
}

export async function updateBanner(id: string, data: any) {
  await db.update(banners)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(banners.id, id));

  const result = await db.select().from(banners).where(eq(banners.id, id));
  return result[0];
}

export async function deleteBanner(id: string) {
  await db.delete(banners).where(eq(banners.id, id));
}

// Order operations
export async function createOrder(data: any) {
  const orderId = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;
  const order = {
    id: orderId,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await db.insert(orders).values(order);

  // Insert order items
  if (data.items && Array.isArray(data.items)) {
    for (const item of data.items) {
      await db.insert(orderItems).values({
        id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: orderId,
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        price: item.price,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  return order;
}

export async function getOrders(restaurantId: string) {
  const ordersData = await db.select().from(orders)
    .where(eq(orders.restaurantId, restaurantId))
    .orderBy(desc(orders.createdAt));

  // Get order items for each order
  const ordersWithItems = [];
  for (const order of ordersData) {
    const items = await db.select().from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    ordersWithItems.push({
      ...order,
      items
    });
  }

  return ordersWithItems;
}