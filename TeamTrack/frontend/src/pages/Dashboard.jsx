import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useEffect, useState} from "react";
import api from "../services/api";


function Dashboard() {
    const { user } = useAuth();
    const [stats,setStats] = useState({
        activeProjects: 0,
        pendingTasks: 0,
        completedThisWeek: 0,
    })
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(()=>{
        const fetchedDahboardStats = async()=>{
            try {
                const response = await api.get("/api/dashboard")
                console.log(response)
                setStats(response.data);   
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard statistics"
                );
            }finally{
                setLoading(false)
            }
        };
        fetchedDahboardStats()
    },[]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(" ")[0]}</h2>
                    <p className="text-gray-500 mt-1">Here's what's happening across your team.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Active Projects</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            {loading?"Loading....":stats.activeProjects}
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Pending Tasks</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            {loading?"Loading....":stats.pendingTasks}
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Completed This Week</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                        {loading?"Loading....":stats.completedThisWeek}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;