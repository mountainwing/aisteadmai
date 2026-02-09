import { useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'

export default function YesOrNo() {
  const [noCount, setNoCount] = useState(0)
  const [yesPressed, setYesPressed] = useState(false)
  const yesButtonSize = noCount * 20 + 16

  const handleNoClick = () => {
    setNoCount(noCount + 1)
  }

  const getNoButtonText = () => {
    const phrases = [
      "no",
      "Are you sure?",
      "Really sure?",
      "Think again!",
      "Last chance!",
      "Surely not?",
      "You might regret this!",
      "Give it another thought!",
      "Are you absolutely certain?",
      "This could be a mistake!",
      "Have a heart!",
      "Don't be so cold!",
      "Change of heart?",
      "Wouldn't you reconsider?",
      "Is that your final answer?",
      "You're breaking my heart ;("
    ]
    return phrases[Math.min(noCount, phrases.length - 1)]
  }

  return (
    <PhoneFrame>
        <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-red-200 to-pink-300 p-4">
            {yesPressed ? (
                <div className="text-center space-y-4 animate-bounce px-4">
                <h1 className="text-4xl font-bold text-red-600">Yayyyy!!! 🎉</h1>
                <img 
                    src="https://media.giphy.com/media/T86i6yDyOYz7J6dPhf/giphy.gif" 
                    alt="celebration"
                    className="w-48 rounded-lg shadow-2xl mx-auto"
                />
                <p className="text-lg text-gray-700 font-semibold">
                    I'm so excited! Get ready for our first Valentine's Day! 💕
                </p>
                <p className="text-lg text-gray-700 font-semibold">
                    btw I have booked us a surprise date! Can't wait to see you!
                </p>
                </div>
            ) : (
                <div className="text-center space-y-4 px-4">
                <h1 className="text-3xl font-bold text-red-600 mb-2 drop-shadow-lg">
                    Will you be my Valentine? 💝
                </h1>
                <img 
                    src="https://media.giphy.com/media/Z9cRCMdAMzXi25dwhE/giphy.gif" 
                    alt="cute asking"
                    className="w-40 h-40 object-cover rounded-full shadow-2xl mx-auto border-4 border-white"
                />
                <div className="flex gap-3 items-center justify-center flex-wrap mt-4">
                    <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-110 active:scale-95"
                    style={{ fontSize: `${yesButtonSize}px` }}
                    onClick={() => setYesPressed(true)}
                    >
                    Yes
                    </button>
                    <button
                    onClick={handleNoClick}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-full shadow-lg transform transition hover:scale-90"
                    >
                    {getNoButtonText()}
                    </button>
                </div>
                {noCount > 0 && (
                    <p className="text-sm text-gray-700 italic animate-pulse mt-2">
                    The "Yes" button is getting bigger... hint hint 😏
                    </p>
                )}
                </div>
            )}
        </div>
    </PhoneFrame>
  )
}