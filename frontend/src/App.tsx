import { useState, useEffect } from "react";

const TypingFeedback = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    if (!text) return;

    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <pre className="whitespace-pre-wrap overflow-auto max-h-[400px] p-4 bg-gray-100 rounded-md border border-gray-300 mt-4">
      {displayedText}
    </pre>
  );
};

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
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

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:3055/review", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback");
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f1ea] min-h-screen p-20 flex flex-col gap-6 items-center">
      <div className="w-full max-w-3xl flex flex-col">
        <div className="flex border-b border-black justify-center">
          <h1 className="font-bold m-4 text-4xl">Resume.Check</h1>
        </div>
        <div className="flex p-4 justify-center px-2">
          <form
            className="flex flex-col justify-center items-center
           gap-4 w-fit"
            onSubmit={handleSubmit}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block bg-white border border-gray-400 rounded px-3 py-2 cursor-pointer file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <button
              type="submit"
              disabled={!file || loading}
              className="bg-gray-600 w-fit cursor-pointer text-white p-4 rounded hover:bg-gray-700 "
            >
              {loading ? "Reviewing..." : "Upload for Review"}
            </button>

            {error && <p className="text-red-600 mt-2">{error}</p>}

            {feedback && <TypingFeedback text={feedback} />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
