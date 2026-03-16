import { Link } from "react-router-dom";
import { Sparkles, Zap, Globe, Layers, ArrowRight, ShieldCheck } from "lucide-react";

const Home = () => {
    return (
        <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-950 flex flex-col justify-center">

            {/* Abstract Background Shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4 lg:pt-32 lg:pb-4 w-full text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-purple-500/30 backdrop-blur-md mb-8 text-sm font-semibold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Gemini 2.5 AI Integration</span>
                </div>

                {/* Hero Text */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white">
                    Create Viral Content <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
                        In Seconds.
                    </span>
                </h1>

                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
                    Transform a single line of thought into detailed, highly engaging posts for LinkedIn, Twitter, Instagram, and Blogs. Elevate your online presence instantly.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link
                        to="/register"
                        className="group w-full sm:w-auto flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]"
                    >
                        Try it for Free
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-base font-bold text-slate-300 transition-all duration-300 bg-slate-900 border border-slate-700 rounded-full hover:bg-slate-800 hover:text-white"
                    >
                        Sign In to Workspace
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
                    {[
                        {
                            icon: <Globe className="w-6 h-6 text-blue-400" />,
                            title: "Multimodal AI",
                            desc: "Upload images for instant analysis or generate brand new AI images for your posts."
                        },
                        {
                            icon: <Zap className="w-6 h-6 text-purple-400" />,
                            title: "Instant Results",
                            desc: "Generate professional posts in under 5 seconds with state-of-the-art AI technology."
                        },
                        {
                            icon: <Layers className="w-6 h-6 text-indigo-400" />,
                            title: "Platform Optimized",
                            desc: "Specific algorithms for LinkedIn hook, Twitter thread, and Instagram caption viral trends."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md hover:bg-slate-800/80 transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl">
                            <div className="bg-slate-950 border border-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-20 pt-5 border-t border-slate-800/50 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        Start creating magic right away.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
