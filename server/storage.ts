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

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
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

  async updateUserRole(id: string, role: 'customer' | 'admin'): Promise<User | null> {
    return this.updateUser(id, { role });
  }

  async deleteUser(id: string): Promise<boolean> {
    const db = await this.loadDatabase();
    if (!db.users) return false;

    const userIndex = db.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    db.users.splice(userIndex, 1);
    await this.saveDatabase(db);
    return true;
  }

  // Order Management
  async getAllOrders(): Promise<Order[]> {
    const db = await this.loadDatabase();
    return db.orders || [];
  }

  async resetOrders(): Promise<void> {
    const db = await this.loadDatabase();
    db.orders = [];
    await this.saveDatabase(db);
  }

  async getOrderById(id: string): Promise<Order | null> {
    const db = await this.loadDatabase();
    return db.orders?.find(order => order.id === id) || null;
  }

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    const db = await this.loadDatabase();
    if (!db.orders) db.orders = [];

    const newOrder: Order = {
      id: Date.now().toString(),
      ...orderData,
    };

    db.orders.push(newOrder);
    await this.saveDatabase(db);
    return newOrder;
  }

  async updateOrder(id: string, updates: Partial<Omit<Order, 'id'>>): Promise<Order | null> {
    const db = await this.loadDatabase();
    if (!db.orders) return null;

    const orderIndex = db.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;

    db.orders[orderIndex] = { ...db.orders[orderIndex], ...updates };
    await this.saveDatabase(db);
    return db.orders[orderIndex];
  }

  async deleteOrder(id: string): Promise<boolean> {
    const db = await this.loadDatabase();
    if (!db.orders) return false;

    const orderIndex = db.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return false;

    db.orders.splice(orderIndex, 1);
    await this.saveDatabase(db);
    return true;
  }
}

// Create and export the storage instance
const storage = new DataAccessLayer();
export default storage;