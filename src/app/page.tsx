'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskGroup as TGroup, GROUP_CONFIG } from '@/types';
import { loadTasks, saveTasks, createTask, parseTasks, generateResearch } from '@/store/tasks';
import { TaskInput, TaskGroup } from '@/components';

// Group order for display
const GROUP_ORDER: TGroup[] = ['inbox', 'work', 'dev', 'personal', 'health', 'finance', 'later'];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    setMounted(true);
    setTasks(loadTasks());
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (mounted) {
      saveTasks(tasks);
    }
  }, [tasks, mounted]);

  const handleAddTasks = useCallback((input: string) => {
    const parsed = parseTasks(input);
    const newTasks = parsed.tasks.map(t => 
      createTask(t.title, t.group, t.notes, t.dueDate, generateResearch(t.title))
    );
    setTasks(prev => [...newTasks, ...prev]);
  }, []);

  const handleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
        : t
    ));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // Group tasks
  const groupedTasks = GROUP_ORDER.reduce((acc, group) => {
    acc[group] = tasks.filter(t => t.group === group);
    return acc;
  }, {} as Record<TGroup, Task[]>);

  // Stats
  const totalActive = tasks.filter(t => !t.completed).length;
  const totalCompleted = tasks.filter(t => t.completed).length;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            TaskFlow
          </h1>
          <p className="text-[var(--muted)]">
            {totalActive === 0 
              ? "You're all caught up ✨"
              : `${totalActive} task${totalActive !== 1 ? 's' : ''} to do`
            }
          </p>
        </motion.header>

        {/* Input */}
        <TaskInput onSubmit={handleAddTasks} />

        {/* Empty state */}
        <AnimatePresence>
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-xl font-medium mb-2">No tasks yet</h2>
              <p className="text-[var(--muted)] max-w-sm mx-auto">
                Add your first task by typing or using voice. Try something like:
                <br />
                <span className="italic">"Call mom this week and deploy the new API"</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task groups */}
        <div className="space-y-2">
          {GROUP_ORDER.map(group => (
            <TaskGroup
              key={group}
              group={group}
              tasks={groupedTasks[group]}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Footer stats */}
        {tasks.length > 0 && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 pt-8 border-t border-[var(--card-border)] text-center text-sm text-[var(--muted)]"
          >
            <div className="flex justify-center gap-8">
              <span>{totalActive} active</span>
              <span>•</span>
              <span>{totalCompleted} completed</span>
            </div>
          </motion.footer>
        )}
      </div>
    </main>
  );
}
