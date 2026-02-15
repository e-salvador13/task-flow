export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  group: TaskGroup;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  research?: string;
}

export type TaskGroup = 
  | 'inbox'
  | 'work'
  | 'personal'
  | 'dev'
  | 'health'
  | 'finance'
  | 'later';

export interface ParsedTaskResult {
  tasks: Array<{
    title: string;
    group: TaskGroup;
    notes?: string;
    dueDate?: string;
    research?: string;
  }>;
}

export const GROUP_CONFIG: Record<TaskGroup, { label: string; color: string; emoji: string }> = {
  inbox: { label: 'Inbox', color: '#737373', emoji: '📥' },
  work: { label: 'Work', color: '#f59e0b', emoji: '💼' },
  personal: { label: 'Personal', color: '#8b5cf6', emoji: '🏠' },
  dev: { label: 'Dev', color: '#06b6d4', emoji: '💻' },
  health: { label: 'Health', color: '#22c55e', emoji: '🏃' },
  finance: { label: 'Finance', color: '#ec4899', emoji: '💰' },
  later: { label: 'Later', color: '#6b7280', emoji: '📅' },
};
