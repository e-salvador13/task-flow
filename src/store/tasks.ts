'use client';

import { Task, TaskGroup, ParsedTaskResult } from '@/types';
import { v4 as uuid } from 'uuid';

const STORAGE_KEY = 'taskflow-tasks';

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function createTask(
  title: string,
  group: TaskGroup = 'inbox',
  notes?: string,
  dueDate?: string,
  research?: string
): Task {
  return {
    id: uuid(),
    title,
    notes,
    completed: false,
    createdAt: Date.now(),
    group,
    dueDate,
    research,
  };
}

// AI-powered task parsing (runs locally for now)
export function parseTasks(input: string): ParsedTaskResult {
  const tasks: ParsedTaskResult['tasks'] = [];
  
  // Split by common separators
  const rawTasks = input
    .split(/[,;]|\band\b|\balso\b/i)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  for (const raw of rawTasks) {
    const task: ParsedTaskResult['tasks'][0] = {
      title: raw,
      group: 'inbox',
    };

    // Detect group from keywords
    const lowerRaw = raw.toLowerCase();
    
    if (/\b(code|build|deploy|api|bug|feature|github|vercel|aws|database|test)\b/i.test(lowerRaw)) {
      task.group = 'dev';
    } else if (/\b(meeting|email|slack|client|project|deadline|report|presentation)\b/i.test(lowerRaw)) {
      task.group = 'work';
    } else if (/\b(gym|workout|run|health|doctor|medicine|sleep|diet|exercise)\b/i.test(lowerRaw)) {
      task.group = 'health';
    } else if (/\b(pay|bill|budget|invest|money|bank|tax|salary)\b/i.test(lowerRaw)) {
      task.group = 'finance';
    } else if (/\b(call|mom|dad|family|friend|birthday|gift|home|clean|grocery|cook)\b/i.test(lowerRaw)) {
      task.group = 'personal';
    } else if (/\b(someday|later|maybe|eventually|when i have time)\b/i.test(lowerRaw)) {
      task.group = 'later';
    }

    // Detect time references
    if (/\b(today|tonight|this morning|this afternoon|this evening)\b/i.test(lowerRaw)) {
      task.dueDate = 'today';
    } else if (/\b(tomorrow)\b/i.test(lowerRaw)) {
      task.dueDate = 'tomorrow';
    } else if (/\b(this week|next few days)\b/i.test(lowerRaw)) {
      task.dueDate = 'this week';
    } else if (/\b(next week)\b/i.test(lowerRaw)) {
      task.dueDate = 'next week';
    }

    // Clean up title (remove time references we detected)
    task.title = raw
      .replace(/\b(today|tonight|tomorrow|this week|next week|this morning|this afternoon|this evening|someday|later|maybe|eventually)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Capitalize first letter
    if (task.title.length > 0) {
      task.title = task.title.charAt(0).toUpperCase() + task.title.slice(1);
    }

    if (task.title.length > 0) {
      tasks.push(task);
    }
  }

  return { tasks };
}

// Generate research note for a task (placeholder - can be enhanced with real API)
export function generateResearch(title: string): string | undefined {
  const lower = title.toLowerCase();
  
  if (/vercel|deploy/i.test(lower)) {
    return "Vercel deployment: Connect GitHub repo → Auto-deploys on push. Check vercel.com/docs for environment variables.";
  }
  if (/supabase/i.test(lower)) {
    return "Supabase: PostgreSQL + Auth + Storage. Quick start: npx create-next-app with Supabase template.";
  }
  if (/tailwind/i.test(lower)) {
    return "Tailwind CSS: Utility-first CSS. Use @apply for repeated patterns. Check tailwindcss.com/docs.";
  }
  
  return undefined;
}
