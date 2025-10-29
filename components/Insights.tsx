import React, { useMemo, useState, useCallback } from 'react';
import { Goal, JournalEntry, GoalCategory, View } from '../types';
import { generateWordCloudData, getGoalSuggestions, summarizeWeeklyProgress, getReflectionInsights } from '../services/geminiService';
import { GOAL_CATEGORIES } from '../constants';
import { Award, BrainCircuit, Sparkles, HelpCircle } from 'lucide-react';

// A placeholder for a word cloud component.
// In a real app, you would use a library like 'react-wordcloud'.
const WordCloudPlaceholder: React.FC<{ data: { text: string; value: number }[] }> = ({ data }) => {
    if (!data.length) return <p className="text-center text-gray-500">Not enough data for a word cloud.</p>;
    
    const maxVal = Math.max(...data.map(d => d.value));

    return (
        <div className="flex flex-wrap justify-center items-center gap-2 p-4 min-h-[150px]">
            {data.map(({ text, value }) => (
                <span
                    key={text}
                    style={{
                        fontSize: `${0.75 + (value / maxVal) * 1.5}rem`,
                        opacity: 0.6 + (value / maxVal) * 0.4,
                    }}
                    className="font-semibold text-brand-secondary"
                >
                    {text}
                </span>
            ))}
        </div>
    );
};


const AICoach: React.FC<{ journalEntries: JournalEntry[]; goals: Goal[] }> = ({ journalEntries, goals }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<GoalCategory>(GoalCategory.Health);

    const handleGetSuggestions = async () => {
        setIsLoading(true);
        setResult('');
        try {
            const suggestions = await getGoalSuggestions(selectedCategory);
            setResult("Here are a few ideas for you:\n\n- " + suggestions.join("\n- "));
        } catch (error) {
            setResult("Sorry, I couldn't fetch suggestions right now.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetSummary = async () => {
        setIsLoading(true);
        setResult('');
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentEntries = journalEntries.filter(e => new Date(e.date) > oneWeekAgo);

        try {
            const summary = await summarizeWeeklyProgress(recentEntries);
            setResult(summary);
        } catch (error) {
            setResult("Sorry, I couldn't generate a summary right now.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetReflection = async () => {
        setIsLoading(true);
        setResult('');
        try {
            const reflection = await getReflectionInsights(goals);
            setResult(reflection);
        } catch (error) {
            setResult("Sorry, I couldn't generate reflections right now.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-full">
                   <BrainCircuit className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Coach</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 <div className="flex items-center gap-2">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as GoalCategory)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 rounded-md"
                    >
                        {GOAL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button onClick={handleGetSuggestions} className="bg-brand-primary/10 text-brand-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary/20 transition-colors">Suggest</button>
                </div>
                 <button onClick={handleGetSummary} className="w-full bg-brand-secondary/10 text-brand-secondary font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary/20 transition-colors">Summarize My Week</button>
            </div>
             <button onClick={handleGetReflection} className="w-full flex items-center justify-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500/20 transition-colors">
                <HelpCircle size={16}/>
                Reflect on Challenges
            </button>
            {(isLoading || result) && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-lg min-h-[100px]">
                    {isLoading ? <p className="animate-pulse">Thinking...</p> : <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result}</p>}
                </div>
            )}
        </div>
    );
};


const Insights: React.FC<{ goals: Goal[]; journalEntries: JournalEntry[]; setView: (view: View) => void; }> = ({ goals, journalEntries, setView }) => {
    const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
    const [isCloudLoading, setIsCloudLoading] = useState(false);

    const stats = useMemo(() => {
        let longestStreak = 0;
        let mostConsistentGoal = null;
        let maxConsistency = 0;
        
        goals.forEach(goal => {
            const sortedProgress = [...goal.progress].sort();
            if (sortedProgress.length > 0) {
                let currentStreak = 1;
                let maxStreakForGoal = 1;
                for (let i = 1; i < sortedProgress.length; i++) {
                    const currentDate = new Date(sortedProgress[i]);
                    const prevDate = new Date(sortedProgress[i-1]);
                    const expectedPrevDate = new Date(currentDate);
                    expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
                    if (prevDate.getTime() === expectedPrevDate.getTime()) {
                        currentStreak++;
                    } else {
                        currentStreak = 1;
                    }
                    maxStreakForGoal = Math.max(maxStreakForGoal, currentStreak);
                }
                longestStreak = Math.max(longestStreak, maxStreakForGoal);
            }
            
            const startDate = new Date(goal.createdAt);
            const daysActive = (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24);
            if (daysActive > 0) {
                const consistency = (goal.progress.length / daysActive) * 100;
                if(consistency > maxConsistency) {
                    maxConsistency = consistency;
                    mostConsistentGoal = goal.title;
                }
            }
        });

        return {
            totalGoals: goals.length,
            completedGoals: goals.filter(g => g.completed).length,
            longestStreak,
            mostConsistentGoal: mostConsistentGoal ?? 'N/A'
        };
    }, [goals]);

    const fetchWordCloudData = useCallback(async () => {
        setIsCloudLoading(true);
        const data = await generateWordCloudData(journalEntries);
        setWordCloudData(data);
        setIsCloudLoading(false);
    }, [journalEntries]);

    return (
        <div className="space-y-6 animate-fadeIn">
            <AICoach journalEntries={journalEntries} goals={goals}/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"><p className="text-2xl font-bold text-brand-primary">{stats.completedGoals}/{stats.totalGoals}</p><p className="text-sm text-gray-500">Goals Completed</p></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"><p className="text-2xl font-bold text-brand-primary">{stats.longestStreak}</p><p className="text-sm text-gray-500">Longest Streak</p></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"><p className="text-sm font-semibold text-brand-primary truncate" title={stats.mostConsistentGoal}>{stats.mostConsistentGoal}</p><p className="text-sm text-gray-500">Most Consistent</p></div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Journal Word Cloud</h3>
                    <button onClick={fetchWordCloudData} disabled={isCloudLoading} className="text-sm text-brand-primary font-semibold disabled:opacity-50 flex items-center gap-1">
                        <Sparkles size={16}/> {wordCloudData.length > 0 ? "Refresh" : "Generate"}
                    </button>
                </div>
                {isCloudLoading ? <p className="text-center animate-pulse">Analyzing entries...</p> : <WordCloudPlaceholder data={wordCloudData} />}
                 <div className="mt-4 p-3 bg-rose-100/50 dark:bg-rose-500/10 rounded-lg text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <div>
                        <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">Upgrade to Pro!</p>
                        <p className="text-xs text-rose-500 dark:text-rose-400">Unlock advanced analytics and visualizations.</p>
                    </div>
                    <button onClick={() => setView('pricing')} className="bg-rose-500 text-white font-bold text-sm px-4 py-2 rounded-full shadow-md hover:bg-rose-600 transition-colors mt-2 sm:mt-0">
                        View Plans
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Insights;
