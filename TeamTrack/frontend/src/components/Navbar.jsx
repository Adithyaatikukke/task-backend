import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { use } from "react";

function Navbar() {
    const { user, logout } = useAuth();

    const linkClasses = ({ isActive }) =>
        `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
            isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
        }`;

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-bold text-gray-900">TeamTrack</h1>

                    <nav className="flex items-center gap-1">
                        <NavLink to="/dashboard" className={linkClasses}>
                            Dashboard
                        </NavLink>
                        {user.role==='admin' && (
                            <NavLink to="/employee" className={linkClasses}>
                                Employee
                            </NavLink>
                        )}
                        <NavLink to="/projects" className={linkClasses}>
                            Projects
                        </NavLink>
                        <NavLink to="/tasks" className={linkClasses}>
                            Tasks
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-sm font-medium text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;