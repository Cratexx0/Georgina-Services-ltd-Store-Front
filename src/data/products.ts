// import { clothingProducts } from "../lib/_Clothingproducts";

import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/type";

export const products: Product[] = [];

export const useProductData = () => {
	const result = useProducts();
	products.splice(0, products.length, ...result.products);
	return result;
};

// Helper functions
export const getProductsByCategory = (categoryId: string): Product[] => {
	return products.filter((product) => product.categoryLevel1 === categoryId);
};

export const getProductsBySubcategory = (subcategoryId: string): Product[] => {
	return products.filter((product) => product.categoryLevel2 === subcategoryId);
};

export const getProductById = (id: number): Product | undefined => {
	return products.find((product) => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
	return products.find((product) => product.slug === slug);
};

export const getTrendingProducts = (): Product[] => {
	return products.filter((product) => product.isTrending === true);
};

export const getNewArrivalProducts = (): Product[] => {
	return products.filter((product) => product.isNewArrival === true);
};

export const getFeaturedProducts = (): Product[] => {
	return products.filter((product) => product.isFeatured === true);
};

export const searchProducts = (query: string): Product[] => {
	if (!query.trim()) return [];
	const lowerQuery = query.toLowerCase();
	return products.filter(
		(product) =>
			product.name.toLowerCase().includes(lowerQuery) ||
			product.description.toLowerCase().includes(lowerQuery) ||
			product.slug.toLowerCase().includes(lowerQuery),
	);
};
