import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Path to data directory
const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default database structure
const defaultData = {
  restaurants: [],
  categories: [],
  foodItems: [],
  banners: [],
  orders: [],
  orderItems: []
};

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Read database from JSON file
async function readDatabase() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return default data
    return { ...defaultData };
  }
}

// Write database to JSON file
async function writeDatabase(data: any) {
  await ensureDataDir();
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Initialize database with default data if empty
export async function initDatabase() {
  try {
    const db = await readDatabase();

    // Create default restaurant if none exists
    if (!db.restaurants || db.restaurants.length === 0) {
      const restaurantId = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;
      const defaultRestaurant = {
        id: restaurantId,
        name: 'ซ้อมคอ',
        description: 'เกาหลี-ไทย ฟิวชัน',
        logoUrl: '/api/images/HLogo_1753815594471.png',
        receiptImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.restaurants = [defaultRestaurant];
      console.log('Created default restaurant:', defaultRestaurant);

      // Create default categories
      const categories = [
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`, name: 'ลูกชิ้น', icon: '🍲', restaurantId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 1}`, name: 'อาหาร', icon: '🍛', restaurantId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 2}`, name: 'เครื่องดื่ม', icon: '🥤', restaurantId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];

      db.categories.push(...categories);

      // Sample meatball items (ลูกชิ้น)
      const meatballCategory = categories[0];
      const meatballItems = [
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 10}`, name: 'ลูกชิ้นหมู', description: 'ลูกชิ้นหมูสด เนื้อแน่น รสชาติเข้มข้น', price: '25.00', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.7', categoryId: meatballCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 11}`, name: 'ลูกชิ้นเนื้อ', description: 'ลูกชิ้นเนื้อวัว เนื้อแน่น หอมหวาน', price: '30.00', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.4', categoryId: meatballCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 12}`, name: 'ลูกชิ้นปลาหมึก', description: 'ลูกชิ้นปลาหมึกสด เคี้ยวเหนียว', price: '28.00', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.2', categoryId: meatballCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 13}`, name: 'ลูกชิ้นปลา', description: 'ลูกชิ้นปลาสดใหม่ หวานหอม', price: '27.00', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.5', categoryId: meatballCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 14}`, name: 'ลูกชิ้นกุ้ง', description: 'ลูกชิ้นกุ้งแท้ เนื้อกุ้งแน่น', price: '35.00', imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.6', categoryId: meatballCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];

      // Sample food items (อาหาร)
      const foodCategory = categories[1];
      const foodItems = [
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 20}`, name: 'ข้าวผัดกุ้ง', description: 'ข้าวผัดกุ้งสด หอมกรุ่น', price: '45.00', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.6', categoryId: foodCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 21}`, name: 'ผัดไทย', description: 'ผัดไทยแท้ รสชาติต้นตำรับ', price: '40.00', imageUrl: 'https://images.unsplash.com/photo-1559314809-0f31657b9ccd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.8', categoryId: foodCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 22}`, name: 'ต้มยำกุ้ง', description: 'ต้มยำกุ้งน้ำข้น รสเข้มข้น', price: '55.00', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.9', categoryId: foodCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 23}`, name: 'แกงเขียวหวานไก่', description: 'แกงเขียวหวานไก่ เผ็ดร้อน', price: '50.00', imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.5', categoryId: foodCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 24}`, name: 'ส้มตำไทย', description: 'ส้มตำไทยแซ่บ เผ็ดจี๊ดจ๊าด', price: '35.00', imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.7', categoryId: foodCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];

      // Sample drink items (เครื่องดื่ม)
      const drinkCategory = categories[2];
      const drinkItems = [
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 30}`, name: 'น้ำส้ม', description: 'น้ำส้มคั้นสด เซาต์จัด', price: '15.00', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.3', categoryId: drinkCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 31}`, name: 'ชาเย็น', description: 'ชาเย็นหอมหวาน รสชาติเข้มข้น', price: '18.00', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.5', categoryId: drinkCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 32}`, name: 'กาแฟเย็น', description: 'กาแฟเย็นเข้มข้น หอมกรุ่น', price: '20.00', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.6', categoryId: drinkCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 33}`, name: 'น้ำแข็งใส', description: 'น้ำแข็งใสเย็นชื่นใจ', price: '10.00', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.2', categoryId: drinkCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 34}`, name: 'น้ำมะนาว', description: 'น้ำมะนาวสด เซาต์เปรี้ยว', price: '12.00', imageUrl: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200', rating: '4.4', categoryId: drinkCategory.id, restaurantId, isAvailable: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];

      db.foodItems.push(...meatballItems, ...foodItems, ...drinkItems);

      // Create sample banners
      const sampleBanners = [
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 40}`, title: '10 ไข่ ฟรี 1', subtitle: 'โปรโมชั่นพิเศษ', imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200', restaurantId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: `id_${uuidv4().replace(/-/g, '_')}_${Date.now() + 41}`, title: 'ลดราคาพิเศษ 20%', subtitle: 'สำหรับอาหารทุกจาน', imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200', restaurantId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];

      db.banners.push(...sampleBanners);

      await writeDatabase(db);
      console.log('Database initialized with sample data');
    }

    return db.restaurants[0] || null;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Restaurant operations
export async function getRestaurant() {
  const db = await readDatabase();
  return db.restaurants[0] || null;
}

export async function createRestaurant(data: any) {
  const db = await readDatabase();
  const id = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;
  const restaurant = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.restaurants.push(restaurant);
  await writeDatabase(db);
  return restaurant;
}

export async function updateRestaurant(id: string, data: any) {
  const db = await readDatabase();
  const restaurant = db.restaurants.find((r: any) => r.id === id);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  Object.assign(restaurant, data, { updatedAt: new Date().toISOString() });
  await writeDatabase(db);
  return restaurant;
}

// Category operations
export async function getCategories(restaurantId: string) {
  const db = await readDatabase();
  return db.categories.filter((c: any) => c.restaurantId === restaurantId);
}

export async function createCategory(data: any) {
  const db = await readDatabase();
  const id = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;
  const category = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.categories.push(category);
  await writeDatabase(db);
  return category;
}

// Food items operations
export async function getFoodItems(restaurantId: string, categoryId?: string) {
  const db = await readDatabase();
  let items = db.foodItems.filter((f: any) => f.restaurantId === restaurantId);

  if (categoryId && categoryId !== 'all') {
    items = items.filter((f: any) => f.categoryId === categoryId);
  }

  return items;
}

export async function searchFoodItems(restaurantId: string, query: string) {
  const db = await readDatabase();
  return db.foodItems.filter((f: any) => 
    f.restaurantId === restaurantId && 
    (f.name.toLowerCase().includes(query.toLowerCase()) || 
     f.description.toLowerCase().includes(query.toLowerCase()))
  );
}

export async function createFoodItem(data: any) {
  const db = await readDatabase();
  const id = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;
  const foodItem = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.foodItems.push(foodItem);
  await writeDatabase(db);
  return foodItem;
}

export async function updateFoodItem(id: string, data: any) {
  const db = await readDatabase();
  const foodItem = db.foodItems.find((f: any) => f.id === id);
  if (!foodItem) {
    throw new Error('Food item not found');
  }

  Object.assign(foodItem, data, { updatedAt: new Date().toISOString() });
  await writeDatabase(db);
  return foodItem;
}

export async function deleteFoodItem(id: string) {
  const db = await readDatabase();
  db.foodItems = db.foodItems.filter((f: any) => f.id !== id);
  await writeDatabase(db);
}

// Banner operations
export async function getBanners(restaurantId: string) {
  const db = await readDatabase();
  return db.banners.filter((b: any) => b.restaurantId === restaurantId);
}

export async function createBanner(data: any) {
  const db = await readDatabase();
  const id = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;
  const banner = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.banners.push(banner);
  await writeDatabase(db);
  return banner;
}

export async function updateBanner(id: string, data: any) {
  const db = await readDatabase();
  const banner = db.banners.find((b: any) => b.id === id);
  if (!banner) {
    throw new Error('Banner not found');
  }

  Object.assign(banner, data, { updatedAt: new Date().toISOString() });
  await writeDatabase(db);
  return banner;
}

export async function deleteBanner(id: string) {
  const db = await readDatabase();
  db.banners = db.banners.filter((b: any) => b.id !== id);
  await writeDatabase(db);
}

// Order operations
export async function createOrder(data: any) {
  const db = await readDatabase();
  const orderId = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}`;
  const order = {
    id: orderId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.push(order);
  await writeDatabase(db);
  return order;
}

