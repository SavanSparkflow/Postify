import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, Sparkles, LayoutDashboard, History as HistoryIcon, ShieldAlert, LogOut, User } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/");
    };

    const navLinks = user
        ? [
            { name: "Workspace", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
            { name: "History", path: "/history", icon: <HistoryIcon className="w-4 h-4" /> },
            ...(user.isAdmin ? [{ name: "Admin", path: "/admin", icon: <ShieldAlert className="w-4 h-4" /> }] : []),
        ]
        : [];

    return (
        <nav className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2.5 rounded-xl group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-white">
                                Postify<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {user ? (
                            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1.5 rounded-full">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === link.path
                                            ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                                            }`}
                                    >
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                ))}
                                <Link
                                    to="/profile"
                                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === "/profile"
                                        ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                                        }`}
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all ml-1 border border-transparent hover:border-red-900/50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-slate-400 hover:text-white font-medium transition-colors px-4 py-2">
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-slate-950 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-950 border-b border-slate-800 absolute w-full left-0 z-40">
                    <div className="px-4 py-4 space-y-3">
                        {user ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium border ${location.pathname === link.path
                                            ? "bg-slate-900 border-slate-700 text-white"
                                            : "border-transparent text-slate-400 hover:bg-slate-900 hover:border-slate-800 hover:text-white"
                                            }`}
                                    >
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-900/50"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="text-center px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="text-center px-4 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold"
                                >
                                    Get Started Free
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
