import PomodoroTimer from './PomodoroTimer';
import Calendar from './Calendar'
import "./styling/Home.css"
import ToDoList from './ToDoList';

function Home() {
    return (
        <div className="main-content">
            <ToDoList />
            <Calendar></Calendar>
            <PomodoroTimer></PomodoroTimer>
        </div>
    )
}

export default Home