import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Features from './pages/Features';
import LogIn from './pages/LogIn';

function App() {

  return (
    <>
      <Router>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/" className="text-blue-500">Home</Link>
        <Link to="/Features" className="text-blue-500">Features</Link>
        <Link to="/LogIn" className="text-blue-500">Log In</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Features" element={<Features />} />
        <Route path="/LogIn" element={<LogIn />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
