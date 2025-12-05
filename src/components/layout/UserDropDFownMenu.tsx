import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Settings, Mail, UserCircle, Shield } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const UserSettingsPage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success('Settings updated successfully!');
  };

  const handleResetForm = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
    });
    toast.info('Form reset to original values');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Profile Settings</CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Account Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            View and update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User ID - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="userId" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              User ID
            </Label>
            <Input
              id="userId"
              value={user.id}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Your unique identifier (cannot be changed)
            </p>
          </div>

          {/* Role - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Account Role
            </Label>
            <Input
              id="role"
              value={user.role}
              disabled
              className="bg-muted cursor-not-allowed capitalize"
            />
            <p className="text-xs text-muted-foreground">
              Your account type (cannot be changed)
            </p>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold mb-4">Editable Information</h4>
            
            {/* Name - Editable */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email - Editable */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-muted-foreground">
                We'll use this email for notifications and account recovery
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleResetForm}
        >
          Reset Changes
        </Button>
        <Button
          type="button"
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Save Changes
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Settings className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Privacy & Security</p>
              <p className="text-blue-700">
                Your personal information is stored securely. Only you can view and modify your account details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettingsPage;