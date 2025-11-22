
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { useOrder } from '@/context/OrderContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, ShoppingBag, MapPin, Clock, Truck, Loader2, AlertCircle, CheckCircle2, User, DollarSign, XCircle } from 'lucide-react';
import UserDropdownMenu from '@/components/layout/UserDropDFownMenu';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { bookings, cancelBooking, isLoading: bookingsLoading, refreshBookings } = useBooking();
  const { orders, cancelOrder, isLoading: ordersLoading, refreshOrders } = useOrder();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (authLoading) {
      console.log('⏳ Auth still loading...');
      return;
    }

    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      navigate("/auth");
      return;
    }

    console.log('✅ Authenticated, loading dashboard data');
  
  }, [isAuthenticated, authLoading, navigate]);

  // Refresh data when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      refreshBookings();
      refreshOrders();
    }
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'delivered' || statusLower === 'completed' || statusLower === 'confirmed' || statusLower === 'paid') {
      return 'default';
    }
    if (statusLower === 'shipped' || statusLower === 'in-progress' || statusLower === 'processing') {
      return 'secondary';
    }
    if (statusLower === 'cancelled' || statusLower === 'failed') {
      return 'destructive';
    }
    return 'outline';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'delivered' || statusLower === 'completed' || statusLower === 'confirmed') {
      return <CheckCircle2 className="h-4 w-4" />;
    }
    if (statusLower === 'cancelled' || statusLower === 'failed') {
      return <XCircle className="h-4 w-4" />;
    }
    if (statusLower === 'shipped' || statusLower === 'in-progress') {
      return <Truck className="h-4 w-4" />;
    }
    return <Clock className="h-4 w-4" />;
  };

  const calculateTotalSpent = () => {
    const orderTotal = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    const bookingTotal = bookings.reduce((acc, booking) => acc + (booking.price || 0), 0);
    return orderTotal + bookingTotal;
  };

  const formatCurrency = (amount: number) => {
    return `GH₵${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isLoading = bookingsLoading || ordersLoading;

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
                <h1 className="text-2xl md:text-xl font-bold">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground">Manage your orders and bookings</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <div className="bg-blue-100 p-2 rounded-full">
                  <ShoppingBag className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{orders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Lifetime orders placed</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{bookings.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Service bookings made</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <div className="bg-purple-100 p-2 rounded-full">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {formatCurrency(calculateTotalSpent())}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Orders + Services combined</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
            <TabsContent value="orders" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Button onClick={() => navigate('/shop')}>
                      Browse Products
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            {order.orderNumber}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <Calendar className="h-4 w-4" />
                            Ordered on {formatDate(order.orderedAt)}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                          {order.paymentStatus && (
                            <Badge variant={getStatusColor(order.paymentStatus)} className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {order.paymentStatus}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={item.id || index} className="flex items-center gap-4 pb-3 border-b last:border-0">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                            <p className="font-semibold whitespace-nowrap">
                              {formatCurrency(item.quantity * item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Order Details */}
                      <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {order.shippingAddress}
                          </span>
                        </div>

                        {order.trackingNumber && (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              Tracking: <span className="font-mono font-medium">{order.trackingNumber}</span>
                            </span>
                          </div>
                        )}

                        {order.estimatedDelivery && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              Est. Delivery: {formatDate(order.estimatedDelivery)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Total and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-xl font-bold text-primary">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => cancelOrder(order.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Book a service to see your bookings here
                    </p>
                    <Button onClick={() => navigate('/services')}>
                      Browse Services
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-600" />
                            {booking.serviceType || booking.service}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4" />
                            {formatDate(booking.date)} at {booking.timeSlot}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusColor(booking.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {/* Booking Details */}
                      <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Service Address</p>
                            <p className="text-sm text-muted-foreground">{booking.address}</p>
                          </div>
                        </div>
                        
                        {booking.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Duration</p>
                              <p className="text-sm text-muted-foreground">{booking.duration} hours</p>
                            </div>
                          </div>
                        )}

                        {booking.selectedFeatures && booking.selectedFeatures.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="text-sm font-medium mb-2">Selected Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {booking.selectedFeatures.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {booking.specialInstructions && (
                          <div className="pt-2 border-t">
                            <p className="text-sm font-medium">Special Instructions:</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {booking.specialInstructions}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Booked On</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(booking.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Service Price</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(booking.price)}
                          </p>
                        </div>
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => cancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Update your profile information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserDropdownMenu />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;