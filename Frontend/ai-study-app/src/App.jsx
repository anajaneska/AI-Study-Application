import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Users from "./pages/Users";
import FileUpload from "./components/FileUpload";
import SignUp from "./pages/SignUp";
import Flashcards from "./pages/Flashcards";
import Pomodoro from "./pages/PomodoroTimer";
import Calendar from "./pages/Calendar.jsx";

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-link">
          AI Study Application
        </Link>
        <Link to="/logIn" className="nav-link">
          Log In
        </Link>
        <Link to="/SignUp" className="nav-link">
          Sign Up
        </Link>
        <Link to="/Summarizer" className="nav-link">
          Summarizer
        </Link>
        <Link to="/Flashcards" className="nav-link">
          Flashcards
        </Link>
        {user ? (<span className="user-info">Welcome, {user.name}!</span>) : (<span></span>)}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/summarizer" element={<FileUpload />} />
        <Route path="/flashcards" element={<Flashcards />}/>
        <Route path="/pomodoro" element={<Pomodoro />}/>
        <Route path="/calendar" element={<Calendar />}/>
      </Routes>
    </Router>
  );
}

export default App;
