'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Task, GROUP_CONFIG } from '@/types';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const groupConfig = GROUP_CONFIG[task.group];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div
        className={`
          flex items-start gap-4 p-4 rounded-2xl
          bg-[var(--card)] border border-[var(--card-border)]
          hover:border-[var(--muted)] hover:shadow-sm
          cursor-pointer select-none
          ${task.completed ? 'opacity-50' : ''}
        `}
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(task.id);
          }}
          className={`
            mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0
            flex items-center justify-center
            transition-all duration-300 ease-out
            ${task.completed 
              ? 'bg-[var(--success)] border-[var(--success)]' 
              : 'border-[var(--card-border)] hover:border-[var(--accent)]'
            }
          `}
        >
          {task.completed && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`
            text-base font-medium leading-relaxed
            ${task.completed ? 'line-through text-[var(--muted)]' : ''}
          `}>
            {task.title}
          </p>
          
          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1.5 text-sm text-[var(--muted)]">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {task.dueDate}
              </span>
            )}
            {task.research && (
              <span className="flex items-center gap-1 text-[var(--accent)]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                has notes
              </span>
            )}
          </div>

          {/* Expanded details */}
          <AnimatePresence>
            {showDetails && (task.notes || task.research) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
                  {task.research && (
                    <p className="text-sm text-[var(--muted)] leading-relaxed">
                      💡 {task.research}
                    </p>
                  )}
                  {task.notes && (
                    <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
                      {task.notes}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Delete button (on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="
            opacity-0 group-hover:opacity-100
            p-1.5 rounded-lg
            text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10
            transition-all duration-150
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
