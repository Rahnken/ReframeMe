import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../providers/auth.provider";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async ({ context }) => {
    if (context.auth.authState === "authenticated") {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function Index() {
  const { authState } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (authState === "authenticated") {
      navigate({ to: "/dashboard" });
    }
  }, [authState, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-up">
          <div className="mb-6 flex justify-center">
            <img 
              src="/ReframeMe_logo.svg" 
              alt="Reframe Me Logo" 
              className="h-32 md:h-40 w-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
          <p className="text-2xl md:text-3xl font-subHeaders text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your life, one goal at a time
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>

        {/* Value Proposition */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-up">
          <p className="text-lg md:text-xl font-body text-foreground/80 leading-relaxed">
            Break free from overwhelming goals with our proven <span className="font-semibold text-primary">12-week cycle framework</span>. 
            Whether you're focused on physical wellness, emotional growth, or financial success, 
            Reframe Me transforms ambitious dreams into <span className="font-semibold text-secondary">actionable, achievable steps</span>.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="card-gradient p-8 rounded-2xl text-center hover-lift">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-headers text-primary mb-3">Smart Goal Setting</h3>
            <p className="font-body text-foreground/70">Break down big dreams into manageable 12-week cycles</p>
          </div>
          
          <div className="card-gradient p-8 rounded-2xl text-center hover-lift">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-2xl font-headers text-secondary mb-3">Track Progress</h3>
            <p className="font-body text-foreground/70">Monitor your journey with visual progress tracking</p>
          </div>
          
          <div className="card-gradient p-8 rounded-2xl text-center hover-lift">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-2xl font-headers text-yellow-600 mb-3">Stay Accountable</h3>
            <p className="font-body text-foreground/70">Share goals with groups for motivation and support</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card-gradient-empty p-8 rounded-2xl text-center border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
            <h2 className="text-3xl font-headers text-primary mb-4">
              Ready to Transform?
            </h2>
            <p className="font-body text-foreground/70 mb-6">
              Join thousands who've already started their journey
            </p>
            <Link 
              to="/register" 
              className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200"
            >
              Start Your Journey
            </Link>
          </div>
          
          <div className="card-gradient-empty p-8 rounded-2xl text-center border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300">
            <h2 className="text-3xl font-headers text-secondary mb-4">
              Welcome Back
            </h2>
            <p className="font-body text-foreground/70 mb-6">
              Continue building the life you envision
            </p>
            <Link 
              to="/login" 
              className="btn btn-secondary btn-lg px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="text-center mt-16 animate-fade-up">
          <blockquote className="text-lg md:text-xl font-subHeaders text-muted-foreground italic max-w-2xl mx-auto">
            "Small, consistent steps lead to extraordinary transformations"
          </blockquote>
        </div>
      </div>
    </div>
  );
}
