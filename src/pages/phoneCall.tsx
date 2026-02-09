import PhoneFrame from '../components/PhoneFrame'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function PhoneCall() {
    const navigate = useNavigate()
    const [isAnswered, setIsAnswered] = useState(false)

    const handleAnswer = () => {
        setIsAnswered(true)
        // Navigate to story page after 2 seconds
        setTimeout(() => {
            navigate('/story')
        }, 2000)
    }

    return (
        <PhoneFrame>
            {!isAnswered ? (
                <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-red-200 to-pink-300 p-4">
                {/* Top section - Caller info */}
                <div className="flex flex-col items-center space-y-6 mt-8">
                    <p className="text-gray-400 text-sm tracking-wide animate-pulse">incoming call</p>
                    
                    {/* Caller ID Image with pulsing rings */}
                    <div className="relative">
                        {/* Pulsing rings animation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-40 h-40 rounded-full bg-pink-500 opacity-20 animate-ping"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-pink-400 opacity-30 animate-ping animation-delay-150"></div>
                        </div>
                        
                        {/* Caller ID Image - placeholder */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500 shadow-2xl bg-gray-700 flex items-center justify-center animate-bounce-slow">
                            {/* Replace the src below with your actual image path from assets */}
                            <img 
                                src="/yuelao.jpg" 
                                alt="月老"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to emoji if image not found
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = '<span class="text-6xl">💘</span>';
                                }}
                            />
                        </div>
                    </div>

                    {/* Caller Name */}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-2">月老</h1>
                        <p className="text-gray-400 text-lg">Mobile</p>
                    </div>
                </div>

                {/* Bottom section - Call actions */}
                <div className="flex items-center justify-around w-full max-w-xs mb-8">
                    {/* Answer Button */}
                    <button 
                        onClick={handleAnswer}
                        className="flex flex-col items-center space-y-2 group animate-pulse bg-transparent border-none mt-15"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg transform transition hover:scale-110 active:scale-95">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </div>
                        <span className="text-white text-sm">Answer</span>
                    </button>
                </div>
            </div>
            ) : (
                <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-red-200 to-pink-300 p-4 animate-fade-in">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Caller ID Image - larger when connected */}
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-green-500 shadow-2xl bg-gray-700 flex items-center justify-center animate-scale-up">
                            <img 
                                src="/yuelao.jpg" 
                                alt="月老"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = '<span class="text-6xl">💘</span>';
                                }}
                            />
                        </div>

                        {/* Connected status */}
                        <div className="text-center animate-fade-in-delay">
                            <h1 className="text-4xl font-bold text-white mb-2">月老</h1>
                            <div className="flex items-center justify-center gap-2 text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-lg font-semibold">Connected</p>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">00:00</p>
                        </div>
                    </div>
                </div>
            )}
        </PhoneFrame>
    );
}
export default PhoneCall;