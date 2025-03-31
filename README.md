# E-Commerce Application

## Overview

This is a modern, full-stack e-commerce application built with a hybrid architecture, combining Next.js for the frontend and a multi-database backend (Supabase and MongoDB). The application features a custom authentication system, comprehensive product management, shopping cart functionality, checkout process, and order management.

### User Credentials (For Testing)

email: admin@example.com
password: admin123

## System Architecture

### Frontend

- **Framework**: Next.js with React
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API and custom hooks
- **Authentication**: Custom implementation using JWT tokens and localStorage
- **Parallel Routing**: Parallel routes for app skeleton such that whole app dont have to rerender when a specific slot is changed

### Backend

- **Server**: Node.js with Express.js
- **Authentication**: JWT-based with custom middleware
- **Primary Database**: Supabase (PostgreSQL)
- **Legacy Database**: MongoDB (for specific collections)
- **API Design**: RESTful endpoints with proper error handling

## Key Features

### Authentication System

- Custom implementation replacing Next-Auth
- JWT-based with token storage in localStorage
- Protected routes with AuthOnly wrapper component
- User registration, login, and profile management

### Product Management

- Browsing products by category
- Product details view with descriptions and pricing
- Advanced filtering and search capabilities
- Admin panel for product management (CRUD operations)

### Shopping Cart

- Client-side cart state management
- Add/remove items and change quantities
- Persistent cart data between sessions
- Real-time price calculations

### Checkout Process

- Secure order placement with proper validation
- Integration with database for order storage
- Support for both SQL and NoSQL database IDs
- Error handling and transaction management

### Order Management

- Order history for users
- Detailed view of individual orders
- Status tracking for orders
- Admin reporting on sales and revenue

## Database Structure

The application uses a hybrid database approach:

### Supabase (PostgreSQL)

- Users
- Orders
- Order Items
- Analytics data

### MongoDB

- Products and product metadata
- Legacy data still in transition

## Technical Implementation Details

### Custom Database Adapter

The application includes custom functionality to handle the differences between MongoDB's ObjectID format and Supabase's UUID format, specifically:

- SQL functions to handle MongoDB-style IDs in PostgreSQL
- Type conversions between different ID formats
- Fallback mechanisms for database operations

### Authentication Flow

1. User credentials are validated against the backend
2. JWT token is generated and stored in localStorage
3. Token is included in API requests via Authorization header
4. Protected routes check for valid tokens before allowing access

### Checkout Process

1. Cart items are validated
2. Order is created in the database
3. Order items are linked to the order with proper ID handling
4. User is redirected to order confirmation
5. Cart is cleared after successful checkout

## Running the Application

### Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- Supabase account and project
- MongoDB instance (optional)
- Environment variables properly configured

### Environment Setup

Create a `.env` file in both the `client` and `backend` directories with the following variables:

```
# Backend .env
PORT=5040
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
MONGODB_URI=your_mongodb_uri

# Client .env
NEXT_PUBLIC_API_URL=http://localhost:5040/api
```

### Installation and Setup

1. **Clone the repository**

   ```
   git clone [repository-url]
   cd ecommerce-app
   ```

2. **Install dependencies**

   ```
   # Backend
   cd backend
   npm install

   # Client
   cd ../client
   npm install
   ```

3. **Database Setup**

   ```
   cd ../backend
   node setup.js
   ```

   This script will set up the necessary database functions and schema modifications in Supabase.

4. **Start the application**

   ```
   # Backend (in one terminal)
   cd backend
   npm run dev

   # Client (in another terminal)
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5040/api

## Testing the Application

### User Flow Testing

1. Register a new user account
2. Browse products and add items to cart
3. Proceed to checkout and place an order
4. View order history and details

### Admin Flow Testing

1. Login with admin credentials
2. Access admin dashboard
3. View sales reports and order statistics
4. Manage products and user accounts

## Troubleshooting

### Checkout Issues

If you encounter issues with checkout, especially related to UUID validation:

1. Run the setup script: `node backend/setup.js`
2. Access the setup endpoint: `http://localhost:5040/api/admin/setup-database`
3. Check the database schema via: `http://localhost:5040/api/orders/check-schema`

### Authentication Issues

If authentication is not working:

1. Check localStorage for the auth token in browser dev tools
2. Verify JWT_SECRET is consistent between environments
3. Check expiration time on the token

## Database Schema Details

### Users Table

- id (UUID, primary key)
- username (string)
- email (string, unique)
- password (string, hashed)
- created_at (timestamp)
- updated_at (timestamp)

### Orders Table

- id (UUID, primary key)
- user_id (UUID, foreign key)
- total_amount (decimal)
- status (enum: pending, completed, cancelled)
- created_at (timestamp)
- updated_at (timestamp)

### Order Items Table

- id (UUID, primary key)
- order_id (UUID, foreign key)
- product_id (text, stores MongoDB-style IDs)
- product_name (string)
- price (decimal)
- quantity (integer)
- created_at (timestamp)
- updated_at (timestamp)

## Technical Challenges and Solutions

### MongoDB-Supabase Integration

- **Challenge**: MongoDB uses string IDs while Supabase expects UUIDs
- **Solution**: Custom SQL functions to handle string IDs in Supabase, with automatic schema modification

### Authentication Migration

- **Challenge**: Moving from Next-Auth to custom JWT implementation
- **Solution**: Custom AuthProvider and useAuth hook for consistent auth state management

### Database Transactions

- **Challenge**: Ensuring data consistency during checkout
- **Solution**: Fallback mechanisms and cleanup procedures if any part of the transaction fails

## Future Enhancements

1. Payment gateway integration
2. Real-time order tracking
3. Enhanced analytics dashboard
4. Product recommendation engine
5. Complete migration from MongoDB to Supabase

## Things that I missed out

Note: Due to lack of time, I did not host the backend service to any hosting provider, neither did I hoster the front end to any provider.

Although, Here I am writing down all the steps necessary to deploy the services to cloud.

### For Backend

I mostly use render or amplify for deploying backend services. Render provides a free tier which is straight forward to use. Amplify is a paid service that requires more configuration but is a long term configuration.

### For Frontend

I use vercel for all of my frontend deployments because it provides good dx and creating CI/CD on vercel is straight forward. We need to give access to github repo to vercel, ANd then select the branch we want to configure, then add .env variables and any build commands if present whichresults in a deployed url we get from the platform.

## Contact and Support

For any questions or issues during testing, please contact me at [vishesh.bajpayee@icloud.com].

---

Thank you for reviewing our e-commerce application. I look forward to your feedback!
