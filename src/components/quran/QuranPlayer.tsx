import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Volume2, Search, ChevronLeft, Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { surahs } from "@/data/surahs";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Reciter {
  id: string;
  name: string;
  Server: string;
  rewaya: string;
  count: string;
  letter: string;
}

interface Surah {
  id: string;
  name: string;
}

export function QuranPlayer() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [filteredReciters, setFilteredReciters] = useState<Reciter[]>([]);
  const [initialSurahs] = useState(surahs);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentReciter, setCurrentReciter] = useState<Reciter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSurahs, setShowSurahs] = useState(false);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReciters();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredReciters(reciters);
    } else {
      const filtered = reciters.filter(reciter =>
        reciter.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReciters(filtered);
    }
  }, [searchQuery, reciters]);

  const fetchReciters = async () => {
    try {
      const response = await fetch("https://mp3quran.net/api/_arabic.php");
      const data = await response.json();
      const recitersData = data.reciters;
      setReciters(recitersData);
      setFilteredReciters(recitersData);
    } catch (err) {
      setError("Failed to load reciters");
      console.error("Error fetching reciters:", err);
    }
  };

  const handleReciterClick = (reciter: Reciter) => {
    setCurrentReciter(reciter);
    setShowSurahs(true);
  };

  const playSurah = (surah: Surah) => {
    if (audioRef.current && currentReciter) {
      const surahNumber = surah.id.padStart(3, '0');
      audioRef.current.src = `${currentReciter.Server}/${surahNumber}.mp3`;
      setCurrentSurah(surah);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSurahClick = (surah: Surah) => {
    playSurah(surah);
  };

  const playNextSurah = () => {
    if (currentSurah) {
      const currentIndex = initialSurahs.findIndex(s => s.id === currentSurah.id);
      if (currentIndex < initialSurahs.length - 1) {
        playSurah(initialSurahs[currentIndex + 1]);
      }
    }
  };

  const playPreviousSurah = () => {
    if (currentSurah) {
      const currentIndex = initialSurahs.findIndex(s => s.id === currentSurah.id);
      if (currentIndex > 0) {
        playSurah(initialSurahs[currentIndex - 1]);
      }
    }
  };

  const handleBack = () => {
    setShowSurahs(false);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        onEnded={() => {
          setIsPlaying(false);
          playNextSurah();
        }} 
      />
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 hover:bg-muted"
          >
            <Book className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          dir="rtl" 
          className="w-[300px] sm:w-[400px] p-6"
        >
          <SheetHeader className="border-b pb-4 mb-4">
            {showSurahs ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <SheetTitle>{currentReciter?.name}</SheetTitle>
              </div>
            ) : (
              <>
                <SheetTitle>القرآن الكريم</SheetTitle>
                <div className="relative mt-2">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن قارئ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 text-right"
                    dir="rtl"
                  />
                </div>
              </>
            )}
          </SheetHeader>
          
          {currentReciter && currentSurah && (
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  className="h-9 w-9 rounded-full hover:bg-secondary/20"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <div className="flex flex-col gap-0.5">
                  <div className="text-sm font-medium">{currentSurah.name}</div>
                  <div className="text-xs text-muted-foreground">{currentReciter.name}</div>
                </div>
              </div>
            </div>
          )}

          <ScrollArea className="h-[calc(100vh-200px)] mt-4">
            <div className="flex flex-col gap-2 p-4">
              {showSurahs ? (
                initialSurahs.map((surah) => (
                  <Button
                    key={surah.id}
                    variant="ghost"
                    className="w-full justify-between gap-2 text-right rounded-lg px-4 py-3 h-auto font-medium hover:bg-secondary/20"
                    onClick={() => handleSurahClick(surah)}
                  >
                    <div className="text-muted-foreground text-sm">{surah.id}</div>
                    <div className="flex-1 text-right font-medium">{surah.name}</div>
                  </Button>
                ))
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                filteredReciters.map((reciter) => (
                  <Button
                    key={reciter.id}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-right rounded-lg px-4 py-3 h-auto font-medium hover:bg-secondary/20"
                    onClick={() => handleReciterClick(reciter)}
                  >
                    <div className="flex-1 text-right">
                      <div className="font-medium">{reciter.name}</div>
                      <div className="text-xs text-muted-foreground flex gap-2 justify-end mt-1">
                        <span>{reciter.rewaya}</span>
                        <span>{reciter.count} سورة</span>
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
