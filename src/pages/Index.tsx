
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageSquare, Smile, Wind, Brain, BookOpen } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "AI Chat Assistant",
      description: "Get guidance, support, and answers tailored to your wellness journey.",
      link: "/chat"
    },
    {
      icon: <Smile className="h-8 w-8 text-primary" />,
      title: "Meditation Exercises",
      description: "Follow guided meditation sessions to calm your mind and reduce stress.",
      link: "/meditation"
    },
    {
      icon: <Wind className="h-8 w-8 text-primary" />,
      title: "Breathing Space",
      description: "Practice breathing techniques with calming visuals and soothing music.",
      link: "/breathing"
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Mind Games",
      description: "Engage with relaxation games designed to refresh your mental state.",
      link: "/games"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Daily Log Book",
      description: "Track your mindfulness journey and record your experiences.",
      link: "/log"
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to MindMend
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal digital sanctuary for mental wellness, combining AI guidance
            with proven mindfulness techniques.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/chat">Start Chatting</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/meditation">Try Meditation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-mindmend-blue/20 -mx-8 px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold mb-4">Find Your Peace</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our range of mindfulness tools designed to help you relax,
            refocus, and rejuvenate your mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-2">{feature.icon}</div>
                <CardTitle className="text-xl font-medium">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{feature.description}</CardDescription>
                <Button asChild variant="ghost" className="px-0">
                  <Link to={feature.link} className="flex items-center gap-1">
                    Explore <span aria-hidden="true">→</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      <section className="py-20 text-center">
        <blockquote className="max-w-3xl mx-auto">
          <p className="text-2xl font-serif italic">
            "Peace comes from within. Do not seek it without."
          </p>
          <footer className="mt-4 text-muted-foreground">— Buddha</footer>
        </blockquote>
      </section>
    </PageLayout>
  );
};

export default Index;
