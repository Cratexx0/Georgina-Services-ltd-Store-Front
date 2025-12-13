import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Users, Target, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">About Us</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">About Georgina Services Limited</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner for quality clothing, authentic foodstuffs, and professional cleaning services.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Our Mission</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To provide exceptional products and services that enhance the lives of our customers. 
              We are committed to delivering quality, authenticity, and value in everything we offer.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Our Vision</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To become the leading multi-service provider, recognized for our commitment to quality, 
              customer satisfaction, and community impact across all our business segments.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-center mb-8">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Quality', desc: 'We never compromise on the quality of our products and services.' },
              { icon: Users, title: 'Customer First', desc: 'Our customers are at the heart of everything we do.' },
              { icon: Award, title: 'Integrity', desc: 'We conduct business with honesty and transparency.' },
              { icon: Target, title: 'Excellence', desc: 'We strive for excellence in every aspect of our operations.' },
            ].map((value, index) => (
              <div key={index} className="text-center p-4">
                <div className="inline-flex p-3 bg-primary/10 rounded-full mb-3">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium mb-2">{value.title}</h3>
                <p className="text-xs text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-muted/50 rounded-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold text-center mb-6">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-lg p-5 border border-border">
              <h3 className="font-medium mb-2">Clothing</h3>
              <p className="text-xs text-muted-foreground">
                Authentic African wear and modern fashion for men, women, and children. 
                From traditional prints to contemporary designs.
              </p>
            </div>
            <div className="bg-background rounded-lg p-5 border border-border">
              <h3 className="font-medium mb-2">Foodstuffs</h3>
              <p className="text-xs text-muted-foreground">
                Quality pantry essentials, prepared mixes, and soup bases. 
                Bringing authentic African flavors to your kitchen.
              </p>
            </div>
            <div className="bg-background rounded-lg p-5 border border-border">
              <h3 className="font-medium mb-2">Cleaning Services</h3>
              <p className="text-xs text-muted-foreground">
                Professional cleaning services for offices, homes, and commercial spaces. 
                Reliable, thorough, and affordable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
