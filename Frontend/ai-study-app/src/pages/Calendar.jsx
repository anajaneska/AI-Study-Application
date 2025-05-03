import React, { useState, useEffect } from 'react';
import { FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './styling/Calendar.css';

const Calendar = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(
        parseInt(localStorage.getItem('currentMonth'), 10) || today.getMonth()
    );
    const [currentYear, setCurrentYear] = useState(
        parseInt(localStorage.getItem('currentYear'), 10) || today.getFullYear()
    );
    const [selectedDate, setSelectedDate] = useState(
        localStorage.getItem('selectedDate') || today.toISOString().split('T')[0]
    );
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        localStorage.setItem('currentMonth', currentMonth);
        localStorage.setItem('currentYear', currentYear);
        localStorage.setItem('selectedDate', selectedDate);
    }, [currentMonth, currentYear, selectedDate]);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDayClick = (day) => {
        const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
        setSelectedDate(dateStr);
    };

    const renderCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);

        const calendarDays = [];

        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected =
                selectedDate === new Date(currentYear, currentMonth, day).toISOString().split('T')[0];

            calendarDays.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDayClick(day)}
                >
                    {day}
                </div>
            );
        }

        return calendarDays;
    };

    const toggleSettings = () => setShowSettings(!showSettings);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}><FiChevronLeft /></button>
                <h2>{monthNames[currentMonth]} {currentYear}</h2>
                <button onClick={handleNextMonth}><FiChevronRight /></button>
                <button onClick={toggleSettings}><FiSettings /></button>
            </div>

            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="calendar-day-name">{d}</div>
                ))}
                {renderCalendarDays()}
            </div>

            {showSettings && (
                <div className="settings-panel open">
                    <h3>Calendar Settings</h3>
                    <p>Selected Date: {selectedDate}</p>
                    <button onClick={() => setShowSettings(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Calendar;
