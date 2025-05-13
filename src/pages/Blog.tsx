import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, ChevronRight, LayoutGrid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const blogPosts = [
  {
    id: 1,
    title: "Introducing AI Task Analysis",
    description: "Our new AI feature helps you break down complex tasks into manageable steps.",
    date: "May 9, 2025",
    readTime: "5 min read",
    category: "Feature Update",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "New Quran Player Features",
    description: "Enhanced audio quality, verse-by-verse navigation, and more Qaris added.",
    date: "May 7, 2025",
    readTime: "4 min read",
    category: "Feature Update",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Mobile App Coming Soon",
    description: "Stay productive on the go with our upcoming mobile app. Early access registration now open.",
    date: "May 5, 2025",
    readTime: "3 min read",
    category: "Announcement",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Team Collaboration Beta",
    description: "Test our new team features and help shape the future of collaborative productivity.",
    date: "May 3, 2025",
    readTime: "6 min read",
    category: "Beta Program",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Blog() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-4">Latest Updates</h1>
              <p className="text-xl text-muted-foreground">
                Stay up to date with our latest features and announcements
              </p>
            </div>
            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={`grid gap-8 ${
            viewType === "grid" 
              ? "grid-cols-1 md:grid-cols-2" 
              : "grid-cols-1"
          }`}>
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className={`${
                  viewType === "list" 
                    ? "flex items-start gap-6" 
                    : ""
                }`}>
                  <div className={`${
                    viewType === "list"
                      ? "flex-shrink-0 w-48"
                      : "w-full"
                  }`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {post.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-2xl">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-semibold"
                      >
                        Read More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
