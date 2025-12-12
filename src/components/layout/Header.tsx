import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	ShoppingCart,
	Menu,
	X,
	LogIn,
	User,
	Heart,
	LogOut,
	LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "@/components/ui/SearchBar";

const Header = () => {
	const { cart } = useCart();
	const { wishlist } = useWishlist();
	const { isAuthenticated, user, logout } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleLogout = () => {
		logout();
		setIsMenuOpen(false);
		navigate("/");
	};

	const getUserInitials = () => {
		const name = user?.name || user?.fullname || user?.email || "U";
		return name.charAt(0).toUpperCase();
	};

	return (
		<header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-lg">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link to="/">
						<img
							src="/gina_logo.png"
							alt="georgina services limited logo"
							width={150}
							height={50}
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex space-x-6">
						<Link
							to="/"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Home
						</Link>
						<Link
							to="/category/clothes"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Clothes
						</Link>
						<Link
							to="/category/foodstuffs"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Food & Spices
						</Link>
						<Link
							to="/category/services"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							Cleaning Services
						</Link>
					</nav>

					{/* Search and Cart */}
					<div className="hidden md:flex items-center space-x-4">
						<SearchBar className="w-[200px] lg:w-[300px]" />

						<Link to="/wishlist" className="relative">
							<Heart className="h-4 w-4 text-muted-foreground" />
							{wishlist.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
									{wishlist.length}
								</span>
							)}
						</Link>

						<Link to="/cart" className="relative">
							<ShoppingCart className="h-4 w-4 text-muted-foreground" />
							{cart.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
									{cart.length}
								</span>
							)}
						</Link>

						<div className="flex items-center space-x-4">
						{isAuthenticated ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="flex items-center gap-2 hover:bg-accent"
										>
											<Avatar className="h-8 w-8">
												<AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
													{getUserInitials()}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent 
										align="end" 
										className="w-56 bg-background border border-border shadow-lg"
									>
										<DropdownMenuLabel className="font-normal">
											<div className="flex flex-col space-y-1">
												<p className="text-sm font-medium leading-none">
													{user?.name || user?.fullname || "User"}
												</p>
												<p className="text-xs text-muted-foreground truncate">
													{user?.email}
												</p>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => navigate("/dashboard")}
											className="cursor-pointer"
										>
											<LayoutDashboard className="mr-2 h-4 w-4" />
											<span>Dashboard</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleLogout}
											className="cursor-pointer text-destructive focus:text-destructive"
										>
											<LogOut className="mr-2 h-4 w-4" />
											<span>Logout</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Link to="/auth">
									<Button
										variant="default"
										size="sm"
										className="flex items-center gap-2"
									>
										<LogIn className="h-4 w-4" />
										Sign In
									</Button>
								</Link>
							)}
						</div>
					</div>

					{/* Mobile menu button */}
					<button
						className="md:hidden text-muted-foreground"
						onClick={toggleMenu}
						aria-label="Toggle menu"
					>
						{isMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>

				{/* Mobile menu */}
				{isMenuOpen && (
					<div className="md:hidden py-4 animate-slide-down">
						<nav className="flex flex-col space-y-3">
							<Link
								to="/"
								className="text-muted-foreground hover:text-primary transition-colors"
								onClick={toggleMenu}
							>
								Home
							</Link>
							<Link
								to="/category/clothes"
								className="text-muted-foreground hover:text-primary transition-colors"
								onClick={toggleMenu}
							>
								Clothes
							</Link>
							<Link
								to="/category/foodstuffs"
								className="text-muted-foreground hover:text-primary transition-colors"
								onClick={toggleMenu}
							>
								Food & Spices
							</Link>
							<Link
								to="/category/services"
								className="text-muted-foreground hover:text-primary transition-colors"
								onClick={toggleMenu}
							>
								Cleaning Services
							</Link>

							<div className="flex items-center space-x-4">
								{isAuthenticated ? (
									<div className="flex flex-col space-y-2 w-full">
										<Link
											to="/dashboard"
											onClick={toggleMenu}
											className="w-full"
										>
											<Button
												variant="ghost"
												size="sm"
												className="flex items-center gap-2 w-full justify-start"
											>
												<User className="h-4 w-4" />
												{user?.name || user?.fullname || "Account"}
											</Button>
										</Link>
										<Button
											variant="outline"
											size="sm"
											onClick={handleLogout}
											className="w-full justify-start text-xs"
										>
											<LogOut className="h-4 w-4 mr-2" />
											Logout
										</Button>
									</div>
								) : (
									<Link to="/auth" onClick={toggleMenu} className="w-full">
										<Button
											variant="default"
											size="sm"
											className="flex items-center gap-2 w-full"
										>
											<LogIn className="h-4 w-4" />
											Sign In
										</Button>
									</Link>
								)}
							</div>
						</nav>
						<div className="mt-4 flex items-center space-x-4">
							<SearchBar className="flex-1" onClose={toggleMenu} />

							<Link to="/cart" className="relative" onClick={toggleMenu}>
								<ShoppingCart className="h-6 w-6 text-muted-foreground" />
								{cart.length > 0 && (
									<span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
										{cart.length}
									</span>
								)}
							</Link>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
