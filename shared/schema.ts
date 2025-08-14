export interface DatabaseConfig {
  type: 'local' | 'external';
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  cuisine: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
  icon?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  restaurantId: string;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface OrderItem {
  foodItemId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  altText?: string;
  link?: string;
  restaurantId: string;
  title?: string;
  description?: string;
  linkUrl?: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface Database {
  restaurant: Restaurant;
  categories: Category[];
  foodItems: FoodItem[];
  banners: Banner[];
  orders: Order[];
  users: User[];
  theme: ThemeSettings;
  databaseConfig: DatabaseConfig;
}