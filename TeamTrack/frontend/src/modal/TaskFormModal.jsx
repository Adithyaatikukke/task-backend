import { useState, useEffect } from "react";
import api from "../services/api";

function TaskFormModal({ task, onClose, onSaved }) {
    const isEditing = Boolean(task);

    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const [formData, setFormData] = useState({
        title: task?.title || "",
        description: task?.description || "",
        project: task?.project?._id || "",
        assignedTo: task?.assignedTo?._id || "",
        status: task?.status || "Pending",
        dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [projectsRes, usersRes] = await Promise.all([
                    api.get("/api/projects"),
                    api.get("/api/auth/users"),
                ]);
                setProjects(projectsRes.data.projects);
                setUsers(usersRes.data.users);
            } catch (err) {
                setError("Failed to load form options");
            } finally {
                setLoadingOptions(false);
            }
        };

        fetchOptions();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.title.trim() || !formData.project) {
            setError("Task title and project are required");
            return;
        }

        setSubmitting(true);
        try {
            const response = isEditing
                ? await api.put(`/api/tasks/${task._id}`, formData)
                : await api.post("/api/tasks", formData);

            onSaved(response.data.task);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save task");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        {isEditing ? "Edit Task" : "New Task"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {loadingOptions ? (
                    <p className="text-sm text-gray-500">Loading form...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Task title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Design the login screen"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Optional details"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                            <select
                                name="project"
                                value={formData.project}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Select a project</option>
                                {projects.map((project) => (
                                    <option key={project._id} value={project._id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                            <select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Unassigned</option>
                                {users.filter((u)=>u.role==='employee').map((u) => (
                                    <option key={u._id} value={u._id}>
                                        {u.name} ({u.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isEditing && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Reopened">Reopened</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-sm font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting
                                    ? isEditing
                                        ? "Saving..."
                                        : "Creating..."
                                    : isEditing
                                    ? "Save Changes"
                                    : "Create Task"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default TaskFormModal;