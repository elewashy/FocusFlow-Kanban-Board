import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusTimerProps {
  task: Task | null;
  onTimeUpdate?: (seconds: number) => void;
}

export function FocusTimer({ task, onTimeUpdate }: FocusTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(!!task);
  const [isPaused, setIsPaused] = useState(false);
  
  // Format time as HH:MM:SS
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const secs = timeInSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Reset timer when a new task is selected
  useEffect(() => {
    if (task) {
      setSeconds(task.timeSpent || 0);
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsRunning(false);
      setIsPaused(false);
      setSeconds(0);
    }
  }, [task]);
  
  // Timer countdown logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && !isPaused) {
      interval = window.setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          if (onTimeUpdate) onTimeUpdate(newSeconds);
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isPaused, onTimeUpdate]);
  
  const handlePause = () => {
    setIsPaused(true);
  };
  
  const handleResume = () => {
    setIsPaused(false);
  };
  
  const handleReset = () => {
    setSeconds(0);
    if (onTimeUpdate) onTimeUpdate(0);
  };
  
  if (!task) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="bg-card shadow-lg rounded-lg overflow-hidden"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Focus Timer</h3>
            </div>
            <Badge 
              variant="outline" 
              className="px-2 py-1 bg-kanban-doing/10 text-kanban-doing border-kanban-doing"
            >
              FOCUS MODE
            </Badge>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">Currently working on:</p>
            <h4 className="text-lg font-medium">{task.title}</h4>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="font-mono text-4xl mb-6 tracking-tight">
              {formatTime(seconds)}
            </div>
            
            <div className="flex gap-2">
              {isPaused ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResume}
                  className="px-4 group"
                >
                  <Play className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                  Resume
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePause}
                  className="px-4 group"
                >
                  <Pause className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                  Pause
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="group"
              >
                <RotateCcw className="h-4 w-4 group-hover:text-primary transition-colors" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
