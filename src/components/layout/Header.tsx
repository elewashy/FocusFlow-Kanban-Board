import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Settings, User, List } from "lucide-react";
import { getCurrentUser, signOut } from "@/services/auth";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  activities: Array<{
    id: string;
    type: 'create' | 'update' | 'delete' | 'complete';
    taskTitle: string;
    timestamp: string;
  }>;
}

export function Header({ activities }: HeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastViewedTime, setLastViewedTime] = useState(Date.now());

  // Update unread count when new activities arrive
  useEffect(() => {
    const newActivities = activities.filter(
      activity => new Date(activity.timestamp).getTime() > lastViewedTime
    );
    setUnreadCount(newActivities.length);
  }, [activities, lastViewedTime]);

  const handleActivityOpenChange = (open: boolean) => {
    if (open) {
      setUnreadCount(0);
      setLastViewedTime(Date.now());
    }
  };

  useEffect(() => {
    // Get user from localStorage
    const loadUser = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
          avatar: currentUser.avatar
        });
      }
    };

    loadUser();

    // Set up event listener for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'authToken') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

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

        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <DropdownMenu onOpenChange={handleActivityOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <List className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-4 w-4 p-0 absolute -top-1 -right-1 flex items-center justify-center text-[10px]"
                  >
                    {unreadCount}
                  </Badge>
                )}
                <span className="sr-only">View activities</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Recent Activity</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px]">
                <ActivityFeed activities={activities} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
