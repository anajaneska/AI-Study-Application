import { useEffect, useState } from "react";
import { addTaskForUser, getUserTasks } from '../services/userService';
import './styling/ToDoList.css';
import { FaTrash, FaCheck } from 'react-icons/fa';
import { toggleTaskStatus, deleteTask } from "../services/taskService";

export default function ToDoList() {
    const [taskList, setTaskList] = useState([]);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await getUserTasks();
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

    const handleDeleteTask = async (taskId) => {
        setIsLoading(true);
        try {
            await deleteTask(1, taskId)
            await fetchTasks();
        } catch (error) {
            console.error("Error toggling task status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsDone = async (taskId) => {
        setIsLoading(true);
        try {
            await toggleTaskStatus(taskId);
            await fetchTasks();
        } catch (error) {
            console.error("Error toggling task status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const transformTasks = (tasks) => {
        if (!Array.isArray(tasks) || tasks.length === 0) return null;

        return tasks.map((task) => {
            return (
                <div key={task.id} className="task-item">
                    <div className="task-text">
                        <span className={`task-title ${task.done ? 'done' : ''}`}>{task?.title}</span>
                        <span className={`task-description ${task.done ? 'done' : ''}`}>{task?.description}</span>
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
            );
        });
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