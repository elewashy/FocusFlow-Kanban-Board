
import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useNavigate, useLocation } from "react-router-dom";
import { checkAuth } from "@/services/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check URL parameters for register flag
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setIsLogin(false);
    }
  }, [location]);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        navigate("/dashboard", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-primary py-4 px-6">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary-foreground"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
            <path d="M18 9H9" />
          </svg>
          <span className="text-lg font-semibold text-primary-foreground">FocusFlow</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">Welcome to FocusFlow</h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? 'Sign in to access your tasks and projects' : 'Create an account to get started'}
            </p>
          </div>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-600">
              {isLogin
                ? 'Note: For security, you must confirm your email before logging in.'
                : 'After registration, you\'ll need to confirm your email to login.'}
            </AlertDescription>
          </Alert>

          {isLogin ? (
            <LoginForm onToggle={toggleForm} />
          ) : (
            <RegisterForm onToggle={toggleForm} />
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
