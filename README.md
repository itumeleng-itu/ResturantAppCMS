# Restaurant App CMS

A Content Management System (CMS) for restaurant administration. This application allows restaurant administrators to manage orders, inventory, and view analytics.

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite (Rolldown)
- **Styling**: Tailwind CSS 4
- **Backend/Database**: Supabase (PostgreSQL)
- **Charts**: Chart.js with react-chartjs-2
- **Routing**: React Router DOM 7
- **Icons**: Google Material Icons

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ResturantAppCMS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## Folder Structure

```
src/
├── app/                    # Application entry points
│   ├── App.tsx            # Root component
│   ├── main.tsx           # React entry point
│   └── router.tsx         # Route definitions
│
├── components/             # Reusable UI components
│   ├── common/            # Shared components (buttons, inputs)
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── FavouritesChart.tsx
│   │   ├── InventoryCard.tsx
│   │   ├── OrderManagementCard.tsx
│   │   ├── RevenueCard.tsx
│   │   ├── StatsCard.tsx
│   │   └── index.ts
│   ├── inventory/         # Inventory management components
│   │   ├── ItemFormModal.tsx
│   │   ├── MenuItemCard.tsx
│   │   └── index.ts
│   ├── layout/            # Layout components (header, sidebar)
│   ├── orders/            # Order management components
│   │   ├── OrderCard.tsx
│   │   └── index.ts
│   └── ui/                # Base UI components
│
├── context/               # React Context providers
│
├── features/              # Feature-specific modules
│   ├── auth/              # Authentication feature
│   ├── profile/           # User profile feature
│   └── reservations/      # Reservations feature
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useDashboardData.ts # Dashboard data fetching
│   ├── useInventory.ts    # Inventory operations
│   └── useOrders.ts       # Order operations
│
├── lib/                    # External library configurations
│   └── supabaseClient.ts  # Supabase client setup
│
├── pages/                  # Page components (routes)
│   ├── Dashboard.tsx      # Main dashboard
│   ├── Inventory.tsx      # Inventory management
│   ├── LoginPage.tsx      # Admin login
│   ├── Orders.tsx         # Order management
│   └── ...
│
├── services/              # API service functions
│
├── types/                  # TypeScript type definitions
│   ├── inventory.ts       # Inventory types
│   └── orders.ts          # Order types
│
├── utils/                  # Utility functions
│   ├── categoryIcons.ts   # Category icon mapping
│   └── chartConfig.ts     # Chart.js configuration
│
└── index.css              # Global styles
```

## Architecture Principles

### Separation of Concerns

The codebase follows these principles:

1. **Pages** - Handle routing and compose components
2. **Components** - Reusable UI elements (max 200 lines per file)
3. **Hooks** - Business logic and data fetching
4. **Types** - TypeScript interfaces and type definitions
5. **Utils** - Pure helper functions

### File Size Limit

All component files are kept under 200 lines of code for maintainability.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Features

- **Dashboard**: Overview of revenue, orders, and analytics
- **Order Management**: View and update order statuses with real-time updates
- **Inventory Management**: Add, edit, and delete menu items
- **Authentication**: Secure admin-only access

## Database Schema

The application expects the following Supabase tables:

- `profiles` - User profiles with role information
- `orders` - Customer orders
- `order_items` - Items within each order
- `menu_items` - Menu items/products
- `categories` - Menu categories

## License

Private - All rights reserved
