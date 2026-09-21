import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TaskFormModal from "../modal/TaskFormModal";

const statusStyles = {
    Pending: "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-50 text-blue-700",
    Completed: "bg-green-50 text-green-700",
    Approved: "bg-purple-50 text-purple-700",
    Reopened:"bg-red-50 text-red-700"
};

const allStatuses = ["Pending", "In Progress", "Completed", "Approved", "Reopened"];
const employeeStatuses = ["Pending", "In Progress", "Completed", "Reopened"];

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const { user } = useAuth();
    const canManage = user?.role === "admin" || user?.role === "manager";

    const fetchTasks = async () => {
        try {
            const response = await api.get("/api/tasks");
            setTasks(response.data.tasks);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskSaved = (savedTask) => {
        setTasks((prev) => {
            const exists = prev.some((t) => t._id === savedTask._id);
            if (exists) {
                return prev.map((t) => (t._id === savedTask._id ? savedTask : t));
            }
            return [savedTask, ...prev];
        });
    };

    const handleAdvanceStatus = async (task) => {
        const nextStatus = employeeNextStatus[task.status];
        if (!nextStatus) return;

        try {
            const response = await api.put(`/api/tasks/${task._id}`, { status: nextStatus });
            setTasks((prev) => prev.map((t) => (t._id === task._id ? response.data.task : t)));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update task");
        }
    };

    const handleStatusChange= async(task,newStatus)=>{
        if(newStatus===task.status) return;
        try {
            const response = await api.put(`/api/tasks/${task._id}`, { status: newStatus });
            setTasks((prev) => prev.map((t) => (t._id === task._id ? response.data.task : t)));
        } catch (error) {
            alert(err.response?.data?.message || "Failed to update task");
        }
    }

    const handleDelete = async (task) => {
        const confirmed = window.confirm(`Delete "${task.title}"? This cannot be undone.`);
        if (!confirmed) return;

        try {
            await api.delete(`/api/tasks/${task._id}`);
            setTasks((prev) => prev.filter((t) => t._id !== task._id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete task");
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setShowModal(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                    {canManage && (
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            + New Task
                        </button>
                    )}
                </div>

                {loading && <p className="text-gray-500">Loading tasks...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && tasks.length === 0 && (
                    <p className="text-gray-500">No tasks yet.</p>
                )}

                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-4"
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
                                    <span
                                        className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusStyles[task.status]}`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-5">
                                    {task.description}
                                    {task.description}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {task.project?.name}
                                    {task.assignedTo?.name && ` • Assigned to ${task.assignedTo.name}`}
                                </p>
                            </div>

                            <div className="flex items-center gap-5 shrink-0 mb-20">
                                {!canManage && (
                                    <select value={task.status}
                                    onChange={(event) => handleStatusChange(task, event.target.value)}
                                    className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                        {employeeStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                    </select>
                                ) 
                                }

                                {canManage && (
                                    <>
                                        <button
                                            onClick={() => openEditModal(task)}
                                            className="text-xs font-medium text-indigo-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task)}
                                            className="text-xs font-medium text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {showModal && (
                <TaskFormModal
                    task={editingTask}
                    onClose={() => setShowModal(false)}
                    onSaved={handleTaskSaved}
                />
            )}
        </div>
    );
}

export default Tasks;