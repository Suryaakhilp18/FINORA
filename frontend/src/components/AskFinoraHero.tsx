import React, { useState, useRef } from 'react';
import { 
  Sparkles, Mic, MicOff, Camera, FileText, ArrowRight, 
  Loader2
} from 'lucide-react';
import { ApiService } from '../services/api';

interface AskFinoraHeroProps {
  onSimulationReady: (result: any, options?: { triggeredByUserQuestion?: boolean }) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const AskFinoraHero: React.FC<AskFinoraHeroProps> = ({
  onSimulationReady,
  isLoading,
  setIsLoading,
}) => {
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Voice Input via Web Speech API
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleAsk = async (customQuery?: string) => {
    const textToAsk = customQuery || query;
    if (!textToAsk.trim() || isLoading) return;

    setIsLoading(true);
    setUploadStatus(null);
    try {
      const res = await ApiService.askCopilot(textToAsk);
      onSimulationReady(res, { triggeredByUserQuestion: true });
    } catch (e: any) {
      console.error("Inquiry error:", e);
      alert("AI decision analysis fallback triggered.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, _type: 'image' | 'doc') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadStatus(`Analyzing ${file.name} with Gemini multimodal agent...`);
    try {
      const res = await ApiService.uploadDocumentOrScreenshot(file);
      setUploadStatus(`Extracted: ${res.extracted?.product_or_merchant || 'Item'} (₹${res.extracted?.amount || 0})`);
      
      const sim = await ApiService.simulateWhatIf({
        product_name: res.extracted?.product_or_merchant || file.name,
        price: res.extracted?.amount || 65000,
        query: `Multimodal scan of ${file.name}`,
      });
      onSimulationReady({
        query: `Uploaded: ${file.name}`,
        extracted: res.extracted,
        parsed_intent: { product: res.extracted?.product_or_merchant, amount: res.extracted?.amount },
        deterministic_scenarios: sim.scenarios,
        timeline: sim.timeline,
        explanation: sim.explanation,
        data_completeness: sim.data_completeness
      });
    } catch (err: any) {
      console.error(err);
      setUploadStatus("Extraction failed. Try manual amount entry.");
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "Can I afford a ₹65,000 laptop?",
    "Should I take a 12-month EMI for iPhone?",
    "Can I afford a ₹25,000 Goa trip next month?",
    "What happens if my freelance income drops by 20%?",
    "Help me save ₹1 lakh for my emergency cushion"
  ];

  return (
    <div className="finora-card rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            FINORA AI Financial Decision Co-Pilot
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline">• Gemini 2.5 Flash + Pure Math Engine</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-1.5">
          What financial decision are you thinking about?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5">
          Ask in plain English or Hinglish. Finora simulates real balance trade-offs using 100% deterministic math.
        </p>

        {/* Solid Input Bar */}
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <div className="flex-1 flex items-center px-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="e.g. Can I afford a ₹65,000 laptop next month without hurting my emergency fund?"
              className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm sm:text-base placeholder-slate-400 dark:placeholder-slate-500 py-2"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 sm:pl-2">
            {/* Voice Input */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`px-2.5 py-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                isRecording
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-300 animate-pulse'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Speak your financial question (Indian English)"
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5 text-rose-600" /> : <Mic className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />}
              <span className="hidden sm:inline text-[11px]">{isRecording ? 'Listening...' : 'Voice'}</span>
            </button>

            {/* Upload Screenshot */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, 'image')}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              title="Upload Amazon/Flipkart shopping screenshot to extract price & EMI"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="hidden sm:inline text-[11px]">Screenshot</span>
            </button>

            {/* Upload Doc/Statement */}
            <input
              type="file"
              ref={docInputRef}
              onChange={(e) => handleFileUpload(e, 'doc')}
              accept=".pdf,.csv,.png,.jpg,.jpeg"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              title="Upload PDF invoice, bill, or bank statement"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline text-[11px]">Statement</span>
            </button>

            {/* Ask AI Trigger */}
            <button
              type="button"
              onClick={() => handleAsk()}
              disabled={isLoading || !query.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ask AI</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {uploadStatus && (
          <div className="mt-3 text-xs text-indigo-700 dark:text-indigo-300 flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-2.5 rounded-lg">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{uploadStatus}</span>
          </div>
        )}

        {/* Quick Sample Prompts */}
        <div className="mt-4 flex items-center flex-wrap gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
            Try:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p);
                handleAsk(p);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-left font-medium"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
