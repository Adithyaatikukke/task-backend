import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ProjectFormModal from "../modal/ProjectFormModal";

const statusStyles = {
    Active: "bg-green-50 text-green-700",
    "On Hold": "bg-yellow-50 text-yellow-700",
    Completed: "bg-gray-100 text-gray-600",
};

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const { user } = useAuth();
    const canManage = user?.role === "admin" || user?.role === "manager";
    const canDelete = user?.role === "admin";

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get("/api/projects");
                setProjects(response.data.projects);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load projects");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectSaved = (savedProject) => {
        setProjects((prev) => {
            const exists = prev.some((p) => p._id === savedProject._id);
            if (exists) {
                return prev.map((p) => (p._id === savedProject._id ? savedProject : p));
            }
            return [savedProject, ...prev];
        });
    };

    const handleDelete = async (project) => {
        const confirmed = window.confirm(`Delete "${project.name}"? This cannot be undone.`);
        if (!confirmed) return;

        try {
            await api.delete(`/api/projects/${project._id}`);
            setProjects((prev) => prev.filter((p) => p._id !== project._id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete project");
        }
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setShowModal(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                    {canManage && (
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            + New Project
                        </button>
                    )}
                </div>

                {loading && <p className="text-gray-500">Loading projects...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && projects.length === 0 && (
                    <p className="text-gray-500">No projects yet.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3"
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[project.status]}`}
                                >
                                    {project.status}
                                </span>
                            </div>

                            {project.description && (
                                <p className="text-sm text-gray-500">{project.description}</p>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <span className="text-xs text-gray-400">
                                    Managed by {project.manager?.name}
                                </span>

                                {canManage && (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => openEditModal(project)}
                                            className="text-xs font-medium text-indigo-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        {canDelete && (
                                            <button
                                                onClick={() => handleDelete(project)}
                                                className="text-xs font-medium text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {showModal && (
                <ProjectFormModal
                    project={editingProject}
                    onClose={() => setShowModal(false)}
                    onSaved={handleProjectSaved}
                />
            )}
        </div>
    );
}

export default Projects;