import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Features from './pages/Features';
import LogIn from './pages/LogIn';
import Users from './pages/Users';

function App() {
    return (
        <Router>
            <nav className="navbar">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/Features" className="nav-link">Features</Link>
                <Link to="/Users" className="nav-link">Users</Link>
                <Link to="/LogIn" className="nav-link">Log In</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Features" element={<Features />} />
                <Route path="/Users" element={<Users />} />
                <Route path="/LogIn" element={<LogIn />} />
            </Routes>
        </Router>
    );
}

export default App;
