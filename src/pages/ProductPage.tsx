import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
	Heart,
	Share2,
	Truck,
	ShieldCheck,
	RefreshCcw,
	Scissors,
	Check,
	Ruler,
	Flame,
	Minus,
	Plus,
	ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import RelatedProductsCarousel from "@/components/products/RelatedProductsCarousel";
import ProductReview from "@/components/products/ProductReview";
import { toast } from "@/components/ui/sonner";
import { apiService } from "@/lib/api";
import { Product } from "@/lib/type";
import {
	addRecentlyViewed,
	getProductImages,
	getProductSizes,
	getRecentlyViewed,
} from "@/lib/productUtils";
import ProductGallery from "@/components/clothing/ProductGallery";
import { ProductDetailSkeleton } from "@/components/Loader/SkeletonLoader";
import ErrorState from "@/components/common/ErrorState";
import ProductGrid from "@/components/products/ProductGrid";
import { AUDIENCE_META, detectAudience, formatPrice } from "@/lib/Audience";
import { normalizeProduct } from "@/lib/NormalProduct";

type TabKey = "details" | "size" | "care" | "delivery";

const TABS: { key: TabKey; label: string }[] = [
	{ key: "details", label: "Details" },
	{ key: "size", label: "Size guide" },
	{ key: "care", label: "Fabric & care" },
	{ key: "delivery", label: "Delivery & returns" },
];

const TRUST = [
	{ icon: ShieldCheck, label: "Authentic wax print" },
	{ icon: Scissors, label: "Reinforced seams" },
	{ icon: RefreshCcw, label: "Easy size exchanges" },
];

const dispatchWindow = () => {
	const fmt = (d: Date) =>
		d.toLocaleDateString("en-GB", {
			weekday: "short",
			day: "numeric",
			month: "short",
		});
	const from = new Date();
	from.setDate(from.getDate() + 3);
	const to = new Date();
	to.setDate(to.getDate() + 7);
	return `${fmt(from)} – ${fmt(to)}`;
};

