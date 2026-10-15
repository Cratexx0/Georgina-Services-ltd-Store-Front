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
	XCircle,
	Wallet,
	ArrowRight,
	Check,
} from "lucide-react";

export interface OrdersTabContentProps {
	getStatusColor: (
		status: string,
	) => "default" | "secondary" | "destructive" | "outline";
	getStatusIcon: (status: string) => React.ReactNode;
	formatCurrency: (amount: number) => string;
	formatDate: (date: Date | string) => string;
}

const STEPS = [
	{ key: "pending", label: "Placed" },
	{ key: "confirmed", label: "Confirmed" },
	{ key: "processing", label: "Processing" },
	{ key: "shipped", label: "Shipped" },
	{ key: "delivered", label: "Delivered" },
];

const normalizeStatus = (status: string) => {
	const s = status.toLowerCase();
	return s === "completed" ? "delivered" : s;
};

const OrderProgress: React.FC<{ status: string }> = ({ status }) => {
	const current = normalizeStatus(status);
	const isCancelled = current === "cancelled" || current === "canceled";
	const isRefunded = current === "refunded" || current === "failed";

	if (isCancelled || isRefunded) {
		return (
			<div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
				<XCircle className="h-4 w-4 shrink-0" />
				This order was {current}.
			</div>
		);
	}

	const activeIndex = Math.max(
		0,
		STEPS.findIndex((s) => s.key === current),
	);

	return (
		<ol className="flex items-start">
			{STEPS.map((step, i) => {
				const done =
					i < activeIndex || (i === activeIndex && current === "delivered");
				const active = i === activeIndex && !done;
				return (
					<li
						key={step.key}
						className="relative flex flex-1 flex-col items-center"
					>
						{i > 0 && (
							<span
								aria-hidden="true"
								className={`absolute right-1/2 top-3.5 h-0.5 w-full -translate-y-1/2 ${
									i <= activeIndex ? "bg-emerald-500" : "bg-border"
								}`}
							/>
						)}
						<span
							className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-semibold transition-colors ${
								done
									? "border-emerald-500 bg-emerald-500 text-white"
									: active
										? "border-emerald-500 bg-background text-emerald-600 ring-4 ring-emerald-500/15"
										: "border-border bg-background text-muted-foreground"
							}`}
						>
							{done ? <Check className="h-3.5 w-3.5" /> : i + 1}
						</span>
						<span
							className={`mt-2 text-center text-[11px] leading-tight ${
								done || active
									? "font-medium text-foreground"
									: "text-muted-foreground"
							}`}
						>
							{step.label}
						</span>
					</li>
				);
			})}
		</ol>
	);
};

const StatCard: React.FC<{
	label: string;
	value: React.ReactNode;
	icon: React.ReactNode;
	tint: string;
}> = ({ label, value, icon, tint }) => (
	<Card className="overflow-hidden rounded-2xl border shadow-sm">
		<CardContent className="flex items-center gap-4 p-4 md:p-5">
			<div
				className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint}`}
			>
				{icon}
			</div>
			<div className="min-w-0">
				<p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
					{label}
				</p>
				<p className="mt-0.5 truncate text-xl font-semibold md:text-2xl">
					{value}
				</p>
			</div>
		</CardContent>
	</Card>
);

const OrdersTabContent: React.FC<OrdersTabContentProps> = ({
	getStatusColor,
	getStatusIcon,
	formatCurrency,
	formatDate,
}) => {
	const { orders, cancelOrder, isLoading } = useOrder();
	const navigate = useNavigate();

	const completedCount = orders.filter((o) => {
		const s = normalizeStatus(o.status);
		return s === "delivered";
	}).length;

	const inProgressCount = orders.filter((o) => {
		const s = o.status.toLowerCase();
		return s === "processing" || s === "shipped";
	}).length;

	const totalSpent = orders.reduce(
		(acc, order) => acc + Number(order.totalAmount || 0),
		0,
	);

	const handleCancel = (id: (typeof orders)[number]["id"]) => {
		if (window.confirm("Are you sure you want to cancel this order?")) {
			cancelOrder(id);
		}
	};

	return (
		<>
			{/* Summary */}
			{!isLoading && orders.length > 0 && (
				<div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
					<StatCard
						label="Orders"
						value={orders.length}
						icon={<ShoppingBag className="h-5 w-5 text-blue-600" />}
						tint="bg-blue-50"
					/>
					<StatCard
						label="Delivered"
						value={completedCount}
						icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
						tint="bg-emerald-50"
					/>
					<StatCard
						label="In progress"
						value={inProgressCount}
						icon={<Clock className="h-5 w-5 text-amber-600" />}
						tint="bg-amber-50"
					/>
					<StatCard
						label="Total spent"
						value={formatCurrency(totalSpent)}
						icon={<Wallet className="h-5 w-5 text-purple-600" />}
						tint="bg-purple-50"
					/>
				</div>
			)}

			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-20">
					<Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
					<p className="text-muted-foreground">Loading your orders...</p>
				</div>
			) : orders.length === 0 ? (
				<Card className="rounded-2xl border-2 border-dashed">
					<CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
						<div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
							<ShoppingBag className="h-9 w-9 text-muted-foreground" />
						</div>
						<h3 className="mb-2 font-serif text-2xl">No orders yet</h3>
						<p className="mb-6 max-w-md text-muted-foreground">
							You haven't placed any orders yet. Start exploring our collections
							and place your first order.
						</p>
						<div className="flex flex-col gap-3 sm:flex-row">
							<Button
								onClick={() => navigate("/")}
								className="rounded-full px-6"
							>
								<ShoppingBag className="mr-2 h-4 w-4" />
								Browse products
							</Button>
							<Button
								variant="outline"
								onClick={() => navigate("/categories")}
								className="rounded-full px-6"
							>
								View categories
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<Accordion type="single" collapsible className="space-y-4">
					{orders.map((order) => {
						const canCancel =
							order.status === "pending" ||
							order.status === "confirmed" ||
							order.status === "processing";
						const previewItems = order.items?.slice(0, 3) ?? [];
						const extra = (order.items?.length ?? 0) - previewItems.length;

						return (
							<AccordionItem
								key={order.id}
								value={order.id.toString()}
								className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md data-[state=open]:shadow-md"
							>
								<AccordionTrigger className="px-4 py-4 hover:no-underline md:px-6">
									<div className="flex w-full items-center gap-4 pr-2">
										{/* Overlapping item thumbnails */}
										<div className="flex shrink-0 -space-x-4">
											{previewItems.length > 0 ? (
												previewItems.map((item, i) =>
													item.image ? (
														<img
															key={item.id || i}
															src={item.image}
															alt={item.name}
															className="h-14 w-14 rounded-xl border-2 border-card object-cover shadow-sm md:h-16 md:w-16"
														/>
													) : (
														<div
															key={item.id || i}
															className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-card bg-muted md:h-16 md:w-16"
														>
															<Package className="h-6 w-6 text-muted-foreground" />
														</div>
													),
												)
											) : (
												<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted md:h-16 md:w-16">
													<Package className="h-6 w-6 text-muted-foreground" />
												</div>
											)}
											{extra > 0 && (
												<div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-card bg-foreground text-xs font-medium text-background md:h-16 md:w-16">
													+{extra}
												</div>
											)}
										</div>

										<div className="min-w-0 flex-1 text-left">
											<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
												<h3 className="font-semibold">
													<span className="mr-1 text-xs font-normal uppercase tracking-wider text-muted-foreground">
														Order
													</span>
													#
													{order.orderNumber ||
														order.id.toString().slice(-6).toUpperCase()}
												</h3>
												<Badge
													variant={getStatusColor(order.status)}
													className="flex items-center gap-1 capitalize"
												>
													{getStatusIcon(order.status)}
													{order.status}
												</Badge>
											</div>
											<p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
												<Calendar className="h-3.5 w-3.5" />
												{formatDate(order.orderedAt)}
											</p>
											<p className="mt-0.5 text-sm">
												<span className="text-muted-foreground">
													{order.items.length} item
													{order.items.length > 1 ? "s" : ""}
												</span>
												<span className="mx-1.5 text-muted-foreground">•</span>
												<span className="font-semibold">
													{formatCurrency(order.totalAmount)}
												</span>
											</p>
										</div>
									</div>
								</AccordionTrigger>

								<AccordionContent className="px-4 pb-6 md:px-6">
									<div className="space-y-8 border-t pt-6">
										{/* Progress */}
										<OrderProgress status={order.status} />

										{/* Items */}
										<div>
											<h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em]">
												<ShoppingBag className="h-4 w-4" />
												Items ({order.items.length})
											</h4>
											<ul className="divide-y rounded-xl border">
												{order.items.map((item, index) => (
													<li
														key={item.id || index}
														className="flex items-center gap-4 p-3 md:p-4"
													>
														{item.image ? (
															<img
																src={item.image}
																alt={item.name}
																className="h-16 w-16 shrink-0 rounded-lg border object-cover"
															/>
														) : (
															<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
																<Package className="h-6 w-6 text-muted-foreground" />
															</div>
														)}
														<div className="min-w-0 flex-1">
															<p className="truncate text-sm font-medium">
																{item.name}
															</p>
															<p className="mt-0.5 text-xs text-muted-foreground">
																{formatCurrency(item.price)} × {item.quantity}
															</p>
														</div>
														<p className="text-sm font-semibold">
															{formatCurrency(item.quantity * item.price)}
														</p>
													</li>
												))}
											</ul>
										</div>

										{/* Delivery + timeline */}
										<div className="grid gap-6 md:grid-cols-2">
											<div>
												<h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em]">
													<MapPin className="h-4 w-4" />
													Delivery address
												</h4>
												<div className="rounded-xl border bg-muted/40 p-4 text-sm leading-relaxed">
													{order.shippingAddress}
												</div>
											</div>

											<div>
												<h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em]">
													<Clock className="h-4 w-4" />
													Details
												</h4>
												<dl className="space-y-3 rounded-xl border bg-muted/40 p-4 text-sm">
													<div className="flex items-center justify-between gap-4">
														<dt className="text-muted-foreground">
															Order placed
														</dt>
														<dd className="font-medium">
															{formatDate(order.orderedAt)}
														</dd>
													</div>
													{order.estimatedDelivery && (
														<div className="flex items-center justify-between gap-4">
															<dt className="text-muted-foreground">
																Estimated delivery
															</dt>
															<dd className="font-medium">
																{formatDate(order.estimatedDelivery)}
															</dd>
														</div>
													)}
													{order.trackingNumber && (
														<div className="flex items-center justify-between gap-4">
															<dt className="text-muted-foreground">
																Tracking number
															</dt>
															<dd className="font-mono text-xs font-medium">
																{order.trackingNumber}
															</dd>
														</div>
													)}
												</dl>
											</div>
										</div>

										{/* Total + actions */}
										<div className="flex flex-col gap-4 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
											<div>
												<p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
													Total amount
												</p>
												<p className="mt-1 text-2xl font-semibold md:text-3xl">
													{formatCurrency(order.totalAmount)}
												</p>
												<p className="text-xs text-muted-foreground">
													Including taxes and shipping
												</p>
											</div>

											<div className="flex flex-col gap-2 sm:flex-row">
												{order.trackingNumber && (
													<Button
														variant="outline"
														size="sm"
														className="rounded-full"
													>
														<Truck className="mr-2 h-4 w-4" />
														Track package
														<ArrowRight className="ml-2 h-3.5 w-3.5" />
													</Button>
												)}
												{canCancel && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleCancel(order.id)}
														className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
													>
														<XCircle className="mr-2 h-4 w-4" />
														Cancel order
													</Button>
												)}
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
			)}
		</>
	);
};

export default OrdersTabContent;
