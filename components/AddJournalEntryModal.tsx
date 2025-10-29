import React, { useState } from 'react';
import { JournalType, Goal } from '../types';
import { JOURNAL_TYPES } from '../constants';
import { X } from 'lucide-react';

interface AddJournalEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddEntry: (content: string, goalId: string | null, type: JournalType) => void;
    goals: Goal[];
}

const AddJournalEntryModal: React.FC<AddJournalEntryModalProps> = ({ isOpen, onClose, onAddEntry, goals }) => {
    const [content, setContent] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [journalType, setJournalType] = useState<JournalType>(JournalType.Thoughts);
    const [error, setError] = useState('');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Journal entry cannot be empty.');
            return;
        }
        setError('');
        onAddEntry(content, selectedGoalId, journalType);
        // Reset form and close modal
        setContent('');
        setSelectedGoalId(null);
        setJournalType(JournalType.Thoughts);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">New Journal Entry</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">What are you writing about today?</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {JOURNAL_TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setJournalType(type)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                        journalType === type
                                            ? 'bg-brand-primary text-white font-semibold shadow'
                                            : 'bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing..."
                        className="w-full h-32 p-2 border border-gray-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                        aria-label="Journal entry content"
                        required
                    />
                    <select
                        value={selectedGoalId ?? ''}
                        onChange={(e) => setSelectedGoalId(e.target.value || null)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                        aria-label="Tag a goal"
                    >
                        <option value="">Tag a goal (optional)</option>
                        {goals.map(goal => (
                            <option key={goal.id} value={goal.id}>{goal.title}</option>
                        ))}
                    </select>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end gap-4 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity"
                        >
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddJournalEntryModal;
