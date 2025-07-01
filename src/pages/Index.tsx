
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryTabs from '@/components/categories/CategoryTabs';
import FeaturedProductsCarousel from '@/components/products/FeaturedProductsCarousel';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import { getFeaturedProducts } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  const { t } = useLanguage();

  return (
    <Layout>
      <HeroCarousel />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('shopByCategory')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated collection of premium clothing for every style and occasion
            </p>
          </div>
          <CategoryTabs />
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('featuredProducts')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked favorites from our latest collection
            </p>
          </div>
          <FeaturedProductsCarousel products={featuredProducts} />
          <div className="text-center mt-12">
            <Button asChild size="lg" className="px-8">
              <Link to="/category/clothing">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <NewsletterSignup variant="centered" />
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('qualityProducts')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Experience premium fashion with our carefully crafted clothing collection. 
            Every piece is selected for quality, comfort, and style.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('fastDelivery')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('fastDeliveryDesc')}</p>
            </div>
            
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('qualityGuaranteed')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('qualityGuaranteedDesc')}</p>
            </div>
            
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('securePayments')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('securePaymentsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Style Inspiration Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Style Inspiration</h2>
              <p className="text-lg text-gray-300 mb-8">
                Discover the latest fashion trends and find your perfect style. 
                From casual everyday wear to elegant formal attire, we have something for every occasion.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">500+</div>
                  <div className="text-sm text-gray-400">Clothing Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">50+</div>
                  <div className="text-sm text-gray-400">Brands</div>
                </div>
              </div>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                <Link to="/category/clothing">Explore Collection</Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Fashion collection" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
