import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { useOrder } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import {
	Calendar,
	ShoppingBag,
	User,
	DollarSign,
	CheckCircle2,
	XCircle,
	Truck,
	Clock,
} from "lucide-react";
import OrdersTabContent from "@/components/dashboard/OrdersTabContent";
import BookingsTabContent from "@/components/dashboard/BookingsTabContent";
import ProfileTabContent from "@/components/dashboard/ProfileTabContent";

const DashboardPage: React.FC = () => {
	const { user, isAuthenticated, loading: authLoading } = useAuth();
	const { bookings } = useBooking();
	const { orders } = useOrder();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("orders");

	useEffect(() => {
		if (authLoading) {
			return;
		}

		if (!isAuthenticated) {
			navigate("/auth");
			return;
		}
	}, [isAuthenticated, authLoading, navigate]);

	const getStatusColor = (
		status: string
	): "default" | "secondary" | "destructive" | "outline" => {
		const statusLower = status.toLowerCase();
		if (
			statusLower === "delivered" ||
			statusLower === "completed" ||
			statusLower === "confirmed" ||
			statusLower === "paid"
		) {
			return "default";
		}
		if (
			statusLower === "shipped" ||
			statusLower === "in-progress" ||
			statusLower === "processing"
		) {
			return "secondary";
		}
		if (statusLower === "cancelled" || statusLower === "failed") {
			return "destructive";
		}
		return "outline";
	};

	const getStatusIcon = (status: string) => {
		const statusLower = status.toLowerCase();
		if (
			statusLower === "delivered" ||
			statusLower === "completed" ||
			statusLower === "confirmed"
		) {
			return <CheckCircle2 className="h-4 w-4" />;
		}
		if (statusLower === "cancelled" || statusLower === "failed") {
			return <XCircle className="h-4 w-4" />;
		}
		if (statusLower === "shipped" || statusLower === "in-progress") {
			return <Truck className="h-4 w-4" />;
		}
		return <Clock className="h-4 w-4" />;
	};

	const calculateTotalSpent = () => {
		const orderTotal = orders.reduce(
			(acc, order) => acc + (order.totalAmount || 0),
			0
		);
		const bookingTotal = bookings.reduce(
			(acc, booking) => acc + (booking.price || 0),
			0
		);
		return orderTotal + bookingTotal;
	};

	const formatCurrency = (amount: number) => {
		return `£${amount.toFixed(2)}`;
	};

	const formatDate = (date: Date | string) => {
		const dateObj = typeof date === "string" ? new Date(date) : date;
		return dateObj.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 md:py-12">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center gap-3 mb-2">
							<div className="bg-primary/10 p-3 rounded-full">
								<User className="h-6 w-6 text-primary" />
							</div>
							<div>
								<h1 className="text-2xl md:text-xl font-bold">
									Welcome back, {user?.name}!
								</h1>
								<p className="text-muted-foreground">
									Manage your orders and bookings
								</p>
							</div>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid gap-4 md:grid-cols-3 mb-8">
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Orders
								</CardTitle>
								<div className="bg-blue-100 p-2 rounded-full">
									<ShoppingBag className="h-4 w-4 text-blue-600" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-blue-600">
									{orders.length}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									Lifetime orders placed
								</p>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Bookings
								</CardTitle>
								<div className="bg-green-100 p-2 rounded-full">
									<Calendar className="h-4 w-4 text-green-600" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-green-600">
									{bookings.length}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									Service bookings made
								</p>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Spent
								</CardTitle>
								<div className="bg-purple-100 p-2 rounded-full">
									<DollarSign className="h-4 w-4 text-purple-600" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-purple-600">
									{formatCurrency(calculateTotalSpent())}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									Orders + Services combined
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Tabs */}
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="space-y-4"
					>
						<TabsList className="grid w-full grid-cols-3 h-12">
							<TabsTrigger value="orders" className="flex items-center gap-2">
								<ShoppingBag className="h-4 w-4" />
								<span className="hidden sm:inline">My Orders</span>
								<span className="sm:hidden">Orders</span>
							</TabsTrigger>
							<TabsTrigger value="bookings" className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								<span className="hidden sm:inline">My Bookings</span>
								<span className="sm:hidden">Bookings</span>
							</TabsTrigger>
							<TabsTrigger value="profile" className="flex items-center gap-2">
								<User className="h-4 w-4" />
								<span className="hidden sm:inline">Profile</span>
								<span className="sm:hidden">Profile</span>
							</TabsTrigger>
						</TabsList>

						{/* Orders Tab */}
						<TabsContent value="orders" className="space-y-6">
							<OrdersTabContent
								getStatusColor={getStatusColor}
								getStatusIcon={getStatusIcon}
								formatCurrency={formatCurrency}
								formatDate={formatDate}
							/>
						</TabsContent>

						{/* Bookings Tab */}
						<TabsContent value="bookings" className="space-y-4">
							<BookingsTabContent
								getStatusColor={getStatusColor}
								getStatusIcon={getStatusIcon}
								formatCurrency={formatCurrency}
								formatDate={formatDate}
							/>
						</TabsContent>

						{/* Profile Tab */}
						<TabsContent value="profile" className="space-y-4">
							<ProfileTabContent />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</Layout>
	);
};

export default DashboardPage;
