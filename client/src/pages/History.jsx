import { useState, useEffect } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { Clock, Archive, ChevronLeft, ChevronRight } from "lucide-react";

const History = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    const fetchPosts = async (currentPage) => {
        setLoading(true);
        try {
            const { data } = await API.get(`/posts?page=${currentPage}&limit=10`);
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch history");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await API.delete(`/posts/${id}`);
            setPosts(posts.filter((post) => post._id !== id));
            toast.success("Post deleted from archive.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">Loading archives...</p>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-950 py-12 px-4 relative overflow-hidden">

            {/* Background blur */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-800/80">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
                        <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            Output History
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Access all your previously generated content.</p>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="glass-card rounded-3xl p-16 text-center border-dashed border-2 border-slate-700/50 flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Archive className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-2xl text-white font-bold mb-2">It's quiet here...</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto">Start generating posts in your workspace to build up your content archive.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-10">
                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    isHistory={true}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-4">
                                <button
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-12 h-12 rounded-xl font-bold transition-all border ${page === i + 1
                                                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                                                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default History;
