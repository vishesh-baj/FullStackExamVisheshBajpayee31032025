import Product, { IProduct } from "../models/product";

export const getProductsGroupedByCategory = async () => {
  return await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalValue: { $sum: "$price" },
        avgPrice: { $avg: "$price" },
        products: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        category: "$_id",
        count: 1,
        totalValue: 1,
        avgPrice: 1,
        _id: 0,
        // Only return first 3 products per category
        products: { $slice: ["$products", 3] },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

export const getPaginatedProducts = async (
  page: number,
  limit: number,
  query: any = {}
): Promise<{ products: IProduct[]; pagination: any }> => {
  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export const searchProducts = async (
  searchTerm: string,
  page: number,
  limit: number
): Promise<{ products: IProduct[]; pagination: any }> => {
  // Use text index for searching
  const query = searchTerm ? { $text: { $search: searchTerm } } : {};

  return getPaginatedProducts(page, limit, query);
};

export const getProductsByCategory = async (
  category: string,
  page: number,
  limit: number
): Promise<{ products: IProduct[]; pagination: any }> => {
  // Case-insensitive search for category
  const query = { category: new RegExp(category, "i") };
  return getPaginatedProducts(page, limit, query);
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};
