import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { signIn } from "@/services/auth";

export function LoginForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Sign in using our auth service
      const user = await signIn(email, password);

      // Set flag for dashboard welcome message
      sessionStorage.setItem("justLoggedIn", "true");
      toast.success(`Welcome back, ${user.name}! 👋`);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
    } catch (error: any) {
      console.error("Login error:", error);

      // Special handling for email not confirmed error
      if (error.message?.includes("Email not confirmed")) {
        setError("Your email has not been confirmed. Please check your inbox for the confirmation link.");
        toast.error("Email not confirmed. Please check your inbox for the confirmation link.");
      } else {
        setError(error.message || "Failed to log in. Please check your credentials.");
        toast.error(error.message || "Failed to log in. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center text-sm mt-2">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onToggle}
              className="text-primary hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
