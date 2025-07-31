
-- Create restaurants table
CREATE TABLE IF NOT EXISTS "restaurants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"logoUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"restaurantId" text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create food_items table
CREATE TABLE IF NOT EXISTS "food_items" (
	"id" text PRIMARY KEY NOT NULL,
	"restaurantId" text NOT NULL,
	"categoryId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric NOT NULL,
	"imageUrl" text,
	"isAvailable" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create banners table
CREATE TABLE IF NOT EXISTS "banners" (
	"id" text PRIMARY KEY NOT NULL,
	"restaurantId" text NOT NULL,
	"title" text,
	"description" text,
	"imageUrl" text,
	"buttonText" text,
	"buttonLink" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"restaurantId" text NOT NULL,
	"customerName" text,
	"customerPhone" text,
	"total" numeric NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"foodItemId" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "categories" ADD CONSTRAINT "categories_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "food_items" ADD CONSTRAINT "food_items_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "food_items" ADD CONSTRAINT "food_items_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "banners" ADD CONSTRAINT "banners_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_foodItemId_food_items_id_fk" FOREIGN KEY ("foodItemId") REFERENCES "food_items"("id") ON DELETE cascade ON UPDATE no action;
