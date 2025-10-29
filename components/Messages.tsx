import React from 'react';
import { Conversation, Message } from '../types';
import { Lock } from 'lucide-react';

interface MessagesProps {
    conversations: Conversation[];
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isYou = message.sender === 'You';
    return (
        <div className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                isYou 
                    ? 'bg-brand-primary text-white rounded-br-lg' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'
            }`}>
                <p className="text-sm">{message.text}</p>
                 <p className={`text-xs mt-1 ${isYou ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

const Messages: React.FC<MessagesProps> = ({ conversations }) => {
    // For this simulation, we'll just display the first conversation.
    const activeConversation = conversations[0];

    if (!activeConversation) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-fadeIn">
                <h2 className="text-2xl font-bold">No Messages Yet</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Your message inbox is empty.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col h-[calc(100vh-150px)] max-h-[700px] animate-fadeIn">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-center">{activeConversation.participantName}</h2>
            </header>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {activeConversation.messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
            </div>
            
            <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-center bg-amber-100/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 rounded-lg">
                    <Lock size={16} />
                    <p className="text-xs font-semibold">
                        Direct messaging is a premium feature available on the Enterprise plan.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Messages;