const ProductPage = () => {
	const { productSlug } = useParams<{ productSlug: string }>();
	const navigate = useNavigate();
	const [quantity, setQuantity] = useState(1);
	const [selectedSize, setSelectedSize] = useState("");
	const [product, setProduct] = useState<Product | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [recent, setRecent] = useState(getRecentlyViewed(productSlug));
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tab, setTab] = useState<TabKey>("details");
	const [justAdded, setJustAdded] = useState(false);
	const [showStickyBar, setShowStickyBar] = useState(false);
	const ctaRef = useRef<HTMLDivElement | null>(null);

	const { addToCart } = useCart();
	const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

	useEffect(() => {
		const fetchProduct = async () => {
			if (!productSlug) return;
			try {
				setLoading(true);
				setError(null);
				setQuantity(1);
				setTab("details");
				window.scrollTo({ top: 0, behavior: "smooth" });

				let productData: Product | null = null;
				try {
					const fetched = await apiService.getProductBySlug(productSlug);
					productData = fetched ? normalizeProduct(fetched) : null;
				} catch {
					productData = null;
				}
				if (!productData) {
					setError("Product not found");
					return;
				}
				setProduct(productData);
				addRecentlyViewed(productData);
				setRecent(getRecentlyViewed(productData.slug));
				const sizes = getProductSizes(productData);
				setSelectedSize(sizes[0] || "");

				try {
					const related = await apiService.getProductsByCategory(
						productData.categoryLevel1,
					);
					setRelatedProducts(
						related
							.map(normalizeProduct)
							.filter((p) => p.id !== productData!.id)
							.slice(0, 8),
					);
				} catch {
					setRelatedProducts([]);
				}
			} catch {
				setError("Failed to load product");
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [productSlug]);

	const availableSizes = useMemo(
		() => (product ? getProductSizes(product) : []),
		[product],
	);
	const images = useMemo(
		() => (product ? getProductImages(product) : []),
		[product],
	);

	useEffect(() => {
		if (product) document.title = `${product.name} | Ankara Fashion`;
	}, [product]);

	// Show the sticky mobile buy bar only once the main buy buttons are off screen
	useEffect(() => {
		const el = ctaRef.current;
		if (!el || typeof IntersectionObserver === "undefined") return;
		const observer = new IntersectionObserver(
			([entry]) => setShowStickyBar(!entry.isIntersecting),
			{ threshold: 0.1 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [loading, product]);

	const handleAddToCart = (goCheckout = false) => {
		if (!product) return;
		if (product.stock === 0) {
			toast.error("This product is out of stock");
			return;
		}
		if (availableSizes.length > 0 && !selectedSize) {
			toast.error("Please select a size");
			return;
		}
		addToCart(product, quantity, selectedSize);
		if (goCheckout) {
			navigate("/checkout");
		} else {
			setJustAdded(true);
			window.setTimeout(() => setJustAdded(false), 1800);
		}
	};

	const handleWishlistToggle = async () => {
		if (!product) return;
		if (isInWishlist(product.id)) await removeFromWishlist(product.id);
		else await addToWishlist(product);
	};

	const handleShare = async () => {
		if (!product) return;
		if (navigator.share) {
			try {
				await navigator.share({
					title: product.name,
					url: window.location.href,
				});
			} catch {
				/* cancelled */
			}
		} else {
			await navigator.clipboard.writeText(window.location.href);
			toast.success("Link copied to clipboard");
		}
	};

	if (loading) {
		return (
			<Layout>
				<ProductDetailSkeleton />
			</Layout>
		);
	}

	if (error || !product) {
		return (
			<Layout>
				<ErrorState
					title="Product not found"
					message="This piece may have been removed or the link is incorrect."
				/>
			</Layout>
		);
	}

	const price = Number(product.price);
	const sale = product.discount ? Number(product.discount) : 0;
	const hasDiscount = sale > 0 && sale < price;
	const currentPrice = hasDiscount ? sale : price;
	const originalPrice = hasDiscount ? price : null;
	const discountPercentage = hasDiscount
		? Math.round((1 - sale / price) * 100)
		: 0;
	const saving = hasDiscount ? price - sale : 0;

	const audience = detectAudience(
		product.categoryLevel2,
		product.categoryLevel3,
		product.name,
	);
	const meta = AUDIENCE_META[audience];
	const outOfStock = product.stock === 0;
	const lowStock = product.stock > 0 && product.stock <= 5;
	const needsSize = availableSizes.length > 0 && !selectedSize;
	const cannotBuy = outOfStock || needsSize;
	const stockPct = Math.min(100, Math.max(8, (product.stock / 20) * 100));
	const wished = isInWishlist(product.id);

	const detailRows: [string, string | undefined][] = [
		[
			"Collection",
			meta.label === "Ankara" ? "Ankara" : `Ankara · ${meta.label}`,
		],
		[
			"Category",
			[product.categoryLevel1, product.categoryLevel2, product.categoryLevel3]
				.filter(Boolean)
				.join(" · "),
		],
		["Brand", product.brand],
		["Sizing", meta.sizeSystem],
		["Fabric", "100% cotton African wax print"],
	];

	const iconBtn =
		"flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-all hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

	return (
		<Layout>
			<div className="container mx-auto px-4 py-6 pb-32 md:py-10 lg:pb-12">
				{/* Breadcrumb */}
				<nav
					aria-label="Breadcrumb"
					className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
				>
					<Link to="/" className="transition-colors hover:text-foreground">
						Home
					</Link>
					<ChevronRight className="h-3.5 w-3.5" />
					<Link
						to="/category/clothes"
						className="transition-colors hover:text-foreground"
					>
						Clothing
					</Link>
					{product.categoryLevel2 && (
						<>
							<ChevronRight className="h-3.5 w-3.5" />
							<Link
								to={`/category/clothes/${product.categoryLevel2.toLowerCase()}`}
								className="capitalize transition-colors hover:text-foreground"
							>
								{product.categoryLevel2}
							</Link>
						</>
					)}
					<ChevronRight className="h-3.5 w-3.5" />
					<span className="max-w-[180px] truncate text-foreground">
						{product.name}
					</span>
				</nav>

				<div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
					{/* Gallery */}
					<div className="self-start lg:sticky lg:top-24">
						<ProductGallery images={images} name={product.name} />
					</div>

					{/* Info */}
					<div>
						{/* Badges */}
						<div className="mb-4 flex flex-wrap items-center gap-2">
							<span
								className={`rounded-full px-3 py-1 text-xs font-medium ${meta.badge}`}
							>
								{meta.eyebrow}
							</span>
							{hasDiscount && (
								<span className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
									Save {discountPercentage}%
								</span>
							)}
							{lowStock && (
								<span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-900">
									<Flame className="h-3 w-3" /> Selling fast
								</span>
							)}
						</div>

						{/* Title + quick actions */}
						<div className="mb-4 flex items-start justify-between gap-4">
							<h1 className="font-serif text-3xl leading-tight md:text-4xl lg:text-[2.6rem]">
								{product.name}
							</h1>
							<div className="flex shrink-0 gap-2 pt-1">
								<button
									type="button"
									onClick={handleWishlistToggle}
									aria-label={
										wished ? "Remove from wishlist" : "Save to wishlist"
									}
									aria-pressed={wished}
									className={iconBtn}
								>
									<Heart
										className={`h-4 w-4 transition-transform ${
											wished ? "scale-110 fill-red-500 text-red-500" : ""
										}`}
									/>
								</button>
								<button
									type="button"
									onClick={handleShare}
									aria-label="Share this product"
									className={iconBtn}
								>
									<Share2 className="h-4 w-4" />
								</button>
							</div>
						</div>

						{/* Price */}
						<div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
							<span className="text-3xl font-semibold tracking-tight">
								{formatPrice(currentPrice)}
							</span>
							{originalPrice && (
								<span className="text-lg text-muted-foreground line-through">
									{formatPrice(originalPrice)}
								</span>
							)}
							{hasDiscount && (
								<span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
									You save {formatPrice(saving)}
								</span>
							)}
						</div>

						<p className="mb-7 leading-relaxed text-muted-foreground">
							{product.description ||
								"A hand-finished Ankara piece cut from vibrant, colour-fast wax print cotton."}
						</p>

						{/* Size picker */}
						{availableSizes.length > 0 && (
							<div className="mb-6">
								<div className="mb-3 flex items-center justify-between">
									<span className="text-sm font-medium">
										Size
										{selectedSize && (
											<span className="ml-1.5 font-normal text-muted-foreground">
												· {selectedSize}
											</span>
										)}
									</span>
									<button
										type="button"
										onClick={() => {
											setTab("size");
											document.getElementById("product-tabs")?.scrollIntoView({
												behavior: "smooth",
												block: "start",
											});
										}}
										className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
									>
										<Ruler className="h-4 w-4" /> Size guide
									</button>
								</div>
								<div
									className="flex flex-wrap gap-2"
									role="radiogroup"
									aria-label="Select size"
								>
									{availableSizes.map((size) => {
										const active = selectedSize === size;
										return (
											<button
												key={size}
												type="button"
												role="radio"
												aria-checked={active}
												onClick={() => setSelectedSize(size)}
												className={`h-12 min-w-12 rounded-xl border px-4 text-sm font-medium transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
													active
														? "border-foreground bg-foreground text-background shadow-md"
														: "border-border bg-background hover:border-foreground"
												}`}
											>
												{size}
											</button>
										);
									})}
								</div>
							</div>
						)}

						{/* Stock */}
						<div className="mb-6">
							<p className="flex items-center text-sm">
								<span
									className={`mr-2 h-2 w-2 rounded-full ${
										outOfStock
											? "bg-red-500"
											: lowStock
												? "bg-orange-500"
												: "bg-emerald-500"
									}`}
								/>
								{outOfStock
									? "Out of stock"
									: lowStock
										? `Only ${product.stock} left, order soon`
										: `In stock · ${product.stock} available`}
							</p>
							{lowStock && (
								<div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-orange-500 transition-all duration-700"
										style={{ width: `${stockPct}%` }}
									/>
								</div>
							)}
						</div>

						{/* Quantity + CTAs */}
						<div ref={ctaRef} className="mb-6 space-y-3">
							<div className="flex items-center gap-3">
								<div className="flex h-12 items-center rounded-full border">
									<button
										type="button"
										aria-label="Decrease quantity"
										className="flex h-12 w-11 items-center justify-center rounded-l-full transition-colors hover:bg-muted disabled:opacity-40"
										disabled={quantity <= 1}
										onClick={() => setQuantity((q) => Math.max(1, q - 1))}
									>
										<Minus className="h-4 w-4" />
									</button>
									<span
										className="min-w-8 text-center text-sm font-medium tabular-nums"
										aria-live="polite"
									>
										{quantity}
									</span>
									<button
										type="button"
										aria-label="Increase quantity"
										className="flex h-12 w-11 items-center justify-center rounded-r-full transition-colors hover:bg-muted disabled:opacity-40"
										disabled={quantity >= product.stock}
										onClick={() => setQuantity((q) => q + 1)}
									>
										<Plus className="h-4 w-4" />
									</button>
								</div>
								<Button
									size="lg"
									className="h-12 flex-1 rounded-full transition-all active:scale-[0.98]"
									onClick={() => handleAddToCart(false)}
									disabled={cannotBuy}
								>
									{justAdded ? (
										<>
											<Check className="mr-2 h-4 w-4" /> Added to cart
										</>
									) : outOfStock ? (
										"Out of stock"
									) : (
										`Add to cart · ${formatPrice(currentPrice * quantity)}`
									)}
								</Button>
							</div>
							<Button
								variant="outline"
								size="lg"
								className="h-12 w-full rounded-full transition-all active:scale-[0.98]"
								onClick={() => handleAddToCart(true)}
								disabled={cannotBuy}
							>
								Buy now
							</Button>
						</div>

						{/* Trust badges */}
						<ul className="mb-4 grid grid-cols-3 gap-2">
							{TRUST.map(({ icon: Icon, label }) => (
								<li
									key={label}
									className="flex flex-col items-center gap-2 rounded-xl border bg-muted/30 px-2 py-3 text-center"
								>
									<Icon className="h-5 w-5" />
									<span className="text-[11px] leading-tight text-muted-foreground">
										{label}
									</span>
								</li>
							))}
						</ul>

						{/* Delivery estimate */}
						<div className="mb-8 flex items-start gap-3 rounded-xl border bg-muted/30 p-4 text-sm">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background">
								<Truck className="h-4 w-4" />
							</div>
							<div>
								<p className="font-medium">
									Estimated delivery: {dispatchWindow()}
								</p>
								<p className="mt-0.5 text-muted-foreground">
									Dispatched in 2–3 working days. Shipping calculated at
									checkout.
								</p>
							</div>
						</div>

						{/* Tabs */}
						<div id="product-tabs" className="scroll-mt-28">
							<div
								role="tablist"
								className="scrollbar-hide flex gap-1 overflow-x-auto border-b"
							>
								{TABS.map((t) => (
									<button
										key={t.key}
										role="tab"
										aria-selected={tab === t.key}
										onClick={() => setTab(t.key)}
										className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
											tab === t.key
												? "border-foreground font-medium text-foreground"
												: "border-transparent text-muted-foreground hover:text-foreground"
										}`}
									>
										{t.label}
									</button>
								))}
							</div>

							<div
								key={tab}
								role="tabpanel"
								className="animate-in fade-in pt-5 text-sm duration-300"
							>
								{tab === "details" && (
									<dl className="divide-y rounded-xl border">
										{detailRows
											.filter(([, v]) => v)
											.map(([k, v]) => (
												<div
													key={k}
													className="flex justify-between gap-4 px-4 py-3"
												>
													<dt className="text-muted-foreground">{k}</dt>
													<dd className="text-right font-medium">{v}</dd>
												</div>
											))}
									</dl>
								)}

								{tab === "size" && (
									<div>
										<p className="mb-3 text-muted-foreground">
											Measure over light clothing and choose the closest size.
											Between sizes? Size up for a relaxed fit.
										</p>
										<div className="overflow-x-auto rounded-xl border">
											<table className="w-full">
												<thead className="bg-muted">
													<tr>
														{meta.sizeChart.headers.map((h) => (
															<th
																key={h}
																className="px-4 py-2.5 text-left font-medium"
															>
																{h}
															</th>
														))}
													</tr>
												</thead>
												<tbody>
													{meta.sizeChart.rows.map((row) => (
														<tr
															key={row[0]}
															className={`border-t transition-colors ${
																row[0] === selectedSize
																	? "bg-foreground/5 font-medium"
																	: ""
															}`}
														>
															{row.map((cell, i) => (
																<td key={i} className="px-4 py-2.5">
																	{cell}
																</td>
															))}
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								)}

								{tab === "care" && (
									<ul className="list-disc space-y-2 pl-5 text-muted-foreground">
										<li>100% cotton African wax print.</li>
										<li>
											Wash separately in cold water for the first few washes, as
											wax prints can release excess dye.
										</li>
										<li>Turn inside out, use mild detergent, avoid bleach.</li>
										<li>
											Dry in shade to protect colour. Iron on medium heat on the
											reverse side.
										</li>
									</ul>
								)}

								{tab === "delivery" && (
									<ul className="list-disc space-y-2 pl-5 text-muted-foreground">
										<li>
											Orders dispatch within 2–3 working days; estimated
											delivery {dispatchWindow()}.
										</li>
										<li>
											Shipping cost is calculated at checkout based on your
											address.
										</li>
										<li>
											Size exchanges accepted on unworn items with tags
											attached.
										</li>
									</ul>
								)}
							</div>
						</div>

						{/* Styling tips */}
						<div className="mt-8 rounded-2xl border bg-muted/30 p-5 md:p-6">
							<h2 className="mb-4 font-serif text-xl">How to wear it</h2>
							<ol className="space-y-3 text-sm">
								{meta.styling.map((tip, i) => (
									<li key={tip} className="flex items-start gap-3">
										<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-medium text-background">
											{i + 1}
										</span>
										<span className="pt-0.5 text-muted-foreground">{tip}</span>
									</li>
								))}
							</ol>
						</div>

						<div className="mt-8 border-t pt-6">
							<ProductReview productId={product.id} />
						</div>
					</div>
				</div>

				{relatedProducts.length > 0 && (
					<div className="mt-16">
						<RelatedProductsCarousel
							products={relatedProducts}
							title="Complete the look"
						/>
					</div>
				)}

				{recent.length > 0 && (
					<div className="mt-16">
						<ProductGrid products={recent} title="Recently viewed" />
					</div>
				)}
			</div>

			{/* Sticky mobile buy bar: appears once the main buttons scroll out of view */}
			<div
				className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t bg-background/95 px-4 pt-3 backdrop-blur transition-transform duration-300 lg:hidden ${
					showStickyBar ? "translate-y-0" : "translate-y-full"
				}`}
				style={{
					paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
				}}
				aria-hidden={!showStickyBar}
			>
				<div className="leading-tight">
					<p className="text-lg font-semibold">
						{formatPrice(currentPrice * quantity)}
					</p>
					{selectedSize && (
						<p className="text-xs text-muted-foreground">Size {selectedSize}</p>
					)}
				</div>
				<Button
					size="lg"
					className="h-12 flex-1 rounded-full transition-transform active:scale-[0.98]"
					onClick={() => handleAddToCart(false)}
					disabled={cannotBuy}
					tabIndex={showStickyBar ? 0 : -1}
				>
					{justAdded
						? "Added ✓"
						: outOfStock
							? "Out of stock"
							: needsSize
								? "Select a size"
								: "Add to cart"}
				</Button>
			</div>
		</Layout>
	);
};

export default ProductPage;
