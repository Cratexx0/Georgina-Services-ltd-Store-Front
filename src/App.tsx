import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";

import { OrderProvider } from "@/context/OrderContext";

// Pages
import Index from "@/pages/Index";
import CategoryPage from "@/pages/CategoryPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/NotFound";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import CareersPage from "@/pages/CareersPage";
import Auth from "./auth/Auth";
import ForgotPassword from "./auth/ForgetPassword";
import ResetPassword from "./auth/ResetPassword";
import ChangePassword from "./auth/ChangePassword";
import CheckoutPage from "./pages/CheckOutPage";
import AccountPage from "./pages/AccountPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import CleaningServicesPage from "./pages/CleaningServicesPage";
import WishlistPage from "./pages/WishlistPage";
import Success from "./payment/Success";
import Failure from "./payment/Failure";
import BookingCheckoutPage from "./pages/BookingCheckoutPage";

import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();
// 
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
  
        <OrderProvider>
          <CartProvider>
            <WishlistProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route
                      path="/forgot/password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/reset/password" element={<ResetPassword />} />
                    <Route
                      path="/change/password"
                      element={<ChangePassword />}
                    />
                    <Route path="/payment/success" element={<Success />} />
                    <Route path="/payment/failure" element={<Failure />} />
                    <Route path="/booking-checkout" element={<BookingCheckoutPage />} />
                    {/* <Route path="/booking-success" element={<BookingSuccess />} /> */}
                    <Route
                      path="/category/:categorySlug"
                      element={<CategoryPage />}
                    />
                    <Route
                      path="/category/:categorySlug/:subcategorySlug"
                      element={<CategoryPage />}
                    />
                    <Route
                      path="/product/:productSlug"
                      element={<ProductPage />}
                    />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route
                      path="/category/services"
                      element={<CleaningServicesPage />}
                    />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </WishlistProvider>
          </CartProvider>
        </OrderProvider>
  
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
