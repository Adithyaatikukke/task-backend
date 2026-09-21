import { useState } from "react";
import api from "../services/api";

function UserForm({user, onClose, onSaved}){
    const isEditing = Boolean(user);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        // password: user?.password || "",
        role: user?.role || "",
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.name.trim()) {
            setError("User name is required");
            return;
        }

        setSubmitting(true);
        try {
            const response = isEditing
                ? await api.put(`/api/auth/updateUser/${user._id}`, formData)
                : await api.post("/api/auth/add", formData);

            onSaved(response.data.user);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save user");
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        {isEditing ? "Edit User" : "New User"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">User name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. john@gmail.com?"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>
                    {!isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter Strong Password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>)}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="e.g. Manager"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
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
                                : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default UserForm;