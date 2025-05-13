import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic Kanban board",
      "AI Assistant (5 messages/day)",
      "Focus Timer",
      "Basic Quran Player",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "Best for individuals",
    features: [
      "Unlimited Kanban boards",
      "Unlimited AI messages",
      "Advanced Timer features",
      "Full Quran Player access",
      "Priority support",
      "Custom themes",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$29.99",
    period: "/month",
    description: "Perfect for small teams",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared boards",
      "Admin controls",
      "Team analytics",
      "API access",
    ],
    cta: "Start Trial",
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={plan.popular ? "border-primary shadow-lg relative" : ""}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/auth?register=true")}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Contact our support team and we'll be happy to help
            </p>
            <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
              Contact Support
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
