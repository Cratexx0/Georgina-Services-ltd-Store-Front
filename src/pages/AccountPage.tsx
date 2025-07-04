
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Package, User, LogOut, Edit, Save, MapPin, Phone, Mail, Calendar, CreditCard, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

const AccountPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    birthDate: '1990-01-01'
  });

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Mock order data - in a real app this would come from a backend
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.99,
      items: 3,
      products: ['Elegant Evening Dress', 'Classic Sneakers']
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

  const handleLogout = () => {
    logout();
  };

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the user profile
    setIsEditingProfile(false);
    toast.success('Profile updated successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserInitials = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                  <AvatarImage src="" alt={user?.firstName} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'Welcome!'
                    }
                  </h1>
                  <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {mockOrders.length} Orders
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {wishlist.length} Wishlist Items
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your personal details</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                      className="flex items-center gap-2"
                    >
                      {isEditingProfile ? (
                        <>
                          <Save className="h-4 w-4" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          Edit
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        {isEditingProfile ? (
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-gray-900 mt-1 p-2 bg-gray-50 rounded">{profileData.firstName || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        {isEditingProfile ? (
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-gray-900 mt-1 p-2 bg-gray-50 rounded">{profileData.lastName || 'Not provided'}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900 p-2 bg-gray-50 rounded flex-1">{profileData.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Update your contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {isEditingProfile ? (
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="flex-1"
                          />
                        ) : (
                          <p className="text-gray-900 p-2 bg-gray-50 rounded flex-1">{profileData.phone}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {isEditingProfile ? (
                          <Input
                            id="address"
                            value={profileData.address}
                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                            className="flex-1"
                          />
                        ) : (
                          <p className="text-gray-900 p-2 bg-gray-50 rounded flex-1">{profileData.address}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {isEditingProfile ? (
                          <Input
                            id="birthDate"
                            type="date"
                            value={profileData.birthDate}
                            onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                            className="flex-1"
                          />
                        ) : (
                          <p className="text-gray-900 p-2 bg-gray-50 rounded flex-1">{profileData.birthDate}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Enhanced Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order History
                  </CardTitle>
                  <CardDescription>Track your orders and view order details</CardDescription>
                </CardHeader>
                <CardContent>
                  {mockOrders.length > 0 ? (
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <h3 className="font-semibold text-lg">{order.id}</h3>
                                <Badge variant="secondary" className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Ordered: {order.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  <span>{order.items} items</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                              <div className="mt-3">
                                <p className="text-sm text-gray-600">Products: {order.products?.join(', ')}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">View Details</Button>
                              {order.status === 'Delivered' && (
                                <Button variant="outline" size="sm">Reorder</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                      <Button asChild>
                        <Link to="/">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    My Wishlist
                  </CardTitle>
                  <CardDescription>Items you've saved for later ({wishlist.length} items)</CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((product) => (
                        <div key={product.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                          <Link to={`/product/${product.slug}`}>
                            <div className="relative overflow-hidden">
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {product.discountPrice && (
                                <Badge className="absolute top-2 left-2 bg-red-500">
                                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                                </Badge>
                              )}
                            </div>
                          </Link>
                          <div className="p-4 space-y-3">
                            <Link to={`/product/${product.slug}`}>
                              <h3 className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {product.discountPrice ? (
                                  <>
                                    <span className="text-lg font-semibold text-gray-900">
                                      ${product.discountPrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-semibold text-gray-900">
                                    ${product.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromWishlist(product.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Heart className="h-4 w-4 fill-current" />
                              </Button>
                            </div>
                            <Button asChild className="w-full" size="sm">
                              <Link to={`/product/${product.slug}`}>View Product</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
                      <Button asChild>
                        <Link to="/">Browse Products</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* New Settings Tab */}
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Preferences</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive order updates and promotions</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Privacy Settings</Label>
                        <p className="text-sm text-gray-600">Manage your data and privacy</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" size="sm">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
