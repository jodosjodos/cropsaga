
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, LineChart, Brain, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

export default function Index() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate content loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                Intelligent Agriculture
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                <span className="bg-gradient-to-r from-primary to-agri-earth-DEFAULT text-transparent bg-clip-text">
                  CropSage
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] mx-auto">
                Precision agriculture monitoring and prediction system powered by machine learning
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/dashboard">
                    Explore Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/input">Input Field Data</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Intelligent Farming Solutions</h2>
              <p className="text-muted-foreground mt-4 max-w-[700px] mx-auto">
                Harness the power of data analytics and machine learning to optimize your agricultural practices
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Crop Monitoring',
                  description: 'Real-time monitoring of crop health and growth stages',
                  icon: Sprout,
                  color: 'bg-agri-green-light'
                },
                {
                  title: 'Data Analysis',
                  description: 'Comprehensive analysis of agricultural data for informed decisions',
                  icon: LineChart,
                  color: 'bg-agri-sky-light'
                },
                {
                  title: 'Predictive Insights',
                  description: 'ML-powered predictions for crop yield and potential issues',
                  icon: Brain,
                  color: 'bg-agri-earth-light'
                },
                {
                  title: 'Resource Management',
                  description: 'Optimize water, fertilizer, and resource usage for sustainability',
                  icon: Droplets,
                  color: 'bg-agri-soil-light'
                }
              ].map((feature, index) => (
                <AnimatedCard
                  key={index}
                  hoverEffect="tilt"
                  className={`transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="rounded-2xl overflow-hidden">
              <div className="relative bg-gradient-to-r from-primary/90 to-agri-earth-dark/90 p-8 md:p-12">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Ready to optimize your farming?</h2>
                    <p className="text-primary-foreground/80 mt-4 max-w-[500px]">
                      Start using CropSage today to make data-driven decisions and improve your agricultural productivity.
                    </p>
                  </div>
                  <Button asChild size="lg" variant="secondary" className="rounded-full shrink-0">
                    <Link to="/dashboard">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
