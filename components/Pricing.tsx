import React from 'react';
import { View } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface PricingProps {
    setView: (view: View) => void;
}

const PricingCard: React.FC<{
    plan: string;
    price: string;
    features: string[];
    isFeatured?: boolean;
    buttonText: string;
    buttonAction: () => void;
}> = ({ plan, price, features, isFeatured = false, buttonText, buttonAction }) => {
    return (
        <div className={`border rounded-xl p-6 flex flex-col ${isFeatured ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
            <h3 className="text-xl font-bold">{plan}</h3>
            <p className={`text-4xl font-bold my-4 ${isFeatured ? '' : 'text-brand-primary'}`}>{price}</p>
            <ul className="space-y-3 mb-6">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className={isFeatured ? 'text-white' : 'text-emerald-500'} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={buttonAction}
                className={`mt-auto w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                    isFeatured 
                        ? 'bg-white text-brand-primary hover:bg-gray-200' 
                        : 'bg-brand-primary text-white hover:bg-brand-primary/90'
                }`}
            >
                {buttonText}
            </button>
        </div>
    );
};


const Pricing: React.FC<PricingProps> = ({ setView }) => {
    const handleContact = () => {
        alert("Thank you for your interest! Please contact sales@guruapp.com for more information.");
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Find the perfect plan</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Start for free, or unlock your full potential with our Pro and Enterprise plans.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PricingCard
                    plan="Free"
                    price="$0"
                    features={['Up to 3 Goals', 'Daily Journaling', 'Basic Insights']}
                    buttonText="Your Current Plan"
                    buttonAction={() => setView('dashboard')}
                />
                <PricingCard
                    plan="Pro"
                    price="$4.99"
                    features={['Unlimited Goals', 'AI Coach Insights', 'Advanced Analytics', 'Word Cloud Generation', 'Priority Support']}
                    isFeatured={true}
                    buttonText="Upgrade to Pro"
                    buttonAction={() => alert('Pro plan coming soon!')}
                />
                <PricingCard
                    plan="Enterprise"
                    price="Custom"
                    features={['For Therapists & Mentors', 'Team Dashboards', 'User Management', 'Direct Messaging', 'Custom Branding']}
                    buttonText="Contact Sales"
                    buttonAction={handleContact}
                />
            </div>
        </div>
    );
};

export default Pricing;
