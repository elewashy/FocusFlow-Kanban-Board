import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { AIChatBox } from "@/components/ai/AIChatBox";
import { Task } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "@/components/kanban/TaskDialog";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { createTask, deleteTask, fetchUserTasks, updateTask } from "@/services/tasks";
import { checkAuth, getCurrentUser } from "@/services/auth";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(0);
  const [activities, setActivities] = useState<Array<{
    id: string;
    type: 'create' | 'update' | 'delete' | 'complete';
    taskTitle: string;
    timestamp: string;
  }>>([]);

  // Only add activity if it's not a timer update (more than 5 seconds between updates)
  const addActivity = (type: 'create' | 'update' | 'delete' | 'complete', taskTitle: string) => {
    const now = Date.now();
    if (type === 'update' && now - lastActivityTime < 5000) {
      return; // Skip timer updates
    }
    setLastActivityTime(now);
    setActivities(prev => [{
      id: `${now}`,
      type,
      taskTitle,
      timestamp: new Date().toISOString()
    }, ...prev.slice(0, 19)]); // Keep only last 20 activities
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
          navigate("/auth");
          return;
        }

        setIsAuthenticated(true);
        const user = getCurrentUser();

        if (user) {
          setUserId(user.id);
          const userTasks = await fetchUserTasks();
          setTasks(userTasks);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  const handleTaskCreate = async (taskData: Partial<Task>) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
      addActivity('create', newTask.title);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  const handleTaskUpdate = async (taskData: Task) => {
    try {
      const oldTask = tasks.find(t => t.id === taskData.id);
      const updatedTask = await updateTask(taskData.id, taskData);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));

      // Only add activity for status changes, not timer updates
      if (oldTask && oldTask.status !== taskData.status) {
        if (taskData.status === 'done') {
          addActivity('complete', taskData.title);
        } else {
          addActivity('update', taskData.title);
        }
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const handleTaskDelete = async (taskToDelete: Task) => {
    try {
      await deleteTask(taskToDelete.id);
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      addActivity('delete', taskToDelete.title);
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header activities={activities} />

        <main className="flex-1">
          <div className={`container mx-auto py-6 transition-[padding] ${isMobile ? "px-4" : "px-6 ml-16"}`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Your FocusFlow Board</h1>
                <p className="text-muted-foreground mt-1">
                  Focus on one task at a time to maximize productivity
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>

            <div className="mb-8">
              <KanbanBoard
                tasks={tasks}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />
            </div>
          </div>
        </main>

        <AIChatBox tasks={tasks} />
      </div>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleTaskCreate}
      />
    </div>
  );
}
