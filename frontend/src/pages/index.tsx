import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, Shield, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Hero Section */}
      <header className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto text-center px-4 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6 px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full border border-indigo-400/30">
              <span className="text-indigo-300 text-sm font-medium">✨ Multi-Tenant Architecture</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Next-Gen Notes
              <br />
              <span className="text-indigo-400">SaaS Platform</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-10 text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade security meets intuitive design. Keep your company's data private, organized, and accessible with our premium multi-tenant solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer border border-indigo-400/50">
                  <span className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                </button>
              </Link>
              <Link href="/login">
                <button className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer">
                  <span className="flex items-center gap-2">
                    Sign In
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Enterprise Features
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built for scale, designed for security, optimized for performance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Shield,
                title: "Tenant Isolation",
                description: "Military-grade security ensures your company's data remains completely private and isolated from other tenants.",
                color: "from-green-400 to-emerald-500"
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Granular permission system where admins control subscriptions while members focus on productivity.",
                color: "from-blue-400 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Flexible Plans",
                description: "Start free with 3 notes, then scale unlimited with our Pro plan as your team grows.",
                color: "from-purple-400 to-pink-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-white group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 lg:py-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-3xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Simple Workflow
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Get started in minutes, not hours
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Secure Login",
                description: "Access your dedicated workspace with enterprise-grade authentication and tenant isolation."
              },
              {
                step: "02", 
                title: "Create & Collaborate",
                description: "Build, edit, and organize notes with your team while maintaining complete data privacy."
              },
              {
                step: "03",
                title: "Scale Unlimited",
                description: "Start with 3 free notes, then upgrade to Pro for unlimited creation and advanced features."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="relative group cursor-pointer"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-indigo-400/50 transition-all duration-500 hover:transform hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg mr-4">
                      {item.step}
                    </div>
                    <div className="h-px bg-gradient-to-r from-indigo-400/50 to-transparent flex-1"></div>
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 -right-6 text-indigo-400/30">
                    <ChevronRight className="w-12 h-12" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-12 lg:p-16 border border-indigo-400/30">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using our platform to secure and organize their knowledge.
            </p>
            <Link href="/login">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer border border-indigo-400/50">
                <span className="flex items-center gap-3">
                  Start Your Free Trial
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-white/10 py-12 mt-auto">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-slate-400">
              &copy; {new Date().getFullYear()} Multi-Tenant Notes SaaS. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {['About', 'Contact', 'Docs', 'Privacy'].map((link) => (
              <a 
                key={link}
                href="#" 
                className="text-slate-400 hover:text-white transition-colors duration-300 font-medium cursor-pointer relative group"
              >
                {link}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Custom cursor effect */}
      <div 
        className="fixed w-6 h-6 border border-indigo-400/50 rounded-full pointer-events-none z-50 transition-transform duration-150 mix-blend-difference"
        style={{ 
          left: mousePosition.x - 12, 
          top: mousePosition.y - 12,
          transform: `scale(${mousePosition.x || mousePosition.y ? 1 : 0})`
        }}
      ></div>
    </div>
  );
}