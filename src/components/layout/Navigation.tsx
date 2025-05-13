import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkAuth } from "@/services/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navigation() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuth = await checkAuth();
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const NavItems = () => (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="w-full sm:w-auto justify-start sm:justify-center"
        onClick={() => {
          navigate("/blog");
          setOpen(false);
        }}
      >
        Blog
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full sm:w-auto justify-start sm:justify-center"
        onClick={() => {
          navigate("/pricing");
          setOpen(false);
        }}
      >
        Pricing
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full sm:w-auto justify-start sm:justify-center"
        onClick={() => {
          navigate("/contact");
          setOpen(false);
        }}
      >
        Contact
      </Button>
      {isAuthenticated ? (
        <Button
          variant="default"
          size="sm"
          className="w-full sm:w-auto justify-start sm:justify-center"
          onClick={() => {
            navigate("/dashboard");
            setOpen(false);
          }}
        >
          Dashboard
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto justify-start sm:justify-center"
            onClick={() => {
              navigate("/auth");
              setOpen(false);
            }}
          >
            Login
          </Button>
          <Button
            size="sm"
            className="w-full sm:w-auto justify-start sm:justify-center"
            onClick={() => {
              navigate("/auth?register=true");
              setOpen(false);
            }}
          >
            Get Started
          </Button>
        </>
      )}
    </>
  );

  if (isLoading) {
    return (
      <header className="border-b">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
              <path d="M18 9H9" />
            </svg>
            <span className="text-lg font-semibold">FocusFlow</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
            <path d="M18 9H9" />
          </svg>
          <span
            className="text-lg font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            FocusFlow
          </span>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden ml-auto">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80vw] sm:w-[385px] flex flex-col gap-4 pt-12">
              <NavItems />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden sm:flex ml-auto items-center gap-4">
          <NavItems />
        </nav>
      </div>
    </header>
  );
}
