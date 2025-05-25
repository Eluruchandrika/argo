import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Upload } from "lucide-react";
// import { UserCircle, MessageCircle, Upload, Megaphone } from "lucide-react";

const discussions = [
  {
    title: "Crop Rotation Benefits?",
    author: "Rajeev Kumar",
    time: "2 hours ago",
    description:
      "Does rotating between pulses and cereals improve yield on black soil?",
    replies: 12,
    likes: 35,
  },
  {
    title: "Need help with soil test interpretation",
    author: "Sunita Sharma",
    time: "5 hours ago",
    description:
      "Got my soil report but confused about potassium levels. Can someone explain?",
    replies: 8,
    likes: 19,
  },
  {
    title: "Best short-duration crops",
    author: "Mohan Patil",
    time: "Yesterday",
    description:
      "Monsoon is late. What short-duration crops do you suggest for loamy soil?",
    replies: 20,
    likes: 42,
  },
];

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🌾 AgroCommunity – Share & Grow Together</h1>
      <p className="text-muted-foreground mb-6">
        Connect with fellow farmers, students, and agri-experts. Ask questions, get help, and share your farming journey.
      </p>

      <Separator className="my-4" />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-primary">🗨️ Latest Discussions</h2>
        <div className="grid gap-4">
          {discussions.map((discussion, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">✅ {discussion.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {discussion.author} • {discussion.time}
                </p>
                <p className="mt-2">{discussion.description}</p>
                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-4">
                  <MessageCircle className="h-4 w-4 text-primary" /> {discussion.replies} replies
                  <span>👍 {discussion.likes} likes</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-primary">✍️ Start a Discussion</h2>
        <Card>
          <CardContent className="p-4 space-y-2">
            <Input placeholder="Discussion Title" />
            <Textarea placeholder="Write your question, tip, or idea here..." />
            <Button>Post</Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-4" />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-primary">📸 Share Your Farm Story</h2>
        <Card>
          <CardContent className="p-4 space-y-2">
            <Input type="file" />
            <Textarea placeholder="Describe your farm story..." />
            <Button><Upload className="w-4 h-4 mr-2 text-primary" />Upload Story</Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-4" />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-primary">📢 Announcements</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground">
          <li>📚 Free Webinar: AI in Agriculture – June 1st, 5 PM</li>
          <li>🌦️ Weather Alert – Thunderstorms expected in Maharashtra this weekend</li>
          <li>📊 New Feature Launched – Market Trend Forecast is now live!</li>
        </ul>
      </div>

      <Separator className="my-4" />

      <footer className="text-center text-sm text-muted-foreground">
        © 2025 AgroAI | [Home] [Community] [Market Trends] [Profile]
      </footer>
    </div>
  );
}
