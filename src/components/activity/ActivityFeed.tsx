import { Task } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Edit, Plus, Trash2 } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete' | 'complete';
  taskTitle: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'complete':
        return <Check className="h-4 w-4 text-green-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'create':
        return `Created task "${activity.taskTitle}"`;
      case 'update':
        return `Updated task "${activity.taskTitle}"`;
      case 'delete':
        return `Deleted task "${activity.taskTitle}"`;
      case 'complete':
        return `Completed task "${activity.taskTitle}"`;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No recent activity
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4 p-4">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-start gap-2 text-sm"
            >
              <div className="mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-foreground">
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
