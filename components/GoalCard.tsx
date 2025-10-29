
import React, { useMemo } from 'react';
import { Goal, GoalCategory } from '../types';
import { Check, Trash2, CheckCircle, Target, Flame, Calendar } from 'lucide-react';

interface GoalCardProps {
    goal: Goal;
    toggleProgress: (goalId: string, date: string) => void;
    onComplete: (goalId: string) => void;
    onDelete: (goalId: string) => void;
}

const CATEGORY_STYLES: { [key in GoalCategory]: { bg: string; text: string; border: string } } = {
    [GoalCategory.Health]: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-500' },
    [GoalCategory.Work]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
    [GoalCategory.Relationships]: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-500' },
    [GoalCategory.Spiritual]: { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-500' },
    [GoalCategory.Financial]: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-500' },
    [GoalCategory.Learning]: { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-500' },
    [GoalCategory.Hobby]: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-500' },
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, toggleProgress, onComplete, onDelete }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isTodayCompleted = goal.progress.includes(todayStr);

    const { streak, progressPercentage } = useMemo(() => {
        const sortedProgress = [...goal.progress].sort();
        let currentStreak = 0;
        if (sortedProgress.length > 0) {
            let lastDate = new Date(sortedProgress[sortedProgress.length-1]);

            // Check if today or yesterday is the last completed day for streak
            const today = new Date();
            today.setHours(0,0,0,0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime()) {
                currentStreak = 1;
                for (let i = sortedProgress.length - 2; i >= 0; i--) {
                    const currentDate = new Date(sortedProgress[i]);
                    const expectedPreviousDate = new Date(lastDate);
                    expectedPreviousDate.setDate(expectedPreviousDate.getDate() - 1);
                    if (currentDate.getTime() === expectedPreviousDate.getTime()) {
                        currentStreak++;
                        lastDate = currentDate;
                    } else {
                        break;
                    }
                }
            }
        }
        
        const startDate = new Date(goal.createdAt);
        const deadlineDate = new Date(goal.deadline);
        const totalDays = Math.max(1, (deadlineDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        const daysPassed = Math.max(0, (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        
        let percentage = (daysPassed / totalDays) * 100;
        if (goal.completed) percentage = 100;
        if(percentage > 100) percentage = 100;

        return { streak: currentStreak, progressPercentage: percentage };
    }, [goal.progress, goal.createdAt, goal.deadline, goal.completed]);
    
    const style = CATEGORY_STYLES[goal.category];

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between border-l-4 ${style.border} transition-all duration-300 ${goal.completed ? 'opacity-60' : ''}`}>
            <div>
                <div className="flex justify-between items-start">
                    <span className={`text-xs font-semibold px-2 py-1 ${style.bg} ${style.text} dark:${style.bg}/20 rounded-full`}>
                        {goal.category}
                    </span>
                    <div className="flex items-center text-amber-500">
                        <Flame size={16} className="mr-1" />
                        <span className="font-bold text-sm">{streak}</span>
                    </div>
                </div>
                <h3 className="text-lg font-bold mt-2 text-gray-800 dark:text-gray-100">{goal.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">{goal.description}</p>
                 <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                 </div>
            </div>
            
            <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                {!goal.completed && (
                    <div className="flex items-center justify-between">
                         <button
                            onClick={() => toggleProgress(goal.id, todayStr)}
                            className={`flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors ${
                                isTodayCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {isTodayCompleted ? <CheckCircle size={16}/> : <Target size={16}/>}
                            <span>{isTodayCompleted ? "Done for Today" : "Log Today's Progress"}</span>
                        </button>
                        <div className="flex gap-2">
                             <button onClick={() => onComplete(goal.id)} className="p-2 text-gray-400 hover:text-green-500" aria-label="Mark as complete">
                                <Check size={20} />
                            </button>
                            <button onClick={() => onDelete(goal.id)} className="p-2 text-gray-400 hover:text-red-500" aria-label="Delete goal">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                )}
                 {goal.completed && (
                    <div className="flex items-center justify-center text-green-500 font-semibold gap-2">
                        <CheckCircle size={20} />
                        <span>Completed!</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalCard;
