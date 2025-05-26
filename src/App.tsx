import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

// Pages
import Index from "@/pages/Index";
import CategoryPage from "@/pages/CategoryPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/NotFound";
import Auth from "./auth/Auth";
import ForgotPassword from "./auth/ForgetPassword";
import ResetPassword from "./auth/ResetPassword";
import CheckoutPage from "./pages/CheckOutPage";
import CleaningServicesPage from "./pages/CleaningServicesPage";
import Success from "./payment/Success";
import Failure from "./payment/Failure";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <WishlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot/password" element={<ForgotPassword/>} />
              <Route path="/reset/password" element={<ResetPassword/>} />
              <Route path="/success" element={<Success/>} />
              <Route path="/fail" element={<Failure/>} />
              <Route path="/cleaning-services" element={<CleaningServicesPage />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/category/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
              <Route path="/product/:productSlug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/search" element={<SearchResults />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WishlistProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
