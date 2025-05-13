import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a reset token in localStorage
    const token = localStorage.getItem("resetPasswordToken");

    // Log for debugging
    console.log("Reset token in localStorage:", token ? "Found" : "Not found");

    if (!token) {
      // Check if we have a token in the URL hash (for direct access)
      if (window.location.hash && window.location.hash.includes("access_token")) {
        console.log("Found token in URL hash");
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");

        if (accessToken) {
          // Store the token from URL in localStorage
          localStorage.setItem("resetPasswordToken", accessToken);
          setHasToken(true);
          console.log("Stored token from URL hash");
        } else {
          setError("Invalid reset token in URL. Please request a password reset again.");
          setHasToken(false);
        }
      } else {
        setError("No reset token found. Please request a password reset again.");
        setHasToken(false);
      }
    } else {
      setHasToken(true);
    }
    setInitializing(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("resetPasswordToken");
      if (!token) {
        throw new Error("Reset token not found");
      }

      console.log("Using token for password reset:", token.substring(0, 10) + "...");

      // Call our new API endpoint that handles password reset confirmation
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/reset-password-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password,
          token
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Password reset error:", errorData);
        throw new Error(errorData.error || 'Failed to reset password');
      }

      const data = await response.json();
      console.log("Password update successful:", data);

      // Clear the token from localStorage
      localStorage.removeItem("resetPasswordToken");

      toast.success("Password has been reset successfully!");

      // Small delay before redirecting
      setTimeout(() => {
        navigate("/auth");
      }, 800);
    } catch (error: any) {
      console.error("Reset password error:", error);

      if (error.message?.includes("token")) {
        // Token expired or invalid
        setError("Your password reset link has expired. Please request a new one.");
        toast.error("Password reset link expired");

        // Clear the invalid token
        localStorage.removeItem("resetPasswordToken");

        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } else {
        setError(error.message || "Failed to reset password.");
        toast.error(error.message || "Failed to reset password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (initializing) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Loading...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!hasToken) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-red-500">
            No valid reset token found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
          <Button
            className="w-full"
            onClick={() => navigate("/auth")}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below
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
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
