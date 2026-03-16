import { useState, useRef } from "react";
import { Send, Sparkles, LayoutList, MessageSquare, Image as ImageIcon, X, Wand2, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

const PostForm = ({ onGenerate, loading }) => {
    const [idea, setIdea] = useState("");
    const [platform, setPlatform] = useState("LinkedIn");
    const [tone, setTone] = useState("Professional");
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [generatedSamples, setGeneratedSamples] = useState([]);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");

    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                toast.success("Image uploaded!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateImage = async () => {
        if (!idea.trim()) {
            toast.error("Please enter a description in the text box first!");
            return;
        }
        
        setImageLoading(true);
        try {
            toast.loading("Generating 2 samples...", { id: "gen-img" });
            
            // Generate 3 images for variety
            const promises = [
                window.puter.ai.txt2img(idea + " digital art style", { model: "gemini-2.5-flash-image-preview" }),
                window.puter.ai.txt2img(idea + " cinematic lighting", { model: "gemini-2.5-flash-image-preview" }),
            ];
            
            const results = await Promise.all(promises);
            setGeneratedSamples(results.map(img => img.src));
            setShowSelectionModal(true);
            toast.success("Samples generated!", { id: "gen-img" });
        } catch (error) {
            console.error("Puter Image Gen Error:", error);
            toast.error("Failed to generate images.", { id: "gen-img" });
        } finally {
            setImageLoading(false);
        }
    };

    const toBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    const selectImage = async (url) => {
        try {
            toast.loading("Processing selection...", { id: "select-img" });
            const base64 = await toBase64(url);
            setImage(base64);
            setShowSelectionModal(false);
            toast.success("Image selected!", { id: "select-img" });
        } catch (error) {
            console.error("Base64 conversion error:", error);
            setImage(url); // Fallback to URL
            setShowSelectionModal(false);
            toast.dismiss("select-img");
        }
    };

    const handleAnalyzeImage = async () => {
        if (!image) return;
        setIsAnalyzing(true);
        try {
            // Using Puter's multimodal capability if available, or just chat
            // Puter AI chat can take the image as the second argument
            const response = await window.puter.ai.chat(
                `Describe this image and suggest a viral post idea for ${platform}. Just provide the content idea, no extra talk.`,
                image
            );
            setIdea(response.message.content.substring(0, 300));
            toast.success("Image analyzed! Idea generated.");
        } catch (error) {
            console.error("Analysis error:", error);
            toast.error("Could not analyze image. Try typing an idea manually.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const removeImage = () => {
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!idea.trim() && !image) return;
        onGenerate(idea || "Analyze this image and create a post", platform, tone, image);
    };

    const platforms = [
        { id: "LinkedIn", label: "LinkedIn" },
        { id: "Twitter", label: "Twitter (X)" },
        { id: "Instagram", label: "Instagram" },
        { id: "Blog", label: "Blog Post" },
    ];

    const tones = [
        { id: "Professional", label: "Professional" },
        { id: "Casual", label: "Casual & Friendly" },
        { id: "Motivational", label: "Motivational" },
        { id: "Storytelling", label: "Storytelling" },
        { id: "Marketing", label: "Sales & Marketing" },
    ];

    return (
        <>
            <div className="glass-card p-8 md:p-10 rounded-3xl w-full border border-slate-700/60 shadow-2xl relative overflow-hidden group hover:border-slate-500/50 transition-all duration-300">

                {/* Decorative gradient corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-[100px] pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                    {/* Idea Input */}
                    <div>
                        <label className="flex items-center gap-2 text-slate-200 font-bold mb-3 text-lg">
                            <MessageSquare className="w-5 h-5 text-purple-400" />
                            What do you want to write about?
                        </label>
                        <div className="relative group/input">
                            <textarea
                                ref={textareaRef}
                                required={!image}
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                className="w-full px-5 py-4 min-h-[120px] bg-slate-950/50 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none shadow-inner"
                                placeholder="e.g. AI agents are replacing junior developers, but it's actually creating more senior roles than ever..."
                                maxLength={600}
                            />

                            {/* Character count & Submit Floating */}
                            <div className="absolute bottom-4 right-4 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleGenerateImage}
                                    disabled={imageLoading || !idea.trim()}
                                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all disabled:opacity-30"
                                    title="Generate Image from Text"
                                >
                                    {imageLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all"
                                    title="Upload Image"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <span className={`text-xs font-medium px-2 py-1 rounded-md bg-slate-900 border border-slate-800 ${idea.length > 600 ? 'text-orange-400' : 'text-slate-500'}`}>
                                    {idea.length}/600
                                </span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        {image && (
                            <div className="mt-3 relative inline-block group/preview">
                                <img
                                    src={image}
                                    alt="Uploaded preview"
                                    onClick={() => { setPreviewUrl(image); setShowPreviewModal(true); }}
                                    className="h-32 w-auto rounded-lg border border-slate-700 shadow-md transition-all group-hover/preview:brightness-75 cursor-pointer"
                                />

                                {/* Actions on Image */}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={handleAnalyzeImage}
                                        disabled={isAnalyzing}
                                        className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white shadow-lg transform hover:scale-110 transition-all border border-indigo-400"
                                        title="Analyze Image with AI"
                                    >
                                        {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="p-2 bg-slate-800 hover:bg-red-500 rounded-full text-white shadow-lg transform hover:scale-110 transition-all border border-slate-600"
                                        title="Remove Image"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center rounded-lg">
                                        <div className="flex flex-col items-center gap-1">
                                            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                                            <span className="text-[10px] text-white font-bold animate-pulse">Analyzing...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-950/30 border border-slate-800/50">

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                <LayoutList className="w-4 h-4 text-blue-400" />
                                Target Platform
                            </label>
                            <div className="relative">
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="input-field appearance-none cursor-pointer hover:border-slate-600 bg-slate-900 pr-10"
                                >
                                    {platforms.map(p => (
                                        <option key={p.id} value={p.id}>{p.label}</option>
                                    ))}
                                </select>
                                {/* Custom arrow indicator */}
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                <Sparkles className="w-4 h-4 text-pink-400" />
                                Content Tone
                            </label>
                            <div className="relative">
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="input-field appearance-none cursor-pointer hover:border-slate-600 bg-slate-900 pr-10"
                                >
                                    {tones.map(t => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </select>
                                {/* Custom arrow indicator */}
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Generate Button Wrapper */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || imageLoading || isAnalyzing || (!idea.trim() && !image)}
                            className="w-full relative overflow-hidden group bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-[1px] rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:hover:shadow-none"
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-300"></div>
                            <div className="relative bg-slate-900/40 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-3 px-8 py-5 group-hover:bg-transparent transition-all duration-300">
                                {loading ? (
                                    <>
                                        <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                        <span className="text-white font-bold text-lg tracking-wide">Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-white font-bold text-lg tracking-wide">Generate Content</span>
                                        <Send className="w-5 h-5 text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                </form>
            </div>

            {/* Selection Modal */}
            {showSelectionModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 md:p-8 flex justify-between items-center border-b border-slate-800">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                    Choose Best Sample
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">Select the image that best fits your post idea.</p>
                            </div>
                            <button
                                onClick={() => setShowSelectionModal(false)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {generatedSamples.map((url, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                        onClick={() => selectImage(url)}
                                    >
                                        <img
                                            src={url}
                                            alt={`Sample ${idx + 1}`}
                                            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                            <span className="px-4 py-2 bg-purple-600 rounded-full text-white text-xs font-bold shadow-lg">Use This Sample</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-950/50 flex justify-center">
                            <button
                                onClick={handleGenerateImage}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Regenerate Samples
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreviewModal && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-sm animate-in zoom-in duration-300 cursor-zoom-out"
                    onClick={() => setShowPreviewModal(false)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/10"
                        onClick={() => setShowPreviewModal(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative max-w-full max-h-full flex flex-col items-center">
                        <img
                            src={previewUrl}
                            alt="Full Preview"
                            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="mt-6 flex gap-4">
                            <button
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold flex items-center gap-2 transition-all shadow-xl shadow-purple-600/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const link = document.createElement('a');
                                    link.href = previewUrl;
                                    link.download = 'AI_Design.png';
                                    link.click();
                                }}
                            >
                                <ImageIcon className="w-5 h-5" /> Download Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostForm;
