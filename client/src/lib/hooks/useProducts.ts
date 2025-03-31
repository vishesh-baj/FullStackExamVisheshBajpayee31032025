import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  getGroupedProducts,
  type ProductsQueryParams,
} from "../api";

export function useProducts(params: ProductsQueryParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: (keepPreviousData) => keepPreviousData, // Use previous data while new data is being fetched
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
    enabled: !!id, // Only run the query if id is provided
  });
}

export function useGroupedProducts() {
  return useQuery({
    queryKey: ["products", "grouped"],
    queryFn: () => getGroupedProducts(),
  });
}
