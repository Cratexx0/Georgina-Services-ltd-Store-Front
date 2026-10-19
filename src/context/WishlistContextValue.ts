import { createContext } from "react";
import { Product } from "@/lib/type";

export interface WishlistContextType {
	wishlist: Product[];
	addToWishlist: (product: Product) => Promise<void>;
	removeFromWishlist: (productId: string | number) => Promise<void>;
	isInWishlist: (productId: string | number) => boolean;
	clearWishlist: () => Promise<void>;
	isLoading: boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
	undefined,
);
