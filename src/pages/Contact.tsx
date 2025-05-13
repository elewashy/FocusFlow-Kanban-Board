import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto py-20 px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
          <p className="text-xl text-muted-foreground">
            Have questions? We're here to help you get the most out of FocusFlow.
          </p>
        </div>

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" required placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" required placeholder="Enter your last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  required
                  placeholder="What is your message about?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  placeholder="Type your message here"
                  className="min-h-[150px]"
                />
              </div>

              <Button type="submit" className="w-full">
                <MailCheck className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Other Ways to Reach Us</h2>
          <div className="text-muted-foreground space-y-2">
            <p>Email: support@focusflow.ai</p>
            <p>Hours: Monday - Friday, 9:00 AM - 6:00 PM (UTC+2)</p>
            <p>Response time: Within 24 hours</p>
          </div>
        </div>
      </main>
    </div>
  );
}
