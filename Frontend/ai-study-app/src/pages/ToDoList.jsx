import { useEffect, useState } from "react";
import { addTaskForUser, getUserTasks } from '../services/userService';
import './styling/ToDoList.css';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

export default function ToDoList() {
    const [taskList, setTaskList] = useState([]);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await getUserTasks(1);
            setTaskList(response?.data || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (newTaskName.trim() === "" || newTaskDescription.trim() === "") return;

        const newTaskObj = {
            title: newTaskName,
            description: newTaskDescription,
            isDone: false,
        };

        try {
            await addTaskForUser(1, newTaskObj);
            setNewTaskName("");
            setNewTaskDescription("");
            await fetchTasks();
        }
        catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleDeleteTask = (taskId) => {
        console.log(`Delete task with ID: ${taskId}`);
        // delete logic
    };

    const handleMarkAsDone = (taskId) => {
        console.log(`Mark task as done with ID: ${taskId}`);
        // mark as done logic
    };

    const transformTasks = (tasks) => {
        return tasks.map((task) => (
            <div key={task.id} className="task-item">
                <div className="task-text">
                    <span className={`task-title ${task.isDone ? 'done' : ''}`}>{task?.title}</span>
                    <span className={`task-description ${task.isDone ? 'done' : ''}`}>{task?.description}</span>
                </div>
                <div className="task-actions">
                    <button className="task-action-button" onClick={() => handleMarkAsDone(task.id)}>
                        <FaCheck />
                    </button>
                    <button className="task-action-button" onClick={() => handleDeleteTask(task.id)}>
                        <FaTrash />
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div className="todo-container">
            <h1 className="todo-header">To Do List</h1>
            <form onSubmit={handleAddTask} className="task-form">
                <input
                    type="text"
                    placeholder="Enter task name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="task-input"
                />
                <input
                    type="text"
                    placeholder="Enter task description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="task-input"
                />
                <button type="submit" className="task-button">Add Task</button>
            </form>
            <div className="todo-list">
                {isLoading ? (
                    <p className="loading-message">Loading tasks...</p>
                ) : (
                    taskList.length > 0 ? transformTasks(taskList) : <p className="no-tasks">No tasks available</p>
                )}
            </div>
        </div>
    );
}