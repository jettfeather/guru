import React, { useState } from 'react';
import { Goal, DailyCheckIn } from '../types';
import GoalCard from './GoalCard';
import DailyCheckInCard from './DailyCheckIn';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardProps {
    userName: string;
    goals: Goal[];
    toggleGoalProgress: (goalId: string, date: string) => void;
    markGoalAsComplete: (goalId: string) => void;
    deleteGoal: (goalId: string) => void;
    motivationalQuote: string;
    isLoadingQuote: boolean;
    checkIns: DailyCheckIn[];
    addCheckIn: (ratings: Omit<DailyCheckIn, 'id' | 'date'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, goals, toggleGoalProgress, markGoalAsComplete, deleteGoal, motivationalQuote, isLoadingQuote, checkIns, addCheckIn }) => {
    const [showCompleted, setShowCompleted] = useState(false);
    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);
    
    const todayStr = new Date().toISOString().split('T')[0];
    const hasCheckedInToday = checkIns.some(c => c.date === todayStr);

    const QuoteSkeleton = () => (
        <div className="w-full h-8 bg-slate-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome back, {userName}!</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Ready to make some progress today?</p>
            </div>
            
            {!hasCheckedInToday && <DailyCheckInCard onCheckIn={addCheckIn} />}
            
            <div className="p-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl shadow-lg text-center">
                <p className="font-semibold text-lg italic">
                    {isLoadingQuote ? <QuoteSkeleton /> : `"${motivationalQuote}"`}
                </p>
            </div>
            
            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Active Goals</h2>
                {activeGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeGoals.map(goal => (
                            <GoalCard 
                                key={goal.id} 
                                goal={goal} 
                                toggleProgress={toggleGoalProgress}
                                onComplete={markGoalAsComplete}
                                onDelete={deleteGoal}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <p className="text-gray-500 dark:text-gray-400">You have no active goals.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Click the '+' button to add one!</p>
                    </div>
                )}
            </section>

            {completedGoals.length > 0 && (
                <section>
                    <button 
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="w-full flex justify-between items-center text-left text-xl font-bold mb-4 text-gray-800 dark:text-gray-200"
                    >
                        <span>Completed Goals ({completedGoals.length})</span>
                        {showCompleted ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    {showCompleted && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                            {completedGoals.map(goal => (
                                <GoalCard 
                                    key={goal.id} 
                                    goal={goal} 
                                    toggleProgress={toggleGoalProgress}
                                    onComplete={markGoalAsComplete}
                                    onDelete={deleteGoal}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default Dashboard;