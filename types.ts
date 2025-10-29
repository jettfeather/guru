export type Theme = 'light' | 'dark';

export type View = 'dashboard' | 'journal' | 'insights' | 'pricing' | 'messages';

export enum GoalCategory {
    Health = 'Health',
    Work = 'Work',
    Relationships = 'Relationships',
    Spiritual = 'Spiritual',
    Financial = 'Financial',
    Learning = 'Learning',
    Hobby = 'Hobby'
}

export enum JournalType {
    Thoughts = 'Thoughts of the Day',
    Joyful = 'Joyful Journal',
    Releasing = 'Work Releasing',
    Prayer = 'Prayer Journal',
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    category: GoalCategory;
    deadline: string;
    createdAt: string;
    completed: boolean;
    progress: string[]; // Array of dates 'YYYY-MM-DD'
}

export interface JournalEntry {
    id: string;
    date: string;
    content: string;
    goalId: string | null;
    type: JournalType;
}

export interface DailyCheckIn {
    id: string;
    date: string; // 'YYYY-MM-DD'
    physical: number; // 1-5
    mental: number; // 1-5
    spiritual: number; // 1-5
}

export interface Message {
    id: string;
    text: string;
    sender: 'You' | 'Mentor';
    timestamp: string;
}

export interface Conversation {
    id: string;
    participantName: string;
    messages: Message[];
}
