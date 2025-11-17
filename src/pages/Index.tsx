
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryTabs from '@/components/categories/CategoryTabs';
import FeaturedProductsCarousel from '@/components/products/FeaturedProductsCarousel';
import TrendingProducts from '@/components/products/TrendingProducts';
import NewArrivalProducts from '@/components/products/NewArrivalProducts';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const categorySection = useScrollAnimation();
  const featuredSection = useScrollAnimation();
  const trendingSection = useScrollAnimation();
  const newArrivalSection = useScrollAnimation();
  const qualitySection = useScrollAnimation();
  const styleSection = useScrollAnimation();

  return (
    <Layout>
      <HeroCarousel />

      <section className="py-20" ref={categorySection.ref}>
        <div className={`container mx-auto px-4 transition-all duration-1000 ${categorySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>

          <CategoryTabs />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" ref={featuredSection.ref}>
        <div className={`container mx-auto px-4 transition-all duration-1000 delay-200 ${featuredSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Handpicked favorites from our latest collection
            </p>
          </div>
          <FeaturedProductsCarousel />

        </div>
      </section>

      <TrendingProducts />

      <NewArrivalProducts />

      <section className="py-20" ref={qualitySection.ref}>
        <div className={`container mx-auto px-4 text-center transition-all duration-1000 delay-300 ${qualitySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Quality Products
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
            Experience premium fashion with our carefully crafted clothing collection.
            Every piece is selected for quality, comfort, and style.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <div className="group p-10 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Get your orders delivered quickly and safely to your doorstep with our premium delivery service.</p>
            </div>

            <div className="group p-10 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600 leading-relaxed">Every product in our collection meets the highest quality standards and comes with our satisfaction guarantee.</p>
            </div>

            <div className="group p-10 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed">Shop with confidence using our secure payment system that protects your personal and financial information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Style Inspiration Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden" ref={styleSection.ref}>
        <div className="container mx-auto px-4">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-1000 delay-500 ${styleSection.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
            <div>
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Style Inspiration
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Discover the latest fashion trends and find your perfect style.
                From casual everyday wear to elegant formal attire, we have something for every occasion.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                  <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                  <div className="text-base text-gray-300">Clothing Items</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                  <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
                  <div className="text-base text-gray-300">Brands</div>
                </div>
              </div>
              <Button asChild size="lg" variant="outline" className="text-gray-900 border-white text-lg px-8 py-6">
                <Link to="/category/clothes">Explore Collection</Link>
              </Button>
            </div>
            <div className={`relative transition-all duration-1000 delay-700 ${styleSection.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-30"></div>
              <div className="relative rounded-2xl shadow-2xl bg-muted overflow-hidden aspect-[4/3]">
                <img
                  src='https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
                  alt='ads'
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
