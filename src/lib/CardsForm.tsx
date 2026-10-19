// src/lib/CardsForm.tsx
// Minimal product tile: image, centred name + price, and just two icons —
// wishlist (heart) and add-to-cart (bag). Sizes, quantity and everything else live on the details page.
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/useWishlist";
import { Product } from "@/lib/type";
import {
	getProductImages,
	getProductSizes,
	handleImageError,
} from "@/lib/productUtils";
import { formatPrice } from "@/lib/Audience";

// ⚠️ Change this if your product details route is different (e.g. `/products/${slug}`).
export const productPath = (slug: string) => `/product/${slug}`;

interface Props {
	product: Product;
	/** position in the grid — used for the staggered fade-in */
	index?: number;
}

const StoreProductCard = ({ product, index = 0 }: Props) => {
	const { addToCart } = useCart();
	const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

	const images = getProductImages(product);
	const sizes = getProductSizes(product);
	const href = productPath(product.slug);

	const price = Number(product.price);
	const sale = product.discount ? Number(product.discount) : 0;
	const hasSale = sale > 0 && sale < price;
	const percent = hasSale ? Math.round((1 - sale / price) * 100) : 0;
	const out = product.stock === 0;
	const low = product.stock > 0 && product.stock <= 5;
	const wished = isInWishlist(product.id);

	// Transparent PNG cut-outs sit nicely "contained"; photos fill the tile.
	const isCutout = /\.png(\?|$)/i.test(images[0] || "");
	const fit = isCutout
		? "object-contain p-5 mix-blend-multiply"
		: "object-cover";

	let badge: { text: string; cls: string } | null = null;
	if (hasSale) {
		badge = { text: `-${percent}%`, cls: "bg-foreground text-background" };
	} else if (product.isNewArrival) {
		badge = { text: "New", cls: "bg-white text-foreground" };
	} else if (low) {
		badge = {
			text: `Only ${product.stock} left`,
			cls: "bg-orange-100 text-orange-900",
		};
	}

	const handleWishlist = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (wished) await removeFromWishlist(product.id);
		else await addToWishlist(product);
	};

	const handleAdd = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (out) return;
		// Quick-add uses the first available size; the buyer can change it on the details page.
		addToCart(product, 1, sizes[0] ?? "");
	};

	return (
		<article
			className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
			style={{ animationDelay: `${(index % 12) * 45}ms` }}
		>
			<div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f3f3f1] dark:bg-muted">
				{/* whole tile opens the details page */}
				<Link
					to={href}
					aria-label={`View ${product.name}`}
					className="absolute inset-0 block"
				>
					<img
						src={images[0]}
						alt={product.name}
						loading="lazy"
						decoding="async"
						draggable={false}
						onError={handleImageError}
						className={`h-full w-full ${fit} transition-all duration-700 ease-out group-hover:scale-105 ${
							out ? "opacity-60 grayscale" : ""
						}`}
					/>
					{images[1] && (
						<img
							src={images[1]}
							alt=""
							aria-hidden="true"
							loading="lazy"
							decoding="async"
							draggable={false}
							onError={handleImageError}
							className={`absolute inset-0 h-full w-full ${
								/\.png(\?|$)/i.test(images[1])
									? "object-contain p-5 mix-blend-multiply"
									: "object-cover"
							} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
						/>
					)}
				</Link>

				{/* badge */}
				{badge && !out && (
					<span
						className={`pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${badge.cls}`}
					>
						{badge.text}
					</span>
				)}
				{out && (
					<span className="pointer-events-none absolute left-3 top-3 rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-semibold text-background">
						Sold out
					</span>
				)}

				{/* wishlist */}
				<button
					type="button"
					onClick={handleWishlist}
					aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
					aria-pressed={wished}
					title={wished ? "Saved" : "Save"}
					className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition-all duration-200 hover:scale-110 active:scale-90"
				>
					<Heart
						className={`h-[18px] w-[18px] transition-colors ${
							wished ? "fill-red-500 text-red-500" : ""
						}`}
					/>
				</button>

				{/* add to cart */}
				<button
					type="button"
					onClick={handleAdd}
					disabled={out}
					aria-label={out ? "Sold out" : `Add ${product.name} to cart`}
					title={out ? "Sold out" : "Add to cart"}
					className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-foreground text-background shadow-md transition-all duration-300 hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
				>
					<ShoppingBag className="h-[18px] w-[18px]" />
				</button>
			</div>

			<Link to={href} className="mt-3 block px-1 text-center">
				<h3 className="truncate text-sm font-medium leading-tight transition-colors group-hover:text-foreground/70">
					{product.name}
				</h3>
				<p className="mt-1 text-sm">
					<span className={hasSale ? "font-semibold" : "text-muted-foreground"}>
						{formatPrice(hasSale ? sale : price)}
					</span>
					{hasSale && (
						<span className="ml-2 text-xs text-muted-foreground line-through">
							{formatPrice(price)}
						</span>
					)}
				</p>
			</Link>
		</article>
	);
};

export default StoreProductCard;
