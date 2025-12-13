import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const CareersPage = () => {
  const openPositions = [
    {
      title: 'Store Manager',
      department: 'Retail',
      location: 'Accra, Ghana',
      type: 'Full-time',
    },
    {
      title: 'Cleaning Supervisor',
      department: 'Services',
      location: 'Accra, Ghana',
      type: 'Full-time',
    },
    {
      title: 'Customer Service Representative',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Delivery Driver',
      department: 'Logistics',
      location: 'Accra, Ghana',
      type: 'Part-time',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Careers</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Join Our Team</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Be part of a dynamic team dedicated to delivering exceptional products and services.
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="bg-muted/50 rounded-lg p-6 md:p-8 mb-10">
          <h2 className="text-lg font-semibold text-center mb-6">Why Work With Us?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Growth', desc: 'Opportunities for career advancement and skill development.' },
              { title: 'Benefits', desc: 'Competitive salary and comprehensive benefits package.' },
              { title: 'Culture', desc: 'Inclusive and supportive work environment.' },
              { title: 'Impact', desc: 'Make a meaningful difference in our community.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-lg font-semibold mb-5">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <div 
                key={index} 
                className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-medium">{position.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {position.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {position.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {position.type}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  Apply Now
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* No Position Found */}
        <div className="bg-card border border-border rounded-lg p-6 mt-8 text-center">
          <h3 className="font-medium mb-2">Don't see the right position?</h3>
          <p className="text-xs text-muted-foreground mb-4">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CareersPage;
