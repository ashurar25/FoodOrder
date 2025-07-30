# Restaurant Ordering System - Architecture Documentation

## Overview

This is a full-stack restaurant ordering system built with React (frontend) and Express.js (backend). The application allows customers to browse food items, add them to a cart, and place orders. It also includes an admin panel for managing promotional banners and viewing orders. The system uses a PostgreSQL database with Drizzle ORM for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation (via @hookform/resolvers)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL using Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Session Management**: PostgreSQL-based sessions (connect-pg-simple)
- **API Design**: RESTful endpoints with JSON responses

### Database Schema
The system uses the following main entities:
- **Restaurants**: Store restaurant information (name, description, logo)
- **Categories**: Food item categories with icons
- **Food Items**: Menu items with pricing, descriptions, and images
- **Banners**: Promotional banners for marketing
- **Orders**: Customer orders with status tracking
- **Order Items**: Individual items within orders

## Key Components

### Frontend Components
1. **Restaurant Header**: Displays restaurant info and cart status
2. **Search Bar**: Allows customers to search for food items
3. **Promotional Banner**: Rotating banner display for promotions
4. **Category Buttons**: Navigation between food categories
5. **Food Item Cards**: Display individual menu items with ratings
6. **Cart Modal**: Shopping cart management with quantity controls
7. **Admin Panel**: Management interface for banners and orders
8. **Database Configuration**: External database setup and data management interface
9. **Bottom Navigation**: Mobile-friendly navigation bar

### Backend Services
1. **Storage Layer**: Database abstraction with repository pattern
2. **Route Handlers**: Express route definitions for all API endpoints
3. **Database Connection**: File-based storage with JSON persistence (server/data/database.json)
4. **Initialization Service**: Default data setup for new restaurants
5. **Database Management**: Admin interface for external database configuration and data import/export

## Data Flow

### Customer Order Flow
1. Customer browses categories and food items
2. Items are added to cart (client-side state)
3. Order is submitted to backend via POST /api/orders
4. Backend creates order and order items records
5. Success confirmation returned to client

### Admin Management Flow
1. Admin accesses admin panel
2. Banner management: Create/update promotional banners
3. Order monitoring: View all customer orders
4. Real-time updates via React Query invalidation

### Search and Filtering
1. Search queries sent to backend with debouncing
2. Category filtering handled on backend
3. Results returned as filtered food item arrays
4. Client updates UI reactively

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting
- **Carousel**: Embla Carousel for banner rotation
- **Utilities**: clsx and tailwind-merge for conditional styling

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm and drizzle-kit for database operations
- **Validation**: Zod for runtime type checking
- **Development**: tsx for TypeScript execution in development

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Integration**: Development environment optimizations

## Deployment Strategy

### Build Process
1. Frontend built with Vite to `dist/public`
2. Backend bundled with ESBuild to `dist/index.js`
3. Database migrations applied via `drizzle-kit push`
4. Static assets served by Express in production

### Environment Configuration
- `NODE_ENV`: Controls development vs production behavior
- `DATABASE_URL`: PostgreSQL connection string (required)
- Development includes Vite dev server with HMR
- Production serves static files from Express

### Database Management
- Schema defined in `shared/schema.ts`
- File-based storage using JSON (server/data/database.json)
- Admin interface for database configuration and external database setup
- Data export/import functionality for backup and migration
- UUID primary keys for all entities
- Automatic timestamps for audit trails

## Recent Changes (July 30, 2025)
- ✓ Migrated from Replit Agent to Replit environment
- ✓ Fixed admin panel syntax errors and layout issues  
- ✓ Added database management interface for external database configuration
- ✓ Implemented data import/export functionality with CSV export support
- ✓ Added comprehensive image upload component for banners/menu items/logos
- ✓ Created restaurant management page for editing name, description, and logo
- ✓ Added admin route for restaurant settings (/admin/restaurant)
- ✓ Enhanced backend with restaurant update and image upload endpoints
- ✓ Added static image serving from server/data/images directory
- ✓ Implemented CSV export alongside JSON export for orders data

The architecture emphasizes type safety, developer experience, and maintainability while providing a responsive user interface for both customers and administrators.