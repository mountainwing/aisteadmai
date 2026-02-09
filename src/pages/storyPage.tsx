import PhoneFrame from '../components/PhoneFrame'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StoryPage() {
	const [nextCount, setNextCount] = useState(0)
	const navigate = useNavigate()
	
	const storyLines = [
		"I heard you went to the temple to ask me to help you find your true love.",
		"Meet my client Chang Yu Qian, she is a beautiful radiology executive assistant.",
		"don't let her small size fool you, she has a big heart full of love to give.",
		"she prayed for a tall, kind, funny, handsome and loving man.",
		"As a 月老, it's my duty to bring destined couples together. Let's see what I can do! ❤️‍🔥",
		"Ahhhh, meet this special man I've found for you...",
		"Meet... WING",
		"Strength: He fulfills all your wishes! 🍌 Weakness: He sometimes play games LEISURELY.",
		"These are some pictures of you and WING together for this 6 months together 💖",
		"Sentosa Date 🏖️",
		"Bar Hopping Date🍻",
		"Genting Date 🎰",
		"Christmas Wonderland Date 🎄",
		"Dog Cafe Date 🐶",
		"oh wait what? Wing wants to talk to you...",
		"ehem...",
		"hi babygirl, hope mr 月老 not too 啰嗦 just now hehehe",
		"I know I may not be the perfect guy, but I promise to always try my best to make you happy.",
		"These 6 months with you have been the happiest of my life, and I can't wait to create more memories together.",
		"Although I can be a boy sometimes, I want you to know that my love for you is serious and true.",
		"now... 事不宜迟, can I ask..."
	]

	const storyImages = [
		"/yuelao.jpg", // No image for first slide
		"/pretty.jpg", // Add image URL here if you want
		"/smallsize.jpg", // Add image URL here if you want
		"/yuelao.jpg",  // Add image URL here if you want
		"/yuelao.jpg",
		"/wingholdbanana.jpg",
		"/yuelao.jpg",
		"/wingredsinglet.jpg",
		"/yuelao.jpg",
		"/sentosadate.jpg",
		"/bardate.jpg",
		"/gentingdate.jpg",
		"/xmaswonderland.jpg",
		"/dogcafedate.jpg",
		"/yuelao.jpg",
		"/ehem.jpg",
		"/heart.jpg",
		"/3.jpg",
		"/4.jpg",
		"/5.jpg",
		"/6.jpg",
	]

	const handlesNextClick = () => {
		if (nextCount === storyLines.length - 1) {
			navigate('/yesorno')
		} else {
			setNextCount(nextCount + 1)
		}
	}

	const currentText = storyLines[Math.min(nextCount, storyLines.length - 1)]
	const currentImage = storyImages[Math.min(nextCount, storyImages.length - 1)]

	return (
		<PhoneFrame>
			<div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-red-200 to-pink-300 p-4 relative">
				{/* Image Placeholder */}
				{currentImage && (
					<img 
						src={currentImage} 
						alt="story" 
						className="w-48 h-48 object-cover rounded-lg shadow-lg mb-6"
					/>
				)}
				
				<h2 className="text-3xl font-bold text-red-600 text-center px-4 whitespace-pre-line">{currentText}</h2>
				
				<button 
					onClick={handlesNextClick}
					className="absolute bottom-25 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105"
				>
					Next
				</button>
			</div>
		</PhoneFrame>
	)
}

export default StoryPage;