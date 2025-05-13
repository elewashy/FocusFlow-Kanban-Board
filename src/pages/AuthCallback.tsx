import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // Log the full URL for debugging
        console.log("Full URL:", window.location.href);
        console.log("Hash:", window.location.hash);

        // Get URL parameters from query string
        const searchParams = new URLSearchParams(location.search);
        let token = searchParams.get("token");
        let type = searchParams.get("type");

        // Debug information
        let debugText = "URL Parameters:\n";
        searchParams.forEach((value, key) => {
          debugText += `${key}: ${value}\n`;
        });

        // Check for hash parameters (Supabase often puts tokens in hash fragment)
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));

          // Add hash parameters to debug info
          debugText += "\nHash Parameters:\n";
          hashParams.forEach((value, key) => {
            debugText += `${key}: ${value}\n`;
          });

          // Get token and type from hash if not already set
          if (!token) {
            token = hashParams.get("access_token");
            debugText += `\nUsing access_token from hash: ${token ? "Yes" : "No"}\n`;
          }

          if (!type) {
            type = hashParams.get("type");
            debugText += `\nUsing type from hash: ${type ? "Yes" : "No"}\n`;
          }
        }

        setDebugInfo(debugText);

        // If we still don't have token or type, show error
        if (!token) {
          setError("Invalid authentication link. Missing token parameter.");
          setIsProcessing(false);
          return;
        }

        // Handle based on type
        if (type === "recovery") {
          // Store token in localStorage for the reset password form to use
          localStorage.setItem("resetPasswordToken", token);
          toast.success("You can now reset your password");
          navigate("/reset-password");
          return;
        } else if (type === "signup") {
          // Handle email confirmation
          toast.success("Email verified successfully! You can now log in.");
          navigate("/auth");
          return;
        } else if (!type && token) {
          // If we have a token but no type, check if it's a recovery token
          // This happens with Supabase hash fragments sometimes

          // For recovery links, redirect to reset password
          if (window.location.href.includes("type=recovery") ||
              window.location.hash.includes("type=recovery")) {
            localStorage.setItem("resetPasswordToken", token);
            toast.success("You can now reset your password");
            navigate("/reset-password");
            return;
          }

          // Otherwise assume it's a successful auth
          toast.success("Authentication successful!");
          navigate("/auth");
          return;
        }

        // If we get here, it's an unknown type
        setError(`Unsupported authentication type: ${type || "unknown"}`);
        setIsProcessing(false);
      } catch (error) {
        console.error("Auth callback error:", error);
        setError("Failed to process authentication. Please try again.");
        setIsProcessing(false);
      }
    };

    processAuthCallback();
  }, [location, navigate]);

  const goToLogin = () => {
    navigate("/auth");
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Processing Authentication</CardTitle>
            <CardDescription>Please wait while we verify your request...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription className="text-red-500">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {debugInfo && (
              <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                <pre>{debugInfo}</pre>
              </div>
            )}
            <div className="flex justify-center">
              <Button onClick={goToLogin}>Go to Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
