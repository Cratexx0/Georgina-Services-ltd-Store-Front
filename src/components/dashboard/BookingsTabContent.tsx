import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useBooking } from "@/context/BookingContext";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Loader2, XCircle } from "lucide-react";

export interface BookingsTabContentProps {
	getStatusColor: (
		status: string
	) => "default" | "secondary" | "destructive" | "outline";
	getStatusIcon: (status: string) => React.ReactNode;
	formatCurrency: (amount: number) => string;
	formatDate: (date: Date | string) => string;
}

const BookingsTabContent: React.FC<BookingsTabContentProps> = ({
	getStatusColor,
	getStatusIcon,
	formatCurrency,
	formatDate,
}) => {
	const { bookings, cancelBooking, isLoading, refreshBookings } = useBooking();
	const navigate = useNavigate();

	console.log('🎯 [BookingsTabContent] Current bookings:', bookings);
	console.log('🎯 [BookingsTabContent] IsLoading:', isLoading);
	console.log('🎯 [BookingsTabContent] Bookings length:', bookings?.length);

	return (
		<>
			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			) : bookings.length === 0 ? (
				<Card className="border-dashed border-2 border-gray-200">
					<CardContent className="flex flex-col items-center justify-center py-16">
						<div className="bg-gray-100 p-4 rounded-full mb-4">
							<Calendar className="h-12 w-12 text-gray-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
						<p className="text-muted-foreground text-center mb-4">
							Book a service to see your bookings here
						</p>
						<div className="flex gap-3">
							<Button onClick={() => navigate("/services")}>
								Browse Services
							</Button>
							<Button variant="outline" onClick={refreshBookings}>
								Refresh
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<>
					{/* Bookings Summary */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
						<Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-green-800">
											Total Bookings
										</p>
										<p className="text-2xl font-bold text-green-900">
											{bookings.length}
										</p>
									</div>
									<Calendar className="h-8 w-8 text-green-600" />
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-blue-800">
											Confirmed
										</p>
										<p className="text-2xl font-bold text-blue-900">
											{
												bookings.filter(
													(b) => b.status.toLowerCase() === "confirmed"
												).length
											}
										</p>
									</div>
									<Clock className="h-8 w-8 text-blue-600" />
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-purple-800">
											Total Spent
										</p>
										<p className="text-2xl font-bold text-purple-900">
											{formatCurrency(
												bookings.reduce(
													(acc, booking) => acc + (booking.price || 0),
													0
												)
											)}
										</p>
									</div>
									<MapPin className="h-8 w-8 text-purple-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Bookings Accordion */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Service Bookings
							</CardTitle>
							<CardDescription>
								View and manage your service bookings
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Accordion type="single" collapsible className="w-full">
								{bookings.map((booking) => (
									<AccordionItem
										key={booking.id}
										value={`booking-${booking.id}`}
									>
										<AccordionTrigger className="hover:no-underline">
											<div className="flex items-center justify-between w-full pr-4">
												<div className="flex items-center gap-3">
													<div className="bg-green-100 p-2 rounded-full">
														<Calendar className="h-4 w-4 text-green-600" />
													</div>
													<div className="text-left">
														<h3 className="font-semibold">
															{booking.serviceType || booking.service}
														</h3>
														<p className="text-sm text-muted-foreground">
															{formatDate(booking.date)} at {booking.timeSlot}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-3">
													<Badge
														variant={getStatusColor(booking.status)}
														className="flex items-center gap-1"
													>
														{getStatusIcon(booking.status)}
														{booking.status}
													</Badge>
													<span className="text-lg font-bold text-green-600">
														{formatCurrency(booking.price)}
													</span>
												</div>
											</div>
										</AccordionTrigger>
										<AccordionContent className="px-2 pb-4">
											<div className="bg-gray-50 rounded-lg p-4 space-y-4">
												{/* Service Details */}
												<div className="grid md:grid-cols-2 gap-4">
													<div className="space-y-3">
														<div className="flex items-start gap-2">
															<MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
															<div className="flex-1">
																<p className="text-sm font-medium">
																	Service Address
																</p>
																<p className="text-sm text-muted-foreground">
																	{booking.address}
																</p>
															</div>
														</div>

														{booking.duration > 0 && (
															<div className="flex items-center gap-2">
																<Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
																<div className="flex-1">
																	<p className="text-sm font-medium">
																		Duration
																	</p>
																	<p className="text-sm text-muted-foreground">
																		{booking.duration} hours
																	</p>
																</div>
															</div>
														)}
													</div>

													<div className="space-y-3">
														<div className="flex items-center gap-2">
															<Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
															<div className="flex-1">
																<p className="text-sm font-medium">Booked On</p>
																<p className="text-sm text-muted-foreground">
																	{formatDate(booking.createdAt)}
																</p>
															</div>
														</div>
													</div>
												</div>

												{/* Selected Features */}
												{booking.selectedFeatures &&
													booking.selectedFeatures.length > 0 && (
														<div className="pt-3 border-t border-gray-200">
															<p className="text-sm font-medium mb-2">
																Selected Features:
															</p>
															<div className="flex flex-wrap gap-2">
																{booking.selectedFeatures.map(
																	(feature, index) => (
																		<Badge
																			key={`${booking.id}-feature-${index}`}
																			variant="secondary"
																			className="text-xs"
																		>
																			{feature}
																		</Badge>
																	)
																)}
															</div>
														</div>
													)}

												{/* Special Instructions */}
												{booking.specialInstructions && (
													<div className="pt-3 border-t border-gray-200">
														<p className="text-sm font-medium">
															Special Instructions:
														</p>
														<p className="text-sm text-muted-foreground mt-1 bg-white p-3 rounded border">
															{booking.specialInstructions}
														</p>
													</div>
												)}

												{/* Actions */}
												{(booking.status === "pending" ||
													booking.status === "confirmed") && (
													<div className="pt-3 border-t border-gray-200">
														<Button
															variant="outline"
															size="sm"
															onClick={() => cancelBooking(booking.id)}
															className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
														>
															<XCircle className="h-4 w-4 mr-2" />
															Cancel Booking
														</Button>
													</div>
												)}
											</div>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</CardContent>
					</Card>
				</>
			)}
		</>
	);
};

export default BookingsTabContent;
