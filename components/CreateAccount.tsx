import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface CreateAccountProps {
    onAccountCreate: (name: string, email: string) => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({ onAccountCreate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && email.trim()) {
            onAccountCreate(name.trim(), email.trim());
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 animate-fadeIn">
            <div className="w-full max-w-md text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <svg 
                        width="40" 
                        height="40" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="w-10 h-10 text-brand-primary"
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
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                        GURU
                    </h1>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Begin Your Journey of Growth
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Set goals, reflect on your progress, and become the best version of yourself.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="name" className="sr-only">Your Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                            placeholder="What should we call you?"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                            placeholder="Enter your email address"
                        />
                    </div>

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-opacity disabled:opacity-50"
                        disabled={!name.trim() || !email.trim()}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <Sparkles className="h-5 w-5 text-brand-primary group-hover:text-brand-accent transition-colors" aria-hidden="true" />
                        </span>
                        Get Started
                    </button>
                </form>
                 <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                    In a real application, your data would be securely stored on a server. For this demo, your information is only saved in your browser.
                </p>
            </div>
        </div>
    );
};

export default CreateAccount;
