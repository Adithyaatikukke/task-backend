import { useState } from "react";
import { useNavigate, Link, replace } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter both email and password");
            return;
        }

        setSubmitting(true);
        try {
            await login(formData.email, formData.password);
            navigate("/dashboard",{replace:true});
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-4">
                <div className="text-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">TeamTrack</h1>
                    <p className="text-sm text-gray-500 mt-1">Log in to your account</p>
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
    
                {error && <p className="text-sm text-red-600">{error}</p>}
    
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "Logging in..." : "Log in"}
                </button>
    
                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;