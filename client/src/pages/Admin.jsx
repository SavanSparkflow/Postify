import { useState, useEffect } from "react";
import API from "../services/api";
import { Users, FileText, Activity, Server, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

const Admin = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await API.get("/admin/stats");
            setStats(data.stats);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch admin stats");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-red-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">Securing Admin Panel...</p>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-950 py-12 px-4 relative overflow-hidden">

            {/* Background blur */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-6xl mx-auto relative z-10">

                <div className="flex items-center gap-3 mb-12 pb-6 border-b border-red-900/30">
                    <div className="p-3 bg-red-950 border border-red-900/50 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <ShieldCheck className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            Admin Control Center
                        </h1>
                        <p className="text-red-400 font-medium mt-1">Superuser monitoring console.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 rounded-[2rem] border border-slate-800 flex items-center justify-between group hover:border-blue-500/50 transition-all duration-300">
                        <div>
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Registered Users</p>
                            <h3 className="text-5xl font-extrabold text-white">{stats?.totalUsers || 0}</h3>
                        </div>
                        <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2rem] border border-slate-800 flex items-center justify-between group hover:border-purple-500/50 transition-all duration-300">
                        <div>
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Posts Generated</p>
                            <h3 className="text-5xl font-extrabold text-white">{stats?.totalPostsGenerated || 0}</h3>
                        </div>
                        <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2rem] border border-slate-800 flex items-center justify-between group hover:border-green-500/50 transition-all duration-300">
                        <div>
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">API Calls Made</p>
                            <h3 className="text-5xl font-extrabold text-white">{stats?.apiUsageCount || 0}</h3>
                        </div>
                        <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <Activity className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="mt-12 glass-card rounded-[2rem] p-8 border border-slate-800 flex items-center gap-4 bg-slate-900/80">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] animate-pulse"></div>
                    <span className="text-slate-300 font-semibold tracking-wide flex items-center gap-2">
                        <Server className="w-5 h-5 text-slate-500" />
                        Gemini 2.5 Inference Engine: Online & Operational
                    </span>
                </div>

            </div>
        </div>
    );
};

export default Admin;
