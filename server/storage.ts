import { Order, User } from './types';

interface Database {
  users?: User[];
  products?: any[];
  orders?: Order[];
  // Add other data structures here
}

export class DataAccessLayer {
  private dbPath = './database.json';

  private async loadDatabase(): Promise<Database> {
    try {
      const data = await Bun.file(this.dbPath).text();
      return JSON.parse(data) as Database;
    } catch (error) {
      console.error('Failed to load database:', error);
      return { users: [], products: [], orders: [] };
    }
  }

  private async saveDatabase(db: Database): Promise<void> {
    try {
      await Bun.write(this.dbPath, JSON.stringify(db, null, 2));
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }

  // Product Management
  async getAllProducts(): Promise<any[]> {
    const db = await this.loadDatabase();
    return db.products || [];
  }

  async getProductById(id: string): Promise<any | null> {
    const db = await this.loadDatabase();
    return db.products?.find(product => product.id === id) || null;
  }

  async createProduct(productData: any): Promise<any> {
    const db = await this.loadDatabase();
    if (!db.products) db.products = [];

    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString()
    };

    db.products.push(newProduct);
    await this.saveDatabase(db);
    return newProduct;
  }

  async updateProduct(id: string, updates: any): Promise<any | null> {
    const db = await this.loadDatabase();
    if (!db.products) return null;

    const productIndex = db.products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;

    db.products[productIndex] = { ...db.products[productIndex], ...updates };
    await this.saveDatabase(db);
    return db.products[productIndex];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const db = await this.loadDatabase();
    if (!db.products) return false;

    const productIndex = db.products.findIndex(product => product.id === id);
    if (productIndex === -1) return false;

    db.products.splice(productIndex, 1);
    await this.saveDatabase(db);
    return true;
  }

  // Order Management
  async getAllOrders(): Promise<Order[]> {
    const db = await this.loadDatabase();
    return db.orders || [];
  }

  // Get a specific order by ID
  async getOrderById(id: string): Promise<Order | null> {
    const db = await this.loadDatabase();
    return db.orders?.find(order => order.id === id) || null;
  }

  // Create a new order
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const db = await this.loadDatabase();
    if (!db.orders) db.orders = [];

    const newOrder: Order = {
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date().toISOString(),
    };

    db.orders.push(newOrder);
    await this.saveDatabase(db);
    return newOrder;
  }

  // Update an existing order
  async updateOrder(id: string, updates: Partial<Omit<Order, 'id' | 'createdAt'>>): Promise<Order | null> {
    const db = await this.loadDatabase();
    if (!db.orders) return null;

    const orderIndex = db.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;

    db.orders[orderIndex] = { ...db.orders[orderIndex], ...updates };
    await this.saveDatabase(db);
    return db.orders[orderIndex];
  }

  // Delete an order
  async deleteOrder(id: string): Promise<boolean> {
    const db = await this.loadDatabase();
    if (!db.orders) return false;

    const orderIndex = db.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return false;

    db.orders.splice(orderIndex, 1);
    await this.saveDatabase(db);
    return true;
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

  async createUser(userData: { email: string; password: string; name: string; role: string }): Promise<User> {
    const db = await this.loadDatabase();
    if (!db.users) db.users = [];

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      password: userData.password, // In production, hash this password
      name: userData.name,
      role: userData.role,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    await this.saveDatabase(db);
    return newUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password) { // In production, compare hashed passwords
      return user;
    }
    return null;
  }

  async updateUser(id: string, updates: { name?: string; email?: string; password?: string }): Promise<User | null> {
    const db = await this.loadDatabase();
    if (!db.users) return null;

    const userIndex = db.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    if (updates.name) db.users[userIndex].name = updates.name;
    if (updates.email) db.users[userIndex].email = updates.email;
    if (updates.password) db.users[userIndex].password = updates.password;

    await this.saveDatabase(db);
    return db.users[userIndex];
  }

  async getAllUsers(): Promise<User[]> {
    const db = await this.loadDatabase();
    return db.users || [];
  }

  async updateUserRole(id: string, role: string): Promise<User | null> {
    const db = await this.loadDatabase();
    if (!db.users) return null;

    const userIndex = db.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    db.users[userIndex].role = role;
    await this.saveDatabase(db);
    return db.users[userIndex];
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
}