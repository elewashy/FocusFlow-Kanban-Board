
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUp } from "@/services/auth";

export function RegisterForm({ onToggle }: { onToggle: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegistrationStatus("idle");
    setErrorMessage("");

    try {
      // Use our auth service to sign up
      await signUp(email, password, name);

      // Registration successful
      setRegistrationStatus("success");
      toast.success("Registration successful! Please check your email for confirmation instructions.");
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationStatus("error");

      // Handle specific error messages
      if (error.message?.includes("already registered")) {
        setErrorMessage("This email is already registered. Please try logging in instead.");
        toast.error("Email already registered");
      } else {
        setErrorMessage(error.message || "Failed to create account. Please try again.");
        toast.error(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {registrationStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Registration successful! Please check your email for confirmation instructions.
              </AlertDescription>
            </Alert>
          )}

          {registrationStatus === "error" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading || registrationStatus === "success"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || registrationStatus === "success"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || registrationStatus === "success"}
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || registrationStatus === "success"}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          <div className="text-center text-sm mt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggle}
              className="text-primary hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Sign in
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
