import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import UserForm from "../modal/addUserFormModal";

function Employee(){
    const [employee,setEmployee] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search,setSearch] = useState("")

    const { user } = useAuth();
    const canManage = user?.role === "admin";
    const canDelete = user?.role === "admin";

    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                const users = await api.get("/api/auth/users");
                console.log(users)
                setEmployee(users.data.users)
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load users"
                );
            }finally{
                setLoading(false);
            }
        };
        fetchUsers();

    },[]);

    const handleUserSaved = (savedUser) => {
        setEmployee((prev) => {
            const exists = prev.some((p) => p._id === savedUser._id);
            if (exists) {
                return prev.map((p) => (p._id === savedUser._id ? savedUser : p));
            }
            return [savedUser, ...prev];
        });
    };

    const handleDelete = async (employee) => {
        const confirmed = window.confirm(`Delete "${employee.name}"? This cannot be undone.`);
        if (!confirmed) return;

        try {
            await api.delete(`/api/auth/deleteUser/${employee._id}`);
            setEmployee((prev) => prev.filter((p) => p._id !== employee._id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete project");
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const filteredEmployees = employee.filter((emp)=>{
        const searchTerm = search.toLowerCase();
        return (
            emp.name?.toLowerCase().includes(searchTerm) ||
            emp.email?.toLowerCase().includes(searchTerm) ||
            emp.role?.toLowerCase().includes(searchTerm)
        );
    })
    return(
        <div>
            <main>
                <div className="min-h-screen bg-gray-50">
                    <Navbar/>
                    <main className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Employee List</h2>
                        {canManage && (
                            <button
                                onClick={openCreateModal}
                                className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                + New Employee
                            </button>
                        )}
                    </div>

                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
                                {error}
                            </div>
                        )}

                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

                        {loading ? (
                            <div className="p-6 text-gray-500">
                                Loading employees...
                            </div>
                        ) : employee.length === 0 ? (
                            <div className="p-6 text-gray-500">
                                No employees found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="p-4 border-b border-gray-200">
                                    <input
                                    type="text"
                                    placeholder="Search Employees"
                                    value={search}
                                    onChange={(e)=>setSearch(e.target.value)}
                                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                                                Name
                                            </th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                                                Email
                                            </th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                                                Role
                                            </th>
                                            {canManage && (
                                            <th className="px-6 py-3 text-sm font-medium text-gray-500">
                                                Actions
                                            </th>
        )}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        {filteredEmployees.map((emp) => (
                                            <tr key={emp._id}>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {emp.name}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {emp.email}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {emp.role}
                                                </td>
                                                {canManage && (
    <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-4">
            <button
                onClick={() => openEditModal(emp)}
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
                Edit
            </button>

            {canDelete && (
                <>
                    <span className="text-gray-300">|</span>

                    <button
                        onClick={() => handleDelete(emp)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                        Delete
                    </button>
                </>
            )}
        </div>
    </td>
)}
                                            </tr>
                                        ))}                                        
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    </main>
                </div>
            </main>
            {showModal && (
                <UserForm
                    user={editUser}
                    onClose={() => setShowModal(false)}
                    onSaved={handleUserSaved}
                />
            )}
        </div>
        
            
        
    )
}


export default Employee;