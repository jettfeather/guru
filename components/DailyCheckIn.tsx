import React, { useState } from 'react';
import { DailyCheckIn } from '../types';
import { HeartPulse, Brain, Sparkles } from 'lucide-react';

interface DailyCheckInCardProps {
    onCheckIn: (ratings: Omit<DailyCheckIn, 'id' | 'date'>) => void;
}

const StarRating: React.FC<{
    rating: number;
    setRating: (rating: number) => void;
}> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const StarIcon: React.FC<{ fill: 'full' | 'half' | 'empty' }> = ({ fill }) => {
        const fullStarPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.959c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.175 0l-3.368 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.959a1 1 0 00-.364-1.118L2.07 9.386c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z";
        
        if (fill === 'full') {
            return <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d={fullStarPath} /></svg>;
        }
        if (fill === 'half') {
            return (
                <div className="relative w-6 h-6">
                    <svg className="w-6 h-6 text-gray-300 dark:text-gray-500 absolute inset-0" fill="currentColor" viewBox="0 0 20 20"><path d={fullStarPath} /></svg>
                    <svg className="w-6 h-6 text-amber-400 absolute inset-0" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }} fill="currentColor" viewBox="0 0 20 20"><path d={fullStarPath} /></svg>
                </div>
            );
        }
        return <svg className="w-6 h-6 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d={fullStarPath} /></svg>;
    };

    return (
        <div className="flex" onMouseLeave={() => setHoverRating(0)}>
            {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                const displayRating = hoverRating > 0 ? hoverRating : rating;

                let fillType: 'full' | 'half' | 'empty' = 'empty';
                if (displayRating >= starValue) {
                    fillType = 'full';
                } else if (displayRating >= starValue - 0.5) {
                    fillType = 'half';
                }

                return (
                    <button
                        key={i}
                        type="button"
                        className="p-1 cursor-pointer"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const isHalf = (e.clientX - rect.left) / rect.width < 0.5;
                            setHoverRating(i + (isHalf ? 0.5 : 1));
                        }}
                        onClick={() => setRating(hoverRating)}
                        aria-label={`Rate ${starValue}`}
                    >
                        <StarIcon fill={fillType} />
                    </button>
                );
            })}
        </div>
    );
};


const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({ onCheckIn }) => {
    const [physical, setPhysical] = useState(2.5);
    const [mental, setMental] = useState(2.5);
    const [spiritual, setSpiritual] = useState(2.5);

    const handleSubmit = () => {
        onCheckIn({ physical, mental, spiritual });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-fadeIn space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">How are you feeling today?</h2>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <HeartPulse className="text-rose-500" size={20} />
                        <label className="font-semibold text-gray-700 dark:text-gray-300">Physical</label>
                    </div>
                    <StarRating rating={physical} setRating={setPhysical} />
                </div>
                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Brain className="text-sky-500" size={20}/>
                        <label className="font-semibold text-gray-700 dark:text-gray-300">Mental</label>
                    </div>
                    <StarRating rating={mental} setRating={setMental} />
                </div>
                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Sparkles className="text-violet-500" size={20}/>
                        <label className="font-semibold text-gray-700 dark:text-gray-300">Spiritual</label>
                    </div>
                    <StarRating rating={spiritual} setRating={setSpiritual} />
                </div>
            </div>

             <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity"
            >
                Save Check-in
            </button>
        </div>
    );
};

export default DailyCheckInCard;
