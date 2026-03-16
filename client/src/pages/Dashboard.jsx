import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { Bot, Sparkles } from "lucide-react";

const Dashboard = () => {
    const { refreshUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [lastParams, setLastParams] = useState(null);

    const handleGenerate = async (idea, platform, tone, image = null) => {
        setLoading(true);
        setLastParams({ idea, platform, tone, image });
        setCurrentPost(null); // Clear previous output while thinking

        try {
            const { data } = await API.post("/posts", { idea, platform, tone, image });
            setCurrentPost(data.post);
            refreshUser();
            toast.success("Generation complete!", { icon: "🔥", style: { border: '1px solid #4a5568', background: '#1e293b', color: '#fff' } });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate post");
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = () => {
        if (lastParams) {
            handleGenerate(lastParams.idea, lastParams.platform, lastParams.tone, lastParams.image);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-950 py-12 px-4 relative overflow-hidden">

            {/* Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-700/50 rounded-2xl mb-4 shadow-lg shadow-purple-500/10">
                        <Bot className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Workspace</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Provide a basic idea and let our AI engine craft the perfect post.
                    </p>
                </div>

                {/* Form Container */}
                <div className="mb-10 animate-fade-in-up">
                    <PostForm onGenerate={handleGenerate} loading={loading} />
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="glass-card mt-8 rounded-3xl p-12 text-center flex flex-col items-center justify-center border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-pulse">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Architecting Content...</h3>
                        <p className="text-slate-400">Gemini 2.5 Flash is analyzing contexts and generating viral hooks</p>
                    </div>
                )}

                {/* Result State */}
                {!loading && currentPost && (
                    <div className="mt-12 transition-all duration-700 ease-in-out transform scale-100 opacity-100">
                        <div className="flex items-center gap-2 mb-6 ml-2">
                            <Sparkles className="w-5 h-5 text-green-400" />
                            <h2 className="text-2xl font-bold text-white tracking-tight">Generated Output</h2>
                        </div>
                        <PostCard
                            post={currentPost}
                            onRegenerate={handleRegenerate}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
