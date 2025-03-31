import { useAuth } from "@/lib/hooks/useAuth";

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

export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
}

export interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

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

export interface AuthContextType {
  user: ReturnType<typeof useAuth>["user"];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: ReturnType<typeof useAuth>["login"];
  register: ReturnType<typeof useAuth>["register"];
  logout: ReturnType<typeof useAuth>["logout"];
}

export interface AuthOnlyProps {
  children: React.ReactNode;
  fallback?: string; // URL to redirect to if not authenticated
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}
export interface ProductCardProps {
  product: Product;
}

export interface ProductFilterProps {
  activeCategory?: string;
  activeSearch?: string;
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (search: string | null) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
