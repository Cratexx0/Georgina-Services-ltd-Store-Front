import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, ShoppingBag, Settings } from 'lucide-react';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.99,
      items: 3,
      products: ['Summer Floral Dress', 'Classic Sneakers']
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: 149.50,
      items: 2,
      products: ['Men\'s Chino Pants', 'Leather Handbag']
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 29.99,
      items: 1,
      products: ['Boys\' Graphic T-Shirt']
    }
  ];

  // Mock bookings data
  const mockBookings = [
    {
      id: 'BKG-001',
      serviceType: 'Deep Cleaning',
      date: '2024-02-01',
      time: '10:00 AM',
      status: 'Confirmed',
      address: '123 Main St, City'
    },
    {
      id: 'BKG-002',
      serviceType: 'Regular Cleaning',
      date: '2024-01-25',
      time: '2:00 PM',
      status: 'Completed',
      address: '456 Oak Ave, Town'
    },
    {
      id: 'BKG-003',
      serviceType: 'Window Cleaning',
      date: '2024-02-10',
      time: '9:00 AM',
      status: 'Pending',
      address: '789 Pine Rd, Village'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
      case 'confirmed':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground mt-1">Manage your orders and bookings</p>
            </div>
            <Link to="/settings">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockOrders.length}</div>
                <p className="text-xs text-muted-foreground">Lifetime orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockBookings.length}</div>
                <p className="text-xs text-muted-foreground">All time bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockOrders.filter(o => o.status !== 'Delivered').length}
                </div>
                <p className="text-xs text-muted-foreground">Orders in progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Orders and Bookings */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {order.products.join(', ')}
                            </div>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Cleaning Service Bookings</CardTitle>
                  <CardDescription>Manage your service appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.serviceType}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(booking.date).toLocaleDateString()}
                              <br />
                              <span className="text-muted-foreground">{booking.time}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{booking.address}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
