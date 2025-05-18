import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { FiSettings } from 'react-icons/fi';
import 'react-circular-progressbar/dist/styles.css';
import './styling/PomodoroTimer.css';
import { saveSession } from '../services/pomodoroTimerService';
import { getUserSessions } from '../services/pomodoroTimerService';


const PomodoroTimer = () => {
    const [focusDuration, setFocusDuration] = useState(parseInt(localStorage.getItem('focusDuration'), 10) || 25);
    const [breakDuration, setBreakDuration] = useState(parseInt(localStorage.getItem('breakDuration'), 10) || 5);
    const [timeLeft, setTimeLeft] = useState(parseInt(localStorage.getItem('timeLeft'), 10) || focusDuration * 60);
    const [isActive, setIsActive] = useState(JSON.parse(localStorage.getItem('isActive')) || false);
    const [isBreak, setIsBreak] = useState(JSON.parse(localStorage.getItem('isBreak')) || false);
    const [showSettings, setShowSettings] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [sessions, setSessions] = useState([]);

    const userId = 1;

    useEffect(() => {
        localStorage.setItem('focusDuration', focusDuration);
        localStorage.setItem('breakDuration', breakDuration);
        localStorage.setItem('timeLeft', timeLeft);
        localStorage.setItem('isActive', JSON.stringify(isActive));
        localStorage.setItem('isBreak', JSON.stringify(isBreak));
    }, [focusDuration, breakDuration, timeLeft, isActive, isBreak]);

    useEffect(() => {
        let timer = null;
        if (isActive) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === 0) {
                        if (!isBreak) {
                            savePomodoroSession(focusDuration);
                            setIsBreak(true);
                            sendNotification('Focus session ended. Time to take a break!');
                            return breakDuration * 60;
                        } else {
                            setIsBreak(false);
                            sendNotification('Break session ended. Time to focus!');
                            return focusDuration * 60;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive, isBreak, focusDuration, breakDuration]);

    const savePomodoroSession = async (durationMinutes) => {
        const sessionData = {
            duration: durationMinutes,
            startTime: sessionStartTime || new Date().toISOString()
        };
        try {
            await saveSession(sessionData);
            console.log("Session saved.");
        } catch (err) {
            console.error("Error saving session:", err);
        }
    };

    const fetchSessions = async () => {
        if (!userId) return;
        try {
            const res = await getUserSessions();
            setSessions(res.data);
        } catch (err) {
            console.error("Error fetching sessions:", err);
        }
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
        if (!showSettings) fetchSessions();
    };

    const handleSettingsSubmit = (e) => {
        e.preventDefault();
        const focus = parseInt(e.target.focus.value, 10);
        const breakT = parseInt(e.target.break.value, 10);
        setFocusDuration(focus);
        setBreakDuration(breakT);
        setTimeLeft(focus * 60);
        setIsBreak(false);
        setShowSettings(false);
    };

    const startStopTimer = () => {
        if (!isActive) {
            setSessionStartTime(new Date().toISOString());
        }
        setIsActive(!isActive);
    };

    const sendNotification = (message) => {
        if (Notification.permission === 'granted') {
            new Notification(message);
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <>
            <div className="timer-container">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>{isBreak ? 'Break Time' : 'Focus Time'}</h2>
                    <button
                        onClick={toggleSettings}
                        style={{
                            marginLeft: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '2rem',
                            color: '#333',
                            padding: '5px'
                        }}
                        aria-label="Settings"
                    >
                        <FiSettings />
                    </button>
                </div>

                <div style={{ width: 200, height: 200, margin: '20px auto' }}>
                    <CircularProgressbar
                        value={(timeLeft / ((isBreak ? breakDuration : focusDuration) * 60)) * 100}
                        text={`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                    />
                </div>

                <div className="buttons" style={{ textAlign: 'center' }}>
                    <button onClick={startStopTimer} style={{ padding: '10px 20px', fontSize: '1rem' }}>
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                </div>
            </div>

            <div className={`settings-panel ${showSettings ? 'open' : ''}`}>
                <h3>Settings for {userId}</h3>
                <form onSubmit={handleSettingsSubmit}>
                    <div>
                        <label>Focus Time (minutes):</label>
                        <input type="number" name="focus" min="1" defaultValue={focusDuration} />
                    </div>
                    <div>
                        <label>Break Time (minutes):</label>
                        <input type="number" name="break" min="1" defaultValue={breakDuration} />
                    </div>
                    <button type="submit">Save Settings</button>
                </form>

                <h4>Your Pomodoro Sessions</h4>
                <ul>
                    {Array.isArray(sessions) && sessions.map((s, i) => (
                        <li key={i}>
                            {new Date(s.startTime).toLocaleString()} - {s.duration} min
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default PomodoroTimer;
