import PomodoroTimer from './PomodoroTimer';
import Calendar from './Calendar'
import "./styling/Home.css"
import ToDoList from './ToDoList';

function Home() {
    return (
        <div className="main-content">
            <div className="top-section">
                <Calendar />
                <PomodoroTimer />
            </div>
            <div className="todo-section">
                <ToDoList />
            </div>
        </div>
    );
}

export default Home