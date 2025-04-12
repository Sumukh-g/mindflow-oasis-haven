
import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const BreathingPage = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [volume, setVolume] = useState(70);
  const [breathingPattern, setBreathingPattern] = useState({
    inhale: 4,
    hold: 7,
    exhale: 8,
  });

  useEffect(() => {
    let timer: number;
    
    if (isBreathing) {
      const breatheCycle = () => {
        setBreathPhase("inhale");
        
        // Inhale phase
        timer = window.setTimeout(() => {
          setBreathPhase("hold");
          
          // Hold phase
          timer = window.setTimeout(() => {
            setBreathPhase("exhale");
            
            // Exhale phase (and then loop)
            timer = window.setTimeout(breatheCycle, breathingPattern.exhale * 1000);
          }, breathingPattern.hold * 1000);
        }, breathingPattern.inhale * 1000);
      };
      
      breatheCycle();
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isBreathing, breathingPattern]);

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getInstructions = () => {
    switch (breathPhase) {
      case "inhale":
        return "Breathe in slowly through your nose...";
      case "hold":
        return "Hold your breath...";
      case "exhale":
        return "Exhale slowly through your mouth...";
      default:
        return "Get ready to breathe...";
    }
  };

  return (
    <PageLayout>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-bold mb-4">Breathing Space</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take a moment to breathe and find your calm. Follow the guided breathing exercise below.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border shadow-md">
          <CardHeader className="text-center">
            <CardTitle>Guided Breathing</CardTitle>
            <CardDescription>
              Follow the expanding and contracting circle
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="mb-8 text-center">
              <p className="text-xl font-medium mb-2">{getInstructions()}</p>
              <p className="text-sm text-muted-foreground">
                {isBreathing 
                  ? `${breathingPattern.inhale}-${breathingPattern.hold}-${breathingPattern.exhale} Rhythm`
                  : "Press play to begin"}
              </p>
            </div>

            <div 
              className={cn(
                "breathing-circle relative mb-8",
                isBreathing && breathPhase === "inhale" && "animate-[breathe_4s_ease-in-out]",
                isBreathing && breathPhase === "hold" && "scale-110",
                isBreathing && breathPhase === "exhale" && "animate-[breathe_8s_ease-in-out_reverse]"
              )}
            >
              <div className="text-white text-lg font-medium">Breathe</div>
            </div>

            <div className="flex gap-4">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={toggleBreathing}
              >
                {isBreathing ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-1" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <div className="flex items-center w-full gap-3">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                disabled={isMuted}
              />
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle>Breathing Pattern</CardTitle>
              <CardDescription>
                Adjust the timing (in seconds)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Inhale</label>
                  <span className="text-sm">{breathingPattern.inhale}s</span>
                </div>
                <Slider
                  value={[breathingPattern.inhale]}
                  min={2}
                  max={10}
                  step={1}
                  onValueChange={(value) => 
                    setBreathingPattern({...breathingPattern, inhale: value[0]})
                  }
                  disabled={isBreathing}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Hold</label>
                  <span className="text-sm">{breathingPattern.hold}s</span>
                </div>
                <Slider
                  value={[breathingPattern.hold]}
                  min={0}
                  max={15}
                  step={1}
                  onValueChange={(value) => 
                    setBreathingPattern({...breathingPattern, hold: value[0]})
                  }
                  disabled={isBreathing}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Exhale</label>
                  <span className="text-sm">{breathingPattern.exhale}s</span>
                </div>
                <Slider
                  value={[breathingPattern.exhale]}
                  min={2}
                  max={15}
                  step={1}
                  onValueChange={(value) => 
                    setBreathingPattern({...breathingPattern, exhale: value[0]})
                  }
                  disabled={isBreathing}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setBreathingPattern({inhale: 4, hold: 7, exhale: 8})}
                disabled={isBreathing}
              >
                Reset to 4-7-8
              </Button>
            </CardFooter>
          </Card>

          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">• Reduces anxiety and stress</p>
              <p className="text-sm">• Improves focus and clarity</p>
              <p className="text-sm">• Helps with sleep quality</p>
              <p className="text-sm">• Regulates blood pressure</p>
              <p className="text-sm">• Enhances overall mindfulness</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default BreathingPage;
