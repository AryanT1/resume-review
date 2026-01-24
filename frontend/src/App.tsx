import React, { useState, useEffect, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, RefreshCw, Github } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TypingFeedback = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setIsTyping(true);
    if (!text) return;

    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          Review Results
        </h3>
        {isTyping && (
          <span className="text-xs font-medium text-slate-400 animate-pulse">
            Analyzing...
          </span>
        )}
      </div>
      <div className="p-6 prose prose-slate max-w-none">
        <ReactMarkdown>{displayedText}</ReactMarkdown>
        {isTyping && <span className="inline-block w-2 h-5 ml-1 bg-indigo-500 animate-pulse align-middle" />}
      </div>
    </div>
  );
};

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a resume file");
      return;
    }

    setError(null);
    setLoading(true);
    setFeedback("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback. Please try again.");
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setFeedback("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Resume.Check</span>
            </div>
            <a 
              href="https://github.com/AryanT1/resume-review" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight mb-4">
            Get Instant <span className="text-indigo-600">AI Feedback</span> on Your Resume
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your resume in PDF format and receive detailed, actionable insights to help you land your dream job.
          </p>
        </div>

        <div className="space-y-8">
          {!feedback ? (
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
                    dragActive 
                      ? "border-indigo-500 bg-indigo-50" 
                      : "border-slate-300 hover:border-slate-400 bg-slate-50"
                  } ${file ? "border-emerald-500 bg-emerald-50" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className={`p-4 rounded-full ${file ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"}`}>
                    {file ? <CheckCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                  </div>

                  <div className="text-center">
                    {file ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">{file.name}</p>
                        <p className="text-sm text-slate-500">{(file.size / 1024 ).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-500">PDF files only (max 10MB)</p>
                      </div>
                    )}
                  </div>

                  {!file && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    />
                  )}
                  
                  {file && !loading && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="mt-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                    >
                      Remove file
                    </button>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!file || loading}
                  className={`w-full py-4 px-6 cursor-pointer rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                    !file || loading
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5  animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      Analyze My Resume
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TypingFeedback text={feedback} />
              
              <div className="flex justify-center">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <RefreshCw className="w-4 cursor-pointer h-4" />
                  Review Another Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-12 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Resume.Check. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;