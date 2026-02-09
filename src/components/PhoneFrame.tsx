import type { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4">
      {/* Phone Container */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="relative w-[375px] h-[812px] bg-gray-900 rounded-[50px] shadow-2xl border-[14px] border-gray-800 overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-gray-800 rounded-b-3xl z-20 flex items-center justify-center gap-2">
            <div className="w-16 h-1.5 bg-gray-700 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
          </div>
          
          {/* Screen Content */}
          <div className="absolute inset-0 bg-white overflow-auto">
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full z-20"></div>
        </div>

        {/* Phone Side Buttons */}
        <div className="absolute -right-[2px] top-24 w-1 h-8 bg-gray-800 rounded-l"></div>
        <div className="absolute -right-[2px] top-36 w-1 h-14 bg-gray-800 rounded-l"></div>
        <div className="absolute -right-[2px] top-52 w-1 h-14 bg-gray-800 rounded-l"></div>
        <div className="absolute -left-[2px] top-32 w-1 h-12 bg-gray-800 rounded-r"></div>
      </div>
    </div>
  )
}
