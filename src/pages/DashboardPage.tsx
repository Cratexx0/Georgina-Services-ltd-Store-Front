import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { useOrder } from '@/context/OrderContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, ShoppingBag, MapPin, Clock, Truck } from 'lucide-react';
import UserDropdownMenu from '@/components/layout/UserDropDFownMenu';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { bookings, cancelBooking } = useBooking();
  const { orders, cancelOrder } = useOrder();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">
              Manage your orders and bookings
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">Lifetime orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
                <p className="text-xs text-muted-foreground">Service bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(orders.reduce((acc, order) => acc + order.totalAmount, 0) + 
                     bookings.reduce((acc, booking) => acc + booking.price, 0)).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Orders + Services</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="orders" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
               <TabsTrigger value="user">Update Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          {order.orderedAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                        <Badge variant={getStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 pb-2 border-b last:border-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{order.shippingAddress}</span>
                    </div>

                    {order.trackingNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Tracking: {order.trackingNumber}</span>
                      </div>
                    )}

                    {order.estimatedDelivery && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Est. Delivery: {order.estimatedDelivery.toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-lg font-bold">Total: ${order.totalAmount.toFixed(2)}</p>
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="bookings" className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{booking.service}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          {booking.date.toLocaleDateString()} at {booking.timeSlot}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground">{booking.address}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Booked on: {booking.createdAt.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-lg font-bold">${booking.price.toFixed(2)}</p>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

              <TabsContent value="user" className="space-y-4">
      <UserDropdownMenu/>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
