
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryTabs from '@/components/categories/CategoryTabs';
import FeaturedProductsCarousel from '@/components/products/FeaturedProductsCarousel';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import { getFeaturedProducts } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  const { t } = useLanguage();

  return (
    <Layout>
      <HeroCarousel />
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('shopByCategory')}</h2>
          <CategoryTabs />
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('featuredProducts')}</h2>
          <FeaturedProductsCarousel products={featuredProducts} />
        </div>
      </section>
      
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <NewsletterSignup variant="centered" />
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('qualityProducts')}</h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto mb-8">
            {t('qualityDescription')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('fastDelivery')}</h3>
              <p className="text-gray-600">{t('fastDeliveryDesc')}</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('qualityGuaranteed')}</h3>
              <p className="text-gray-600">{t('qualityGuaranteedDesc')}</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('securePayments')}</h3>
              <p className="text-gray-600">{t('securePaymentsDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
