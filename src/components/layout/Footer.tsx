import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Facebook, InstagramIcon, Twitter } from "lucide-react";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";

const SHOP_LINKS = [
	{ label: "Clothing", to: "/category/clothes" },
	{ label: "Men", to: "/category/clothes/men" },
	{ label: "Women", to: "/category/clothes/women" },
	{ label: "Kids", to: "/category/clothes/kids" },
	{ label: "Food", to: "/category/foodstuffs" },
	{ label: "Services", to: "/category/services" },
];

const COMPANY_LINKS = [
	{ label: "About Us", to: "/about" },
	{ label: "Contact", to: "/contact" },
];

const SOCIALS = [
	{ label: "Facebook", href: "https://facebook.com", icon: Facebook },
	{ label: "Twitter", href: "https://twitter.com", icon: Twitter },
	{ label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
];

const linkClass =
	"inline-block text-sm text-stone-300 transition-all duration-200 hover:translate-x-1 hover:text-white focus-visible:outline-none focus-visible:text-white focus-visible:underline";

const Footer = () => {
	return (
		<footer className="relative mt-16 overflow-hidden bg-stone-900 text-white">
			{/* Ankara-toned accent strip */}
			<div
				aria-hidden="true"
				className="h-1 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500"
			/>

			{/* Soft pattern texture */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 25% 25%, #fff 2px, transparent 3px), radial-gradient(circle at 75% 70%, #fff 3px, transparent 4px)",
					backgroundSize: "44px 44px, 68px 68px",
				}}
			/>

			<div className="container relative mx-auto px-4 pb-8 pt-14 md:pt-16">
				<div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-8">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-4">
						<Link to="/" aria-label="Georgina Services Limited home">
							<div className="mb-5 w-fit rounded-lg bg-white px-3 py-2">
								<img
									src="/gina_logo.png"
									alt="Georgina Services Limited logo"
									width={130}
									height={30}
								/>
							</div>
						</Link>
						<p className="max-w-xs text-sm leading-relaxed text-stone-300">
							Your one-stop shop for clothing, food, and cleaning services.
						</p>

						<div className="mt-6 flex gap-3">
							{SOCIALS.map(({ label, href, icon: Icon }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Follow us on ${label}`}
									className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-stone-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
								>
									<Icon className="h-4 w-4" />
								</a>
							))}
						</div>
					</div>

					{/* Shop */}
					<nav aria-label="Shop" className="lg:col-span-2">
						<h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white">
							Shop
						</h3>
						<ul className="space-y-3">
							{SHOP_LINKS.map((item) => (
								<li key={item.to}>
									<Link to={item.to} className={linkClass}>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Company */}
					<nav aria-label="Company" className="lg:col-span-2">
						<h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white">
							Company
						</h3>
						<ul className="space-y-3">
							{COMPANY_LINKS.map((item) => (
								<li key={item.to}>
									<Link to={item.to} className={linkClass}>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Newsletter */}
					<div className="col-span-2 lg:col-span-4">
						<NewsletterSignup variant="footer" />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
					<p className="text-center text-xs text-stone-400 sm:text-left">
						&copy; {new Date().getFullYear()} Georgina Services Limited. All
						rights reserved.
					</p>
					<button
						type="button"
						onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-stone-300 transition-colors hover:bg-white hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
					>
						Back to top
						<ArrowUp className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>
		</footer>
	);
};

export default Footer;