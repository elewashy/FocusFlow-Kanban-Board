import { useState, useRef, useEffect } from 'react';
import { generateAIResponse as generateAIResponseFromService } from '@/services/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Brain } from 'lucide-react';
import { Markdown } from './Markdown';
import { TypingAnimation } from './TypingAnimation';
import { toast } from 'sonner';
import { Task } from '@/types';
import './ai.css';

interface AIChatBoxProps {
  tasks: Task[];
}

type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
};

export function AIChatBox({ tasks }: AIChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const prevTasksRef = useRef<Task[]>([]);

  // Monitor task changes
  useEffect(() => {
    const prevTasks = prevTasksRef.current;

    // Find task changes
    const newTasks = tasks.filter(task => !prevTasks.find(t => t.id === task.id));
    const deletedTasks = prevTasks.filter(task => !tasks.find(t => t.id === task.id));
    const statusChanges = tasks.filter(task => {
      const prevTask = prevTasks.find(t => t.id === task.id);
      return prevTask && prevTask.status !== task.status;
    });

    // Auto-send AI messages for important changes
    const sendChangeNotification = async () => {
      // Process changes sequentially to avoid race conditions
      const notifications = [];

      if (newTasks.length > 0) {
        notifications.push({
          type: 'create',
          message: `Tell me about the new task "${newTasks[0].title}" that was just created.`
        });
      }

      if (deletedTasks.length > 0) {
        notifications.push({
          type: 'delete',
          message: `Update me about the task "${deletedTasks[0].title}" that was just deleted.`
        });
      }

      for (const task of statusChanges) {
        const prevTask = prevTasks.find(t => t.id === task.id);
        if (prevTask?.status === 'doing' && task.status === 'done') {
          notifications.push({
            type: 'complete',
            message: `Great news! Task "${task.title}" was just completed. Any thoughts?`
          });
        }
        if (task.status === 'doing') {
          notifications.push({
            type: 'start',
            message: `I've started working on task "${task.title}". Any tips or suggestions?`
          });
        }
      }

      // Send notifications sequentially
      if (prevTasks.length > 0) {
        for (const notif of notifications) {
          await handleSendMessage(notif.message);
        }
      }
    };

    sendChangeNotification();

    prevTasksRef.current = tasks;
  }, [tasks]);

  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 'welcome',
      content: `Hi! I'm your AI assistant.

I can help you:
- **Analyze your tasks**
- **Track your progress**
- **Plan next steps**

Let me know what you need.`,
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateContext = () => {
    const taskCount = tasks.length;
    const doingTasks = tasks.filter(t => t.status === 'doing');
    const doneTasks = tasks.filter(t => t.status === 'done');
    const todoTasks = tasks.filter(t => t.status === 'todo');

    return `Current tasks summary:
- Total tasks: ${taskCount}
- Tasks to do: ${todoTasks.length}
- Tasks in progress: ${doingTasks.length}
- Completed tasks: ${doneTasks.length}
- Current task in progress: ${doingTasks[0]?.title || 'None'}
- High priority todo tasks: ${todoTasks.filter(t => t.priority === 'high').length}`;
  };

  const handleSendMessage = async (message?: string) => {
    if ((!input.trim() && !message) || isLoading) return;

    const userMessage: MessageType = {
      id: `msg-${Date.now()}-user`,
      content: message || input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
      if (!message) setInput('');
    setIsLoading(true);

    try {
      const context = generateContext();
      const aiResponseContent = await generateAIResponseFromService(message || input, context);

      const aiMessage: MessageType = {
        id: `msg-${Date.now()}-ai`,
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in chat flow:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div>
        <Button
          className="fixed bottom-[calc(1rem_+_env(safe-area-inset-bottom))] right-4 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 bg-primary text-primary-foreground border-2 border-primary/20"
          onClick={() => setIsOpen(true)}
        >
          <Brain className="h-8 w-8" />
          <span className="sr-only">Open AI Chat</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile View */}
      <div className="md:hidden">
        <Card className="fixed bottom-0 right-0 w-full h-[100dvh] flex flex-col shadow-xl z-50 border-primary/10 overflow-hidden" onClick={e => e.stopPropagation()}>
          <CardHeader className="pb-3 flex flex-row justify-between items-center border-b pt-safe-top bg-primary/5">
            <CardTitle className="text-lg flex items-center flex-1 md:text-base">
              <span className="bg-primary/15 p-2 rounded-md mr-3 hidden sm:flex items-center justify-center shadow-sm">
                <Brain className="h-5 w-5 text-primary" />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold">AI Assistant</span>
                <span className="text-xs text-muted-foreground">Powered by FocusFlow</span>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden pb-safe-bottom">
            <ScrollArea className="h-full pr-4 md:pr-2">
              <div className="space-y-6 pb-4 pt-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                        {message.sender === 'user' ? (
                          <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center font-semibold shadow-inner">
                            U
                          </div>
                        ) : (
                          <div className="bg-primary/15 text-primary rounded-full h-full w-full flex items-center justify-center font-semibold text-xs">
                            AI
                          </div>
                        )}
                      </Avatar>

                      <div
                        className={`rounded-lg px-4 py-3 md:px-5 shadow-md ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-primary/10'
                        } ${message.sender === 'ai' ? 'bg-dot-pattern' : ''}`}
                      >
                        <div className="space-y-3">
                          <div className="message-content break-words">
                            <Markdown content={message.content} />
                          </div>
                          <div className="text-[10px] opacity-70 flex items-center gap-1">
                            <div className={`w-1 h-1 rounded-full ${message.sender === 'user' ? 'bg-primary-foreground' : 'bg-primary/50'}`} />
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start">
                      <Avatar className="h-8 w-8 mr-2">
                        <div className="bg-primary/15 text-primary rounded-full h-full w-full flex items-center justify-center font-semibold text-xs">
                          AI
                        </div>
                      </Avatar>
                      <div className="bg-card border border-primary/10 rounded-lg px-4 py-3 bg-dot-pattern shadow-md">
                        <TypingAnimation />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t pt-4 pb-safe-bottom bg-primary/5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full gap-3 px-2 md:px-0 justify-end"
            >
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 border-primary/20 focus-visible:ring-primary/30 bg-card shadow-sm h-11 rounded-xl"
              />
              <Button
                type="submit"
                size="icon"
                variant="default"
                disabled={isLoading || !input.trim()}
                className="h-11 w-11 rounded-full shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card className="fixed bottom-4 right-4 w-[400px] h-[600px] flex flex-col shadow-xl z-50 border-primary/10 overflow-hidden">
          <CardHeader className="pb-3 flex flex-row justify-between items-center border-b pt-safe-top bg-primary/5">
            <CardTitle className="text-lg flex items-center flex-1 md:text-base">
              <span className="bg-primary/15 p-2 rounded-md mr-3 hidden sm:flex items-center justify-center shadow-sm">
                <Brain className="h-5 w-5 text-primary" />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold">AI Assistant</span>
                <span className="text-xs text-muted-foreground">Powered by FocusFlow</span>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden pb-safe-bottom">
            <ScrollArea className="h-full pr-4 md:pr-2">
              <div className="space-y-6 pb-4 pt-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                        {message.sender === 'user' ? (
                          <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center font-semibold shadow-inner">
                            U
                          </div>
                        ) : (
                          <div className="bg-primary/15 text-primary rounded-full h-full w-full flex items-center justify-center font-semibold text-xs">
                            AI
                          </div>
                        )}
                      </Avatar>

                      <div
                        className={`rounded-lg px-4 py-3 md:px-5 shadow-md ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-primary/10'
                        } ${message.sender === 'ai' ? 'bg-dot-pattern' : ''}`}
                      >
                        <div className="space-y-3">
                          <div className="message-content break-words">
                            <Markdown content={message.content} />
                          </div>
                          <div className="text-[10px] opacity-70 flex items-center gap-1">
                            <div className={`w-1 h-1 rounded-full ${message.sender === 'user' ? 'bg-primary-foreground' : 'bg-primary/50'}`} />
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start">
                      <Avatar className="h-8 w-8 mr-2">
                        <div className="bg-primary/15 text-primary rounded-full h-full w-full flex items-center justify-center font-semibold text-xs">
                          AI
                        </div>
                      </Avatar>
                      <div className="bg-card border border-primary/10 rounded-lg px-4 py-3 bg-dot-pattern shadow-md">
                        <TypingAnimation />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t pt-4 pb-safe-bottom bg-primary/5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full gap-3 px-2 md:px-0 justify-end"
            >
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 border-primary/20 focus-visible:ring-primary/30 bg-card shadow-sm h-11 rounded-xl"
              />
              <Button
                type="submit"
                size="icon"
                variant="default"
                disabled={isLoading || !input.trim()}
                className="h-11 w-11 rounded-full shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
