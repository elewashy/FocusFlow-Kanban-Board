import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { KanbanColumn } from './KanbanColumn';
import { Task, TaskStatus } from '@/types';
import { toast } from "sonner";
import { FocusTimer } from '../timer/FocusTimer';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { fetchUserTasks, createTask, updateTask, deleteTask } from '@/services/tasks';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (task: Task) => void;
}

const COLUMN_NAMES = {
  todo: "To Do",
  doing: "In Progress",
  done: "Done"
};

export function KanbanBoard({ tasks, onTaskCreate, onTaskUpdate, onTaskDelete }: KanbanBoardProps) {
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);

  useEffect(() => {
    const doingTask = tasks.find(task => task.status === 'doing') || null;
    setFocusedTask(doingTask);
  }, [tasks]);


  const handleTaskCreate = (taskData: Partial<Task>) => {
    if (taskData.status === 'doing' && tasks.some(t => t.status === 'doing')) {
      toast.error("Only one task can be in the 'In Progress' column. Complete or move the current task first.");
      return;
    }
    onTaskCreate(taskData);
  };

  const handleTaskUpdate = (taskData: Task) => {
    if (taskData.status === 'doing' && tasks.some(t => t.id !== taskData.id && t.status === 'doing')) {
      toast.error("Only one task can be in the 'In Progress' column. Complete or move the current task first.");
      return;
    }
    onTaskUpdate(taskData);
  };

  const handleTimerUpdate = (seconds: number) => {
    if (focusedTask) {
      onTaskUpdate({
        ...focusedTask,
        timeSpent: seconds
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {focusedTask && (
        <div className="mb-6">
          <FocusTimer 
            task={focusedTask} 
            onTimeUpdate={handleTimerUpdate} 
          />
        </div>
      )}
      
      <DragDropContext onDragEnd={async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const newStatus = destination.droppableId as TaskStatus;
        const taskId = result.draggableId;
        const task = tasks.find(t => t.id === taskId);

        if (!task) return;

        if (newStatus === 'doing') {
          const existingDoingTask = tasks.find(t => t.id !== taskId && t.status === 'doing');
          
          if (existingDoingTask) {
            toast.error("Only one task can be in the 'In Progress' column. Complete or move the current task first.");
            return;
          }
        }

        onTaskUpdate({ 
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString()
        });

        if (newStatus === 'doing') {
          toast.success("Focus timer started for task: " + task.title);
        } else if (task.status === 'doing' && newStatus === 'done') {
          toast.success("Task completed: " + task.title);
        }
      }}>
        <div className={`${
          useIsMobile() 
            ? "flex flex-col gap-4 overflow-y-auto pb-4" 
            : "grid grid-cols-3 gap-4"
        }`}>
          {Object.entries(COLUMN_NAMES).map(([status, title]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="h-full"
                >
                  <KanbanColumn
                    title={title}
                    status={status as TaskStatus}
                    tasks={tasks}
                    isDropDisabled={status === 'doing' && tasks.some(t => t.status === 'doing')}
                    onTaskCreate={handleTaskCreate}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={onTaskDelete}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
