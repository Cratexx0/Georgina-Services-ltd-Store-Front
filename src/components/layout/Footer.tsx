import { Facebook, InstagramIcon, Twitter } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white mt-16">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<Link to="/">
							<div className="bg-white px-2 py-1 rounded-md w-fit mb-6">
								<img
									src="/gina_logo.png"
									alt="georgina services limited logo"
									width={130}
									height={30}
								/>
							</div>
						</Link>
						<p className="text-gray-100">
							Your one-stop shop for clothing, food, and cleaning services.
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Shop</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/category/clothing"
									className="text-gray-100 hover:text-primary transition-colors"
								>
									Clothing
								</Link>
							</li>
							<li>
								<Link
									to="/category/food"
									className="text-gray-100 hover:text-primary transition-colors"
								>
									Food
								</Link>
							</li>
							<li>
								<Link
									to="/category/cleaning"
									className="text-gray-100 hover:text-primary transition-colors"
								>
									Cleaning
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Company</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/about"
									className="text-gray-100 hover:text-primary transition-colors"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-gray-100 hover:text-primary transition-colors"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									to="/careers"
									className="text-gray-100 hover:text-primary transition-colors"
								>
									Careers
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<NewsletterSignup variant="footer" />
					</div>
				</div>

				<div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row md:justify-between items-center">
					<p className="text-gray-100 text-sm mb-4 md:mb-0">
						&copy; {new Date().getFullYear()} Georgina Services Limited. All
						rights reserved.
					</p>
					<div className="flex space-x-6">
						<a
							href="#"
							className="text-gray-100 hover:text-primary transition-colors"
						>
							<Facebook />
						</a>
						<a
							href="#"
							className="text-gray-100 hover:text-primary transition-colors"
						>
							<Twitter />
						</a>
						<a
							href="#"
							className="text-gray-100 hover:text-primary transition-colors"
						>
							<InstagramIcon />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
