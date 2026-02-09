import { BrowserRouter, Routes, Route } from "react-router-dom";
import YesOrNo from "./pages/yesorno";
import StoryPage from "./pages/storyPage";
import PhoneCall from "./pages/phoneCall";


function App() {
	return (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<PhoneCall />} />
			<Route path="/story" element={<StoryPage />} />
			<Route path="/yesorno" element={<YesOrNo />} />
		</Routes>
	</BrowserRouter>
	)
}

export default App
