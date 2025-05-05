import PomodoroTimer from './PomodoroTimer';
import Calendar from './Calendar'
import "./styling/Home.css"

function Home() {
    return (
        <div className="main-content">
            <div>
                To Do list placeholder
            </div>
            <Calendar></Calendar>
            <PomodoroTimer></PomodoroTimer>
        </div>
    )
}

export default Home