
import React, { useMemo } from 'react';
import { JournalEntry, Goal } from '../types';
import { BookMarked } from 'lucide-react';

interface JournalProps {
    entries: JournalEntry[];
    goals: Goal[];
}

const JournalEntryCard: React.FC<{ entry: JournalEntry; goalTitle?: string }> = ({ entry, goalTitle }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm animate-fadeIn">
            <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-2 py-1 rounded-full">{entry.type}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{entry.content}</p>
            {goalTitle && (
                <div className="mt-3 text-xs inline-flex items-center gap-2 text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full">
                    <BookMarked size={14}/>
                    <span>{goalTitle}</span>
                </div>
            )}
        </div>
    );
};


const Journal: React.FC<JournalProps> = ({ entries, goals }) => {
    const goalMap = useMemo(() => new Map(goals.map(g => [g.id, g.title])), [goals]);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Past Entries</h3>
                 {entries.length > 0 ? (
                     entries.map(entry => (
                        <JournalEntryCard key={entry.id} entry={entry} goalTitle={entry.goalId ? goalMap.get(entry.goalId) : undefined} />
                    ))
                 ) : (
                    <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <p className="text-gray-500 dark:text-gray-400">Your journal is empty.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Press the '+' button to write your first entry!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journal;