import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useOrder } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import {
	Calendar,
	Package,
	ShoppingBag,
	MapPin,
	Clock,
	Truck,
	Loader2,
	CheckCircle2,
	DollarSign,
	XCircle,
} from "lucide-react";

export interface OrdersTabContentProps {
	getStatusColor: (
		status: string
	) => "default" | "secondary" | "destructive" | "outline";
	getStatusIcon: (status: string) => React.ReactNode;
	formatCurrency: (amount: number) => string;
	formatDate: (date: Date | string) => string;
}

const OrdersTabContent: React.FC<OrdersTabContentProps> = ({
	getStatusColor,
	getStatusIcon,
	formatCurrency,
	formatDate,
}) => {
	const { orders, cancelOrder, isLoading } = useOrder();
	const navigate = useNavigate();

	return (
		<>
			{/* Orders Summary Header */}
			{!isLoading && orders.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<Card className="bg-gradient-to-r from-blue-50 to-blue-100">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-blue-600 font-medium">
										Total Orders
									</p>
									<p className="text-2xl font-bold text-blue-700">
										{orders.length}
									</p>
								</div>
								<ShoppingBag className="h-8 w-8 text-blue-500" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-r from-emerald-50 to-emerald-100">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-emerald-600 font-medium">
										Completed
									</p>
									<p className="text-2xl font-bold text-emerald-700">
										{
											orders.filter(
												(o) =>
													o.status.toLowerCase() === "delivered" ||
													o.status.toLowerCase() === "completed"
											).length
										}
									</p>
								</div>
								<CheckCircle2 className="h-8 w-8 text-emerald-500" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-r from-amber-50 to-amber-100">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-amber-600 font-medium">
										In Progress
									</p>
									<p className="text-2xl font-bold text-amber-700">
										{
											orders.filter(
												(o) =>
													o.status.toLowerCase() === "processing" ||
													o.status.toLowerCase() === "shipped"
											).length
										}
									</p>
								</div>
								<Clock className="h-8 w-8 text-amber-500" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-r from-purple-50 to-purple-100">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-purple-600 font-medium">
										Total Spent
									</p>
									<p className="text-2xl font-bold text-purple-700">
										{formatCurrency(
											orders.reduce(
												(acc, order) => acc + (order.totalAmount || 0),
												0
											)
										)}
									</p>
								</div>
								<DollarSign className="h-8 w-8 text-purple-500" />
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-16">
					<Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
					<p className="text-muted-foreground">Loading your orders...</p>
				</div>
			) : orders.length === 0 ? (
				<Card className="border-dashed border-2 border-gray-200">
					<CardContent className="flex flex-col items-center justify-center py-16">
						<div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-full mb-6">
							<ShoppingBag className="h-16 w-16 text-gray-400" />
						</div>
						<h3 className="text-2xl font-semibold mb-3 text-gray-800">
							No orders yet
						</h3>
						<p className="text-muted-foreground text-center mb-6 max-w-md">
							You haven't placed any orders yet. Start exploring our products
							and place your first order!
						</p>
						<div className="flex flex-col sm:flex-row gap-3">
							<Button
								onClick={() => navigate("/")}
								className="bg-primary hover:bg-primary/90"
							>
								<ShoppingBag className="h-4 w-4 mr-2" />
								Browse Products
							</Button>
							<Button variant="outline" onClick={() => navigate("/categories")}>
								View Categories
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<Accordion type="single" collapsible className="space-y-4">
					{orders.map((order) => (
						<AccordionItem
							key={order.id}
							value={order.id.toString()}
							className="border rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
						>
							<AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>div]:bg-blue-50">
								<div className="flex items-center gap-4 w-full">
									{/* Order Image - First item's image */}
									<div className="flex-shrink-0">
										{order.items && order.items[0]?.image ? (
											<img
												src={order.items[0].image}
												alt={order.items[0].name}
												className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
											/>
										) : (
											<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
												<Package className="h-8 w-8 text-gray-400" />
											</div>
										)}
									</div>

									{/* Order Summary Info */}
									<div className="flex-1 text-left">
										<div className="flex items-center justify-between">
											<div className="space-y-1">
												<h3 className="font-bold text-lg text-gray-900">
													Order #
													{order.orderNumber ||
														order.id.toString().slice(-6).toUpperCase()}
												</h3>
												<p className="text-sm text-muted-foreground flex items-center gap-2">
													<Calendar className="h-4 w-4" />
													{formatDate(order.orderedAt)}
												</p>
												<p className="text-sm text-gray-600">
													{order.items.length} item
													{order.items.length > 1 ? "s" : ""} •{" "}
													{formatCurrency(order.totalAmount)}
												</p>
											</div>
											<div className="flex flex-col gap-2">
												<Badge
													variant={getStatusColor(order.status)}
													className="flex items-center gap-1"
												>
													{getStatusIcon(order.status)}
													{order.status.charAt(0).toUpperCase() +
														order.status.slice(1)}
												</Badge>
											</div>
										</div>
									</div>
								</div>
							</AccordionTrigger>

							<AccordionContent className="px-6 pb-6">
								<div className="space-y-6 pt-4">
									{/* All Order Items */}
									<div className="space-y-4">
										<h4 className="font-semibold text-gray-900 flex items-center gap-2">
											<ShoppingBag className="h-4 w-4" />
											All Items ({order.items.length})
										</h4>
										<div className="grid gap-3">
											{order.items.map((item, index) => (
												<div
													key={item.id || index}
													className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition-colors"
												>
													<div className="relative">
														{item.image ? (
															<img
																src={item.image}
																alt={item.name}
																className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-md"
															/>
														) : (
															<div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
																<Package className="h-8 w-8 text-gray-400" />
															</div>
														)}
														<div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
															{item.quantity}
														</div>
													</div>
													<div className="flex-1 min-w-0">
														<h5 className="font-semibold text-gray-900 mb-1 truncate">
															{item.name}
														</h5>
														<p className="text-sm text-muted-foreground mb-2">
															Unit Price: {formatCurrency(item.price)}
														</p>
														<div className="flex items-center gap-2 text-sm">
															<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
																Qty: {item.quantity}
															</span>
														</div>
													</div>
													<div className="text-right">
														<p className="font-bold text-lg text-primary">
															{formatCurrency(item.quantity * item.price)}
														</p>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Order Details Grid */}
									<div className="grid md:grid-cols-2 gap-6">
										{/* Shipping Information */}
										<div className="space-y-4">
											<h4 className="font-semibold text-gray-900 flex items-center gap-2">
												<MapPin className="h-4 w-4" />
												Shipping Information
											</h4>
											<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
												<div className="flex items-start gap-3">
													<MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
													<div>
														<p className="font-medium text-blue-900">
															Delivery Address
														</p>
														<p className="text-blue-700 mt-1">
															{order.shippingAddress}
														</p>
													</div>
												</div>
											</div>
										</div>

										{/* Order Timeline */}
										<div className="space-y-4">
											<h4 className="font-semibold text-gray-900 flex items-center gap-2">
												<Clock className="h-4 w-4" />
												Order Timeline
											</h4>
											<div className="space-y-3">
												{order.trackingNumber && (
													<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
														<Truck className="h-5 w-5 text-green-600" />
														<div>
															<p className="font-medium text-green-900">
																Tracking Number
															</p>
															<p className="text-green-700 font-mono text-sm">
																{order.trackingNumber}
															</p>
														</div>
													</div>
												)}

												{order.estimatedDelivery && (
													<div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
														<Clock className="h-5 w-5 text-amber-600" />
														<div>
															<p className="font-medium text-amber-900">
																Estimated Delivery
															</p>
															<p className="text-amber-700">
																{formatDate(order.estimatedDelivery)}
															</p>
														</div>
													</div>
												)}

												<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
													<Calendar className="h-5 w-5 text-gray-600" />
													<div>
														<p className="font-medium text-gray-900">
															Order Placed
														</p>
														<p className="text-gray-700">
															{formatDate(order.orderedAt)}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Order Total and Actions */}
									<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
										<div className="mb-4 sm:mb-0">
											<p className="text-sm text-muted-foreground mb-1">
												Total Amount
											</p>
											<p className="text-3xl font-bold text-primary">
												{formatCurrency(order.totalAmount)}
											</p>
											<p className="text-sm text-muted-foreground">
												Including taxes and shipping
											</p>
										</div>

										<div className="flex flex-col sm:flex-row gap-3">
											{order.trackingNumber && (
												<Button
													variant="outline"
													size="sm"
													className="hover:bg-blue-50"
												>
													<Truck className="h-4 w-4 mr-2" />
													Track Package
												</Button>
											)}

											{(order.status === "pending" ||
												order.status === "processing") && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => cancelOrder(order.id)}
													className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
												>
													<XCircle className="h-4 w-4 mr-2" />
													Cancel Order
												</Button>
											)}
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			)}
		</>
	);
};

export default OrdersTabContent;
