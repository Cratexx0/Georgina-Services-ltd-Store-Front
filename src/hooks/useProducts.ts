import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { Product } from "@/lib/type";
import { isClothingProduct } from "@/lib/productUtils";

interface UseProductsResult {
	products: Product[];
	loading: boolean;
	error: string | null;
	total: number;
	page: number;
	limit: number;
}

const useProductFlag = (
	flag: keyof Pick<Product, "isTrending" | "isNewArrival" | "isFeatured">,
	page: number,
	limit: number,
): UseProductsResult => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			try {
				setLoading(true);
				setError(null);
				// Flagged products are paginated by the API, so filtering a small
				// page can incorrectly produce an empty collection.
				const data = await apiService.getProducts(1, 1000);
				const flagged = (data.products || []).filter(
					(product) => product[flag],
				);
				const start = (page - 1) * limit;
				const list = flagged.slice(start, start + limit);
				if (!cancelled) {
					setProducts(list);
					setTotal(flagged.length);
				}
			} catch (err) {
				if (!cancelled) {
					setProducts([]);
					setTotal(0);
					setError(
						err instanceof Error ? err.message : "Failed to load products",
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		void run();
		return () => {
			cancelled = true;
		};
	}, [flag, page, limit]);

	return { products, loading, error, total, page, limit };
};

export const useTrendingProducts = (page = 1, limit = 10): UseProductsResult =>
	useProductFlag("isTrending", page, limit);

export const useNewArrivalProducts = (
	page = 1,
	limit = 10,
): UseProductsResult => useProductFlag("isNewArrival", page, limit);

export const useFeaturedProducts = (page = 1, limit = 10): UseProductsResult =>
	useProductFlag("isFeatured", page, limit);

export const useProducts = (
	page = 1,
	limit = 12,
	category?: string,
	search?: string,
): UseProductsResult => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await apiService.getProducts(
					page,
					limit,
					category,
					undefined,
					search,
				);
				if (!cancelled) {
					setProducts(data.products || []);
					setTotal(data.total || 0);
				}
			} catch (err) {
				if (!cancelled) {
					setProducts([]);
					setTotal(0);
					setError(
						err instanceof Error ? err.message : "Failed to load products",
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		void run();
		return () => {
			cancelled = true;
		};
	}, [page, limit, category, search]);

	return { products, loading, error, total, page, limit };
};
