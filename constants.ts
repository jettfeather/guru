

import { Goal, JournalEntry, GoalCategory, JournalType, Conversation } from './types';

export const GOAL_CATEGORIES: GoalCategory[] = [
    GoalCategory.Health,
    GoalCategory.Work,
    GoalCategory.Relationships,
    GoalCategory.Spiritual,
    GoalCategory.Financial,
    GoalCategory.Learning,
    GoalCategory.Hobby
];

export const JOURNAL_TYPES: JournalType[] = [
    JournalType.Thoughts,
    JournalType.Joyful,
    JournalType.Releasing,
    JournalType.Prayer,
];


const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
// FIX: Corrected typo from `new date` to `new Date`.
const dayBeforeYesterday = new Date(today);
dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);


const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const DUMMY_GOALS: Goal[] = [
    {
        id: '1',
        title: 'Morning Run 5x a Week',
        description: 'Run for at least 20 minutes every morning to boost energy and fitness.',
        category: GoalCategory.Health,
        deadline: new Date(today.getFullYear(), today.getMonth() + 2, 0).toISOString().split('T')[0],
        createdAt: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
        completed: false,
        progress: [formatDate(yesterday), formatDate(dayBeforeYesterday)],
    },
    {
        id: '2',
        title: 'Learn React Query',
        description: 'Complete a course on React Query to improve data fetching skills.',
        category: GoalCategory.Learning,
        deadline: new Date(today.getFullYear(), today.getMonth() + 1, 15).toISOString().split('T')[0],
        createdAt: new Date(today.getFullYear(), today.getMonth(), 5).toISOString(),
        completed: false,
        progress: [formatDate(yesterday)],
    },
     {
        id: '3',
        title: 'Meditate Daily',
        description: 'Practice mindfulness for 10 minutes each day.',
        category: GoalCategory.Spiritual,
        deadline: new Date(today.getFullYear() + 1, 0, 1).toISOString().split('T')[0],
        createdAt: new Date(today.getFullYear(), 0, 1).toISOString(),
        completed: true,
        progress: [],
    }
];

export const DUMMY_JOURNAL_ENTRIES: JournalEntry[] = [
    {
        id: 'j1',
        date: yesterday.toISOString(),
        content: "Felt great after the morning run today. The fresh air was invigorating. Also made some good progress on the React Query course, feeling more confident with it.",
        goalId: '1',
        type: JournalType.Thoughts,
    },
    {
        id: 'j2',
        date: dayBeforeYesterday.toISOString(),
        content: "A bit tired today, but still managed to get my run in. Pushing through on low-energy days feels like a big win.",
        goalId: '1',
        type: JournalType.Releasing,
    },
];

export const DUMMY_CONVERSATIONS: Conversation[] = [
    {
        id: 'convo1',
        participantName: 'Your Mentor',
        messages: [
            {
                id: 'msg1',
                text: "Hey! I was just looking at your progress on the 'Morning Run' goal. Amazing consistency this week. Keep up the fantastic work!",
                sender: 'Mentor',
                timestamp: yesterday.toISOString(),
            },
            {
                id: 'msg2',
                text: "Thanks for the encouragement! It's been tough but I'm sticking with it.",
                sender: 'You',
                timestamp: today.toISOString(),
            },
            {
                id: 'msg3',
                text: "That's the spirit! Remember, every step forward, no matter how small, is a victory. I'm here if you hit any roadblocks.",
                sender: 'Mentor',
                timestamp: today.toISOString(),
            }
        ]
    }
];


export const REFLECTION_PROMPTS = [
    "What went well today?",
    "What am I grateful for today?",
    "What's one thing I learned today?",
    "How did I move closer to my goals today?",
    "What was the biggest challenge I faced today, and how did I handle it?"
];