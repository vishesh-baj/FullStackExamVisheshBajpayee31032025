const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5040/api";

// Utility function to get authentication headers
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  products: Product[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

// Authentication interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Login user with credentials
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
}

/**
 * Fetches products with pagination
 */
export async function getProducts(
  params: ProductsQueryParams = {}
): Promise<PaginatedResponse> {
  const { page = 1, limit = 10, category, search } = params;

  let url = `${API_URL}/products?page=${page}&limit=${limit}`;

  if (category) {
    url = `${API_URL}/products/category/${category}?page=${page}&limit=${limit}`;
  } else if (search) {
    url = `${API_URL}/products/search?q=${search}&page=${page}&limit=${limit}`;
  }

  console.log("Fetching products from URL:", url);

  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch products:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Products API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Fetches a single product by ID
 */
export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}

/**
 * Fetches products grouped by category for the homepage
 */
export async function getGroupedProducts(): Promise<Record<string, Product[]>> {
  const response = await fetch(`${API_URL}/products/grouped`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch grouped products");
  }

  return response.json();
}

// Cart and Order interfaces
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

/**
 * Process checkout with cart items
 */
export async function checkout(
  items: CartItem[],
  totalAmount: number
): Promise<{ orderId: string }> {
  const response = await fetch(`${API_URL}/orders/checkout`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ items, totalAmount }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Checkout failed");
  }

  return response.json();
}

/**
 * Get user's order history
 */
export async function getOrderHistory(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders/history`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order history");
  }

  return response.json();
}

/**
 * Get details for a specific order
 */
export async function getOrderDetails(orderId: string): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }

  return response.json();
}
