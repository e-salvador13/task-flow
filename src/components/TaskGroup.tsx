'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskGroup as TGroup, GROUP_CONFIG } from '@/types';
import { TaskItem } from './TaskItem';
import { useState } from 'react';

interface TaskGroupProps {
  group: TGroup;
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskGroup({ group, tasks, onComplete, onDelete }: TaskGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const config = GROUP_CONFIG[group];
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (tasks.length === 0) return null;

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Group header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          flex items-center gap-3 mb-4 w-full text-left
          group cursor-pointer
        "
      >
        <span className="text-xl">{config.emoji}</span>
        <h2 className="text-lg font-semibold tracking-tight">
          {config.label}
        </h2>
        <span className="
          px-2 py-0.5 text-xs font-medium rounded-full
          bg-[var(--card)] text-[var(--muted)]
        ">
          {activeTasks.length}
        </span>
        <motion.svg
          animate={{ rotate: collapsed ? -90 : 0 }}
          className="w-4 h-4 text-[var(--muted)] ml-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Tasks */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              {activeTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={onComplete}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>

            {/* Completed tasks (collapsed by default) */}
            {completedTasks.length > 0 && (
              <CompletedSection
                tasks={completedTasks}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function CompletedSection({
  tasks,
  onComplete,
  onDelete,
}: {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="
          flex items-center gap-2 text-sm text-[var(--muted)]
          hover:text-[var(--foreground)] transition-colors
        "
      >
        <svg
          className={`w-3 h-3 transition-transform ${showCompleted ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {tasks.length} completed
      </button>

      <AnimatePresence>
        {showCompleted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 space-y-2 overflow-hidden"
          >
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
