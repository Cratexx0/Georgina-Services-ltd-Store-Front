import React from "react";
import Layout from "@/components/layout/Layout";
import ClothingHero from "@/components/clothing/ClothingHero";
import CategoryShowcase from "@/components/clothing/CategoryShowcase";
import PromoBanner from "@/components/clothing/PromoBanner";
import ProductRail from "@/components/clothing/ProductRail";
import {
	useFeaturedProducts,
	useNewArrivalProducts,
	useProducts,
	useTrendingProducts,
} from "@/hooks/useProducts";

const Index = () => {
	const trending = useTrendingProducts(1, 8);
	const arrivals = useNewArrivalProducts(1, 8);
	const featured = useFeaturedProducts(1, 8);

	return (
		<Layout>
			<ClothingHero />
			<CategoryShowcase />
			<ProductRail
				title="Trending now"
				subtitle="Pieces our customers are loving this week."
				products={trending.products}
				loading={trending.loading}
				error={trending.error}
			/>
			<PromoBanner />
			<ProductRail
				title="New arrivals"
				subtitle="The latest additions to the collection."
				products={arrivals.products}
				loading={arrivals.loading}
				error={arrivals.error}
			/>
			<section className="bg-stone-50">
				<ProductRail
					title="Best sellers"
					subtitle="Tried, worn, and re-ordered favourites."
					products={featured.products}
					loading={featured.loading}
					error={featured.error}
				/>
			</section>
		</Layout>
	);
};

export default Index;
