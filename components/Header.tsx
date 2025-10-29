import React from 'react';
import { LayoutDashboard, BookOpen, BarChart2, Sun, Moon, MessageSquare, CreditCard } from 'lucide-react';
import { View, Theme } from '../types';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
    toggleTheme: () => void;
    theme: Theme;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, toggleTheme, theme }) => {
    const navItems: { view: View; icon: React.ReactNode; label: string }[] = [
        { view: 'dashboard', icon: <LayoutDashboard size={24} />, label: 'Dashboard' },
        { view: 'journal', icon: <BookOpen size={24} />, label: 'Journal' },
        { view: 'insights', icon: <BarChart2 size={24} />, label: 'Insights' },
        { view: 'messages', icon: <MessageSquare size={24} />, label: 'Messages' },
        { view: 'pricing', icon: <CreditCard size={24} />, label: 'Pricing' },
    ];

    return (
        <>
            {/* Desktop Header */}
            <header className="hidden sm:block sticky top-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-sm z-40">
                <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-1 sm:gap-2">
                         <svg 
                            width="32" 
                            height="32" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-8 h-8 text-brand-primary"
                         >
                            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" 
                                stroke="currentColor" 
                                strokeWidth="1.5" 
                                strokeLinejoin="round" 
                                strokeLinecap="round" 
                                fill="currentColor"
                                fillOpacity="0.2"
                                transform="rotate(-90 12 12) translate(0, -1)"
                            />
                        </svg>
                        <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                            GURU
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-gray-700 p-1 rounded-full">
                        {navItems.map(({ view, icon, label }) => (
                            <button
                                key={view}
                                onClick={() => setView(view)}
                                className={`px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors ${
                                    currentView === view
                                        ? 'bg-white dark:bg-gray-900 text-brand-primary shadow'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-white'
                                }`}
                            >
                                {icon}
                                <span className="hidden lg:inline">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </header>
            
            {/* Mobile Navigation */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-slate-200 dark:border-gray-700 grid grid-cols-5 gap-1 p-1 z-50">
                {navItems.map(({ view, icon, label }) => (
                     <button
                        key={view}
                        onClick={() => setView(view)}
                        className={`flex flex-col items-center w-full py-1 rounded-md text-xs font-medium transition-colors ${
                            currentView === view
                                ? 'text-brand-primary bg-brand-primary/10'
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        {icon}
                        <span>{label}</span>
                    </button>
                ))}
            </nav>
        </>
    );
};

export default Header;