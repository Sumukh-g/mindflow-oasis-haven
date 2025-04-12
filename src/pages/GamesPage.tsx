
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shuffle, Brain, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const COLOR_WORDS = [
  { text: "RED", color: "text-red-500" },
  { text: "BLUE", color: "text-blue-500" },
  { text: "GREEN", color: "text-green-500" },
  { text: "PURPLE", color: "text-purple-500" },
  { text: "YELLOW", color: "text-yellow-500" },
];

const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Life is what happens when you're busy making other plans.",
  "Spread love everywhere you go.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Keep calm and carry on.",
  "Do what you can, with what you have, where you are.",
  "Believe you can and you're halfway there.",
  "Be yourself; everyone else is already taken.",
  "You only live once, but if you do it right, once is enough.",
  "The purpose of our lives is to be happy.",
];

const GamesPage = () => {
  // Color Match Game State
  const [colorGameActive, setColorGameActive] = useState(false);
  const [currentWord, setCurrentWord] = useState(COLOR_WORDS[0]);
  const [colorScore, setColorScore] = useState(0);
  const [timer, setTimer] = useState(30);

  // Memory Card Game State
  const [memorizeActive, setMemorizeActive] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [showQuote, setShowQuote] = useState(true);
  const [hardMode, setHardMode] = useState(false);

  // Breathing Bubble Game State
  const [bubbleCount, setBubbleCount] = useState(0);
  
  const getRandomItem = <T,>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const shuffleColorWord = () => {
    const newWord = getRandomItem(COLOR_WORDS.filter(word => word.text !== currentWord.text));
    const randomColor = getRandomItem(COLOR_WORDS.filter(color => 
      // In hard mode, always make text and color different
      hardMode ? color.text !== newWord.text : true
    )).color;
    
    setCurrentWord({
      text: newWord.text,
      color: randomColor,
    });
  };

  const startColorGame = () => {
    setColorGameActive(true);
    setColorScore(0);
    setTimer(30);
    shuffleColorWord();
    
    const countdown = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setColorGameActive(false);
          toast({
            title: "Game Over!",
            description: `You scored ${colorScore} points.`,
          });
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  };

  const handleColorAnswer = (isMatching: boolean) => {
    const textMatchesColor = currentWord.text === currentWord.color.replace("text-", "").replace("-500", "").toUpperCase();
    
    if ((isMatching && textMatchesColor) || (!isMatching && !textMatchesColor)) {
      setColorScore(prev => prev + 1);
    } else {
      setColorScore(prev => Math.max(0, prev - 1));
    }
    
    shuffleColorWord();
  };

  const startMemorizeGame = () => {
    setMemorizeActive(true);
    setShowQuote(true);
    setCurrentQuote(getRandomItem(QUOTES));
    
    setTimeout(() => {
      setShowQuote(false);
    }, hardMode ? 3000 : 5000);
  };

  const popBubble = () => {
    setBubbleCount(prev => prev + 1);
    toast({
      title: "Pop!",
      description: `You've popped ${bubbleCount + 1} bubbles.`,
      duration: 1500,
    });
  };

  return (
    <PageLayout>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-bold mb-4">Mind Games</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Engage with these simple games designed to refresh your mental state and provide a moment of relaxation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Color Match Game */}
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" /> Color Match
            </CardTitle>
            <CardDescription>
              Test your focus by matching colors with their names
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[220px] flex flex-col items-center justify-center">
            {!colorGameActive ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Quickly determine if the color of the text matches the word.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Switch id="hard-mode" checked={hardMode} onCheckedChange={setHardMode} />
                  <Label htmlFor="hard-mode">Hard Mode</Label>
                </div>
                <Button onClick={startColorGame}>Start Game</Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-between mb-3 text-sm font-medium">
                  <span>Score: {colorScore}</span>
                  <span>Time: {timer}s</span>
                </div>
                <div className="mb-8">
                  <span className={cn("text-4xl font-bold", currentWord.color)}>
                    {currentWord.text}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleColorAnswer(true)}
                  >
                    Match
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleColorAnswer(false)}
                  >
                    No Match
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Memorize Quote Game */}
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" /> Memory Challenge
            </CardTitle>
            <CardDescription>
              Test your short-term memory with quotes
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[220px] flex flex-col items-center justify-center">
            {!memorizeActive ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Memorize the quote before it disappears.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Switch id="quote-hard-mode" checked={hardMode} onCheckedChange={setHardMode} />
                  <Label htmlFor="quote-hard-mode">Hard Mode (Less Time)</Label>
                </div>
                <Button onClick={startMemorizeGame}>Start Challenge</Button>
              </div>
            ) : (
              <div className="text-center">
                {showQuote ? (
                  <div className="animate-fade-in">
                    <p className="text-sm font-medium mb-2">Memorize this quote:</p>
                    <p className="font-serif text-lg italic mb-3">{currentQuote}</p>
                    <p className="text-xs text-muted-foreground">
                      Disappearing in {hardMode ? "3" : "5"} seconds...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-medium">What was the quote?</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowQuote(true)}
                    >
                      Show Quote
                    </Button>
                    <Button 
                      className="w-full"
                      onClick={startMemorizeGame}
                    >
                      Try Another
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bubble Pop Game */}
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Bubble Pop
            </CardTitle>
            <CardDescription>
              Pop bubbles for simple mindful pleasure
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[220px] p-4 flex flex-col items-center justify-center">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-3">
                Simply click on the bubble to pop it. There's no score, just enjoyment.
              </p>
              <p className="text-sm font-medium">Bubbles popped: {bubbleCount}</p>
            </div>
            
            <button
              onClick={popBubble}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 
                         hover:scale-110 transition-transform duration-300 flex items-center 
                         justify-center shadow-md hover:shadow-lg relative overflow-hidden"
              aria-label="Pop bubble"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full transform scale-90"></div>
              <div className="absolute top-2 right-5 w-3 h-3 bg-white/40 rounded-full"></div>
              <span className="sr-only">Pop!</span>
            </button>
            
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setBubbleCount(0)}
              >
                Reset Count
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Random Quote Generator */}
        <Card className="border shadow-md md:col-span-3">
          <CardHeader>
            <CardTitle>Mindfulness Quote</CardTitle>
            <CardDescription>
              Take a moment to reflect on this thought
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <blockquote className="font-serif text-xl italic">
              {currentQuote}
            </blockquote>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setCurrentQuote(getRandomItem(QUOTES))}
              className="flex items-center gap-2"
            >
              <Shuffle className="h-4 w-4" /> New Quote
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default GamesPage;
