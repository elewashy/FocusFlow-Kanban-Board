import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { useState, useEffect } from "react";
import { checkAuth } from "@/services/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Clock,
  Kanban,
  Book,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuth = await checkAuth();
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };

    verifyAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Boost Your Productivity with FocusFlow
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Your all-in-one productivity companion featuring AI assistance, Kanban
            boards, focus timer, and Quran player.
          </p>
          {!isAuthenticated && (
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/auth?register=true")}>
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
          {isAuthenticated && (
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Stay Focused
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card>
              <CardHeader>
                <Kanban className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Kanban Board</CardTitle>
                <CardDescription>
                  Organize your tasks with a visual, intuitive Kanban board
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Drag and drop tasks</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Track progress</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Get intelligent suggestions and help with your tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Smart suggestions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Task optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Focus Timer</CardTitle>
                <CardDescription>
                  Stay focused with our Pomodoro-style timer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Customizable intervals</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Break reminders</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Book className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Quran Player</CardTitle>
                <CardDescription>
                  Listen to Quran recitations while you work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>High-quality audio</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Surah selection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
            Ready to Boost Your Productivity?
          </h2>
          {!isAuthenticated ? (
            <Button
              size="lg"
              className="animate-pulse"
              onClick={() => navigate("/auth?register=true")}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose FocusFlow?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              More than just a productivity tool, FocusFlow is designed to help you achieve peak performance while maintaining balance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Boost Productivity</h3>
              <p className="text-muted-foreground">
                Advanced AI assistance helps you break down complex tasks and stay focused on what matters most.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Work Smarter</h3>
              <p className="text-muted-foreground">
                Intuitive Kanban boards and time management tools help you organize and prioritize effectively.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Balanced</h3>
              <p className="text-muted-foreground">
                Built-in Quran player and focus timer help you maintain spiritual and mental well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Start Your Productivity Journey</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Join thousands of users who have transformed their work habits with FocusFlow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">10k+</div>
              <p className="font-medium">Active Users</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">1M+</div>
              <p className="font-medium">Tasks Completed</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">4.9/5</div>
              <p className="font-medium">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
