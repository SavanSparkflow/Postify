import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Copy, Download, RefreshCw, Trash2, Linkedin, Twitter, MessageCircle, Check, Share2, AlignLeft, Languages, ImagePlus, Loader2, X, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../services/api";

const PostCard = ({ post, onDelete, onRegenerate, isHistory = false }) => {
    const { refreshUser } = useContext(AuthContext);
    const [content, setContent] = useState(post?.generatedContent || "");
    const [copied, setCopied] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(post?.image || null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [generatedSamples, setGeneratedSamples] = useState([]);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const textareaRef = useRef(null);
    // API will be imported properly below

    // Auto-resize textarea logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.max(250, textareaRef.current.scrollHeight)}px`;
        }
    }, [content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("Copied to clipboard!", { style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `PostifyAI_${post?.platform || 'Post'}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const encodedContent = encodeURIComponent(content);
    const shareLinks = {
        linkedin: `https://www.linkedin.com/feed/?shareActive=true&text=${encodedContent}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedContent}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedContent}`,
    };

    const handleTranslate = async (language) => {
        if (!content.trim()) return;
        setIsTranslating(true);
        const toastId = toast.loading(`Translating to ${language}...`, { style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } });
        try {
            const { data } = await API.post("/posts/translate", { text: content, targetLanguage: language });
            setContent(data.translatedContent);
            toast.success(`Translated to ${language}!`, { id: toastId, style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } });
        } catch (error) {
            toast.error(error.response?.data?.message || "Translation failed", { id: toastId, style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } });
        } finally {
            setIsTranslating(false);
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

    const handleGenerateImage = async () => {
        if (!content.trim()) return;
        setIsGeneratingImage(true);
        const toastId = toast.loading('Consulting AI for 3 artistic samples...', { style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } });
        try {
            // Step 1: Generate a visual prompt from the post content using Puter
            const promptResponse = await window.puter.ai.chat(
                `Create a 15-word artistic visual prompt for image generation based on this post: "${content.substring(0, 200)}..." Output ONLY the prompt.`
            );
            const visualPrompt = promptResponse.message.content.trim();

            // Step 2: Use Puter's txt2img with the Gemini preview model to generate 3 samples
            const promises = [
                window.puter.ai.txt2img(visualPrompt + " (Vibrant Style)", { model: "gemini-2.5-flash-image-preview" }),
                window.puter.ai.txt2img(visualPrompt + " (Cinematic Dramatic)", { model: "gemini-2.5-flash-image-preview" }),
                window.puter.ai.txt2img(visualPrompt + " (Modern Minimalist)", { model: "gemini-2.5-flash-image-preview" })
            ];
            
            const results = await Promise.all(promises);
            setGeneratedSamples(results.map(img => img.src));
            setShowSelectionModal(true);
            
            toast.success("AI Artistic Samples Ready!", { id: toastId, style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } });
        } catch (error) {
            console.error("Puter PostCard Image Gen Error:", error);
            toast.error("Puter image generation failed.", { id: toastId });
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleSelectAndSaveImage = async (url) => {
        const toastId = toast.loading('Saving selection to history...', { style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } });
        try {
            const base64 = await toBase64(url);
            // Update in DB
            await API.patch(`/posts/${post._id}`, { image: base64 });
            setGeneratedImage(url);
            setShowSelectionModal(false);
            toast.success("Image saved to post history!", { id: toastId });
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Could not save to history, using temporary view.", { id: toastId });
            setGeneratedImage(url);
            setShowSelectionModal(false);
        }
    };

    const openPreview = (url) => {
        setPreviewUrl(url);
        setShowPreviewModal(true);
    };

    return (
        <>
            <div className="glass-card rounded-[2rem] border border-slate-700 hover:border-slate-500/80 transition-all duration-300 flex flex-col mt-6 shadow-2xl overflow-hidden group relative p-[1px] bg-gradient-to-b from-slate-700/50 to-slate-800/20">

                {/* Real inner wrapper */}
                <div className="bg-slate-900 rounded-[31px] p-6 md:p-8 h-full flex flex-col">

                    {/* Header Badges */}
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-800/80">
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                                {post?.platform === 'LinkedIn' && <Linkedin className="w-3 h-3" />}
                                {post?.platform === 'Twitter' && <Twitter className="w-3 h-3" />}
                                {post?.platform || "Platform"}
                            </span>
                            <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 text-purple-400 rounded-full text-xs font-bold tracking-wide shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                                {post?.tone || "Tone"}
                            </span>
                        </div>

                        {isHistory && (
                            <button
                                onClick={() => onDelete(post._id)}
                                className="text-slate-500 hover:text-red-400 p-2 rounded-full hover:bg-red-400/10 transition-all bg-slate-800/50 border border-slate-700"
                                title="Delete Post"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Prompt Context */}
                    <div className="mb-6 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                        <div className="pl-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Your Prompt</span>
                            <p className="text-sm text-slate-300 font-medium italic leading-relaxed">"{post?.idea}"</p>
                            {post?.image && !generatedImage && (
                                <div className="mt-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Uploaded Image</span>
                                    <img
                                        src={post.image}
                                        alt="Uploaded"
                                        onClick={() => openPreview(post.image)}
                                        className="h-24 w-auto rounded-lg border border-slate-700 shadow-md object-cover cursor-pointer hover:border-purple-500 transition-all"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Editable Output */}
                    <div className="relative group/editor flex-grow mb-6">
                        <div className="absolute top-3 left-3 pointer-events-none opacity-30 text-slate-500">
                            <AlignLeft className="w-5 h-5" />
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-full min-h-[250px] bg-slate-950/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none text-slate-200 p-5 pl-11 leading-relaxed text-[15px] font-medium shadow-inner"
                            spellCheck="false"
                        />
                    </div>

                    {generatedImage && (
                        <div className="mb-6 relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl mx-auto w-full max-w-[400px] group/postimg">
                            <img
                                src={generatedImage}
                                alt="AI Generated for Post"
                                onClick={() => openPreview(generatedImage)}
                                className="w-full h-auto object-cover cursor-pointer group-hover/postimg:brightness-90 transition-all"
                                crossOrigin="anonymous"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/postimg:opacity-100 transition-opacity pointer-events-none">
                                <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20">Click to Preview</span>
                            </div>
                            <a href={generatedImage} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-purple-600 text-white rounded-lg backdrop-blur-sm transition-all shadow-lg" title="Open Full Size">
                                <Download className="w-4 h-4" />
                            </a>
                        </div>
                    )}

                    {/* Action Footer */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-800/80">

                        <div className="flex w-full md:w-auto gap-3">
                            <button
                                onClick={handleCopy}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${copied
                                    ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                                    : "bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700 hover:border-slate-600"
                                    }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy Text"}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 hover:bg-slate-700 rounded-xl text-sm font-bold transition-all"
                            >
                                <Download className="w-4 h-4" /> Save .txt
                            </button>
                            <button
                                onClick={handleGenerateImage}
                                disabled={isGeneratingImage}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-500/20 text-purple-400 hover:text-white border border-purple-500/30 hover:border-purple-500 hover:bg-purple-600 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                            >
                                {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                                AI Image
                            </button>
                        </div>

                        <div className="flex w-full md:w-auto items-center gap-1 bg-slate-900 border border-slate-700/80 p-1.5 rounded-xl shadow-inner">
                            <div className="flex items-center gap-1 px-2 text-slate-400">
                                <Languages className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase tracking-wider hidden lg:block">Translate</span>
                            </div>
                            <button
                                onClick={() => handleTranslate("Hindi")}
                                disabled={isTranslating}
                                className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-purple-500/20 hover:text-purple-400 text-slate-300 rounded-lg transition-all border border-slate-700 hover:border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Translate to Hindi"
                            >
                                Hindi
                            </button>
                            <button
                                onClick={() => handleTranslate("Gujarati")}
                                disabled={isTranslating}
                                className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-blue-500/20 hover:text-blue-400 text-slate-300 rounded-lg transition-all border border-slate-700 hover:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Translate to Gujarati"
                            >
                                Gujarati
                            </button>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                            <div className="flex gap-1 items-center px-2 border-r border-slate-800 mr-1">
                                <Share2 className="w-4 h-4 text-slate-500 mr-2" />
                                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all" title="Share on LinkedIn">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 rounded-lg transition-all" title="Share on Twitter (X)">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all" title="Share on WhatsApp">
                                    <MessageCircle className="w-4 h-4" />
                                </a>
                            </div>

                            {!isHistory && onRegenerate && (
                                <button
                                    onClick={() => onRegenerate()}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-sm font-bold hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                >
                                    <RefreshCw className="w-4 h-4" /> Try Again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection Modal */}
            {showSelectionModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 md:p-8 flex justify-between items-center border-b border-slate-800">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                    Choose Post Visual
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">Select the image to attach to this post. It will be saved permanently.</p>
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
                                        onClick={() => handleSelectAndSaveImage(url)}
                                    >
                                        <img
                                            src={url}
                                            alt={`Sample ${idx + 1}`}
                                            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                            <span className="px-4 py-2 bg-purple-600 rounded-full text-white text-xs font-bold shadow-lg">Save & Use</span>
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
                            <a
                                href={previewUrl}
                                download="PostifyAI_Design.png"
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold flex items-center gap-2 transition-all shadow-xl shadow-purple-600/20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download className="w-5 h-5" /> Download High Res
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostCard;
