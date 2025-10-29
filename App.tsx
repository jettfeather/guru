import React, { useState, useEffect, useCallback } from 'react';
import { Goal, JournalEntry, View, GoalCategory, Theme, DailyCheckIn, JournalType, Conversation } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DUMMY_GOALS, DUMMY_JOURNAL_ENTRIES, DUMMY_CONVERSATIONS } from './constants';
import { getMotivationalQuote } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import Insights from './components/Insights';
import AddGoalModal from './components/AddGoalModal';
import AddJournalEntryModal from './components/AddJournalEntryModal';
import Confetti from './components/Confetti';
import Pricing from './components/Pricing';
import Messages from './components/Messages';
import CreateAccount from './components/CreateAccount';
import { PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('journalEntries', []);
  const [checkIns, setCheckIns] = useLocalStorage<DailyCheckIn[]>('checkIns', []);
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', []);
  const [view, setView] = useState<View>('dashboard');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState<string>('');
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAccount, setHasAccount] = useLocalStorage<boolean>('hasAccount', false);
  const [userName, setUserName] = useLocalStorage<string>('userName', '');
  const [userEmail, setUserEmail] = useLocalStorage<string>('userEmail', '');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const fetchQuote = useCallback(async () => {
    setIsLoadingQuote(true);
    try {
        const quote = await getMotivationalQuote();
        setMotivationalQuote(quote);
    } catch (error) {
        console.error("Failed to fetch motivational quote:", error);
        setMotivationalQuote("The best way to predict the future is to create it.");
    } finally {
        setIsLoadingQuote(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const handleCreateAccount = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    // Populate with dummy data upon account creation
    setGoals(DUMMY_GOALS);
    setJournalEntries(DUMMY_JOURNAL_ENTRIES);
    setConversations(DUMMY_CONVERSATIONS);
    setHasAccount(true);
  };
  
  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000); // Confetti lasts for 4 seconds
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const addGoal = (title: string, description: string, category: GoalCategory, deadline: string) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      category,
      deadline,
      createdAt: new Date().toISOString(),
      completed: false,
      progress: [],
    };
    setGoals(prev => [...prev, newGoal]);
    setIsGoalModalOpen(false);
  };
  
  const toggleGoalProgress = (goalId: string, date: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal && !goal.progress.includes(date) && !goal.completed) {
      triggerConfetti();
    }
    
    setGoals(prevGoals =>
      prevGoals.map(g => {
        if (g.id === goalId) {
          const progressSet = new Set(g.progress);
          if (progressSet.has(date)) {
            progressSet.delete(date);
          } else {
            progressSet.add(date);
          }
          return { ...g, progress: Array.from(progressSet) };
        }
        return g;
      })
    );
  };

  const markGoalAsComplete = (goalId: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => (goal.id === goalId ? { ...goal, completed: true } : goal))
    );
  };
  
  const deleteGoal = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  };
  
  const addJournalEntry = (content: string, goalId: string | null, type: JournalType) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content,
      goalId,
      date: new Date().toISOString(),
      type,
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };
  
  const addCheckIn = (ratings: Omit<DailyCheckIn, 'id' | 'date'>) => {
    const newCheckIn: DailyCheckIn = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        ...ratings
    };
    setCheckIns(prev => [...prev, newCheckIn]);
  };

  const openFabModal = () => {
    if (view === 'journal') {
      setIsJournalModalOpen(true);
    } else {
      setIsGoalModalOpen(true);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard userName={userName} goals={goals} toggleGoalProgress={toggleGoalProgress} markGoalAsComplete={markGoalAsComplete} deleteGoal={deleteGoal} motivationalQuote={motivationalQuote} isLoadingQuote={isLoadingQuote} checkIns={checkIns} addCheckIn={addCheckIn} />;
      case 'journal':
        return <Journal entries={journalEntries} goals={goals} />;
      case 'insights':
        return <Insights goals={goals} journalEntries={journalEntries} setView={setView} />;
      case 'messages':
        return <Messages conversations={conversations} />;
      case 'pricing':
          return <Pricing setView={setView} />;
      default:
        return <Dashboard userName={userName} goals={goals} toggleGoalProgress={toggleGoalProgress} markGoalAsComplete={markGoalAsComplete} deleteGoal={deleteGoal} motivationalQuote={motivationalQuote} isLoadingQuote={isLoadingQuote} checkIns={checkIns} addCheckIn={addCheckIn} />;
    }
  };

  if (!hasAccount) {
    return <CreateAccount onAccountCreate={handleCreateAccount} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      {showConfetti && <Confetti />}
      <Header currentView={view} setView={setView} toggleTheme={toggleTheme} theme={theme} />
      <main className="p-4 pb-24 max-w-4xl mx-auto">
        {renderView()}
      </main>
      <button
        onClick={openFabModal}
        className="fixed bottom-20 sm:bottom-6 right-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-50"
        aria-label={view === 'journal' ? "Add new journal entry" : "Add new goal"}
      >
        <PlusCircle size={28} />
      </button>
      <AddGoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onAddGoal={addGoal} />
      <AddJournalEntryModal 
        isOpen={isJournalModalOpen} 
        onClose={() => setIsJournalModalOpen(false)} 
        onAddEntry={addJournalEntry} 
        goals={goals.filter(g => !g.completed)} 
      />
    </div>
  );
};

export default App;