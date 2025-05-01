import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Users from "./pages/Users";
import FileUpload from "./components/FileUpload";
import SignUp from "./pages/SignUp";
import Flashcards from "./pages/Flashcards";
import Pomodoro from "./pages/PomodoroTimer";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/users" className="nav-link">
          Users
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
        <Link to="/Pomodoro" className="nav-link">
          Pomodoro Timer
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/summarizer" element={<FileUpload />} />
        <Route path="/flashcards" element={<Flashcards />}/>
        <Route path="/pomodoro" element={<Pomodoro />}/>
      </Routes>
    </Router>
  );
}

export default App;
