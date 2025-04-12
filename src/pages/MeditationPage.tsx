
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipBack, Volume2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  imageBg: string;
}

const MeditationPage = () => {
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const meditationSessions: MeditationSession[] = [
    {
      id: "morning-calm",
      title: "Morning Calm",
      description: "Start your day with a peaceful 5-minute meditation focusing on gratitude.",
      duration: 5,
      category: "beginner",
      imageBg: "bg-gradient-to-r from-blue-400 to-indigo-500",
    },
    {
      id: "stress-relief",
      title: "Stress Relief",
      description: "A 10-minute guided session to release tension and find your center.",
      duration: 10,
      category: "beginner",
      imageBg: "bg-gradient-to-r from-purple-400 to-pink-500",
    },
    {
      id: "deep-focus",
      title: "Deep Focus",
      description: "Enhance your concentration with this 15-minute mindfulness practice.",
      duration: 15,
      category: "intermediate",
      imageBg: "bg-gradient-to-r from-green-400 to-teal-500",
    },
    {
      id: "sleep-well",
      title: "Sleep Well",
      description: "Prepare your mind for restful sleep with this calming 20-minute session.",
      duration: 20,
      category: "intermediate",
      imageBg: "bg-gradient-to-r from-indigo-400 to-purple-600",
    },
    {
      id: "loving-kindness",
      title: "Loving Kindness",
      description: "Cultivate compassion and love with this heartfelt 30-minute meditation.",
      duration: 30,
      category: "advanced",
      imageBg: "bg-gradient-to-r from-red-400 to-pink-500",
    },
    {
      id: "body-scan",
      title: "Body Scan",
      description: "A detailed 25-minute journey through your body to release tension.",
      duration: 25,
      category: "advanced",
      imageBg: "bg-gradient-to-r from-yellow-400 to-orange-500",
    },
  ];

  const startMeditation = (session: MeditationSession) => {
    setActiveSession(session);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetMeditation = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <PageLayout>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-bold mb-4">Meditation Exercises</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find peace and clarity with our guided meditation sessions. Choose a practice that resonates with you today.
        </p>
      </div>

      {activeSession ? (
        <div className="max-w-2xl mx-auto">
          <Card className="border shadow-lg overflow-hidden">
            <div className={`h-40 ${activeSession.imageBg} flex items-center justify-center`}>
              <h2 className="text-2xl font-bold text-white">{activeSession.title}</h2>
            </div>
            <CardContent className="p-6">
              <div className="mb-6">
                <p className="text-muted-foreground mb-4">{activeSession.description}</p>
                <div className="flex justify-between text-sm mb-2">
                  <span>0:00</span>
                  <span>{activeSession.duration}:00</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetMeditation}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-1" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-4">
              <Button
                variant="ghost"
                onClick={() => setActiveSession(null)}
                className="ml-auto"
              >
                Back to Sessions
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {["beginner", "intermediate", "advanced"].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {meditationSessions
                  .filter((session) => session.category === category)
                  .map((session) => (
                    <Card
                      key={session.id}
                      className="border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className={`h-24 ${session.imageBg}`}></div>
                      <CardHeader>
                        <CardTitle>{session.title}</CardTitle>
                        <CardDescription>
                          {session.duration} minutes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {session.description}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => startMeditation(session)}
                          className="w-full"
                        >
                          Begin Session
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </PageLayout>
  );
};

export default MeditationPage;
