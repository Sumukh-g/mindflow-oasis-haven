
import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save, ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface LogEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: 1 | 2 | 3 | 4 | 5;
  activities: string[];
}

const LogPage = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [entries, setEntries] = useState<LogEntry[]>([
    {
      id: "sample-1",
      date: new Date(),
      title: "My First Mindfulness Day",
      content: "Today I tried meditation for the first time. It was challenging to quiet my mind, but I managed to focus on my breath for a few minutes. I'm looking forward to building this practice.",
      mood: 4,
      activities: ["Meditation", "Deep Breathing"],
    },
  ]);
  const [newEntry, setNewEntry] = useState<Omit<LogEntry, "id">>({
    date: new Date(),
    title: "",
    content: "",
    mood: 3,
    activities: [],
  });
  const [activityInput, setActivityInput] = useState("");
  const { toast } = useToast();

  const saveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast({
        title: "Cannot save entry",
        description: "Please provide a title and content for your entry.",
        variant: "destructive",
      });
      return;
    }

    const entry: LogEntry = {
      ...newEntry,
      id: Date.now().toString(),
    };

    setEntries([entry, ...entries]);
    setIsAddingEntry(false);
    setNewEntry({
      date: new Date(),
      title: "",
      content: "",
      mood: 3,
      activities: [],
    });

    toast({
      title: "Entry saved",
      description: "Your journal entry has been added to your log book.",
    });
  };

  const addActivity = () => {
    if (!activityInput.trim()) return;
    
    setNewEntry({
      ...newEntry,
      activities: [...newEntry.activities, activityInput],
    });
    setActivityInput("");
  };

  const removeActivity = (activity: string) => {
    setNewEntry({
      ...newEntry,
      activities: newEntry.activities.filter(a => a !== activity),
    });
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < entries.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter entries for the current date
  const currentEntry = entries[currentPage];

  // Sort entries by date (newest first)
  useEffect(() => {
    setEntries(prev => [...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
  }, []);

  const moodEmojis = ["😟", "😔", "😐", "🙂", "😊"];

  return (
    <PageLayout>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-bold mb-4">Daily Log Book</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track your mindfulness journey and record your experiences in this digital journal.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {isAddingEntry ? (
          <div className="bg-white rounded-lg shadow-lg p-8 relative">
            <div className="absolute inset-y-0 -left-5 w-5 bg-mindmend-purple rounded-l-md"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingEntry(false)}
              className="absolute top-2 right-2"
            >
              Cancel
            </Button>

            <h2 className="text-2xl font-serif font-bold mb-6 text-center">New Journal Entry</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="entry-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEntry.date ? (
                          format(newEntry.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newEntry.date}
                        onSelect={(date) => date && setNewEntry({ ...newEntry, date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>How do you feel today?</Label>
                  <div className="flex justify-between items-center">
                    {moodEmojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="lg"
                        className={cn(
                          "text-2xl",
                          newEntry.mood === index + 1 && "bg-secondary"
                        )}
                        onClick={() => setNewEntry({ ...newEntry, mood: (index + 1) as any })}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-title">Title</Label>
                <Input
                  id="entry-title"
                  placeholder="Give your entry a title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-content">Journal Entry</Label>
                <Textarea
                  id="entry-content"
                  placeholder="Write about your mindfulness practice today..."
                  className="min-h-[200px]"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Activities</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an activity (e.g., Meditation)"
                    value={activityInput}
                    onChange={(e) => setActivityInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addActivity()}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={addActivity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newEntry.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {activity}
                      <button
                        onClick={() => removeActivity(activity)}
                        className="text-muted-foreground hover:text-primary ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={saveEntry}
              >
                <Save className="mr-2 h-4 w-4" /> Save Journal Entry
              </Button>
            </div>
          </div>
        ) : entries.length > 0 ? (
          <div className="relative">
            {/* Book with page turn effect */}
            <div className="book-page">
              <div className="book-spine"></div>
              
              <div className="pt-2 pb-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-sm text-muted-foreground">
                    {format(currentEntry.date, "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="text-xl">{moodEmojis[currentEntry.mood - 1]}</div>
                </div>
                
                <h2 className="text-2xl font-serif font-bold mb-4">{currentEntry.title}</h2>
                
                <div className="whitespace-pre-line mb-6">{currentEntry.content}</div>
                
                {currentEntry.activities.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-medium mb-2">Activities:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentEntry.activities.map((activity, index) => (
                        <span
                          key={index}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-center text-sm text-muted-foreground">
                  ~ Page {currentPage + 1} of {entries.length} ~
                </div>
              </div>
            </div>
            
            {/* Navigation and action buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              <Button
                onClick={() => setIsAddingEntry(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> New Entry
              </Button>
              
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === entries.length - 1}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-serif font-bold mb-4">Your Journal is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Start tracking your mindfulness journey by adding your first entry
            </p>
            <Button onClick={() => setIsAddingEntry(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create First Entry
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default LogPage;