export async function createOrderItem(data: any) {
  const db = await readDatabase();
  const id = `id_${uuidv4().replace(/-/g, '_')}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const orderItem = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orderItems.push(orderItem);
  await writeDatabase(db);
  return orderItem;
}

export async function getOrders(restaurantId: string) {
  const db = await readDatabase();
  const orders = db.orders.filter((o: any) => o.restaurantId === restaurantId);

  // Add order items to each order
  return orders.map((order: any) => ({
    ...order,
    items: db.orderItems.filter((item: any) => item.orderId === order.id)
  }));
}

export async function getOrderWithItems(orderId: string) {
  const db = await readDatabase();
  const order = db.orders.find((o: any) => o.id === orderId);
  if (!order) return null;

  const items = db.orderItems.filter((item: any) => item.orderId === orderId);
  return { ...order, items };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const db = await readDatabase();
  const order = db.orders.find((o: any) => o.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  await writeDatabase(db);
  return order;
}

// Data management
export async function exportData() {
  const db = await readDatabase();
  const restaurant = db.restaurants[0] || null;

  return {
    restaurant,
    categories: restaurant ? db.categories.filter((c: any) => c.restaurantId === restaurant.id) : [],
    foodItems: restaurant ? db.foodItems.filter((f: any) => f.restaurantId === restaurant.id) : [],
    banners: restaurant ? db.banners.filter((b: any) => b.restaurantId === restaurant.id) : [],
    orders: restaurant ? db.orders.filter((o: any) => o.restaurantId === restaurant.id) : []
  };
}

export async function importData(data: any) {
  await writeDatabase(data);
}

// User management (placeholder)
export async function getUserByFirebaseUid(firebaseUid: string) {
  return null;
}

export async function createUser(data: any) {
  return { id: 'placeholder', ...data };
}

export async function updateUser(id: string, data: any) {
  return { id, ...data };
}

// Export all functions as storage object for compatibility
export const storage = {
  initDatabase,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  getCategories,
  createCategory,
  getFoodItems,
  searchFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  createOrder,
  createOrderItem,
  getOrders,
  getOrderWithItems,
  updateOrderStatus,
  exportData,
  importData,
  getUserByFirebaseUid,
  createUser,
  updateUser
};