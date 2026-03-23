import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type ExerciseType = "writing" | "build-external" | "build-platform";

interface HandsOnSubmissionProps {
  exerciseId: string;
  exerciseType?: ExerciseType;
  exerciseDescription?: string;
}

const WRITING_SIGNALS = /\b(write|identify|think about|review|describe|explain|answer|choose|compare|list|map|define|reflect|assess)\b/i;
const PLATFORM_SIGNALS = /\b(screenshot|auto-generate|generate diagram|create a ruleset|update documentation|inside infracodebase|in your workspace|open your workspace|in the platform)\b/i;

function inferType(description?: string, explicit?: ExerciseType): ExerciseType {
  if (explicit) return explicit;
  if (!description) return "build-external";
  if (PLATFORM_SIGNALS.test(description)) return "build-platform";
  if (!WRITING_SIGNALS.test(description)) return "build-external";
  // Check if it also has build signals
  const BUILD_SIGNALS = /\b(create|build|deploy|set up|configure|generate|provision|launch|implement|connect|install|ask the agent)\b/i;
  if (BUILD_SIGNALS.test(description) && !description.toLowerCase().startsWith("write")) return "build-external";
  return "writing";
}

const HandsOnSubmission = ({ exerciseId, exerciseType, exerciseDescription }: HandsOnSubmissionProps) => {
  const storageKey = `icbu_submission_${exerciseId}`;
  const type = inferType(exerciseDescription, exerciseType);

  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem(storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        setUrl(parsed.url || "");
        setDescription(parsed.description || "");
        setAnswer(parsed.answer || "");
        setScreenshot(parsed.screenshot || null);
        setNotes(parsed.notes || "");
      }
    } catch {}
  }, [storageKey]);

  const handleSave = () => {
    try {
      const payload =
        type === "writing" ? { answer } :
        type === "build-platform" ? { screenshot, notes } :
        { url, description };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setScreenshot(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="mt-5 rounded-xl border border-border/30 bg-card/30 p-5">
      {type === "writing" && (
        <Textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          className="min-h-[120px] bg-background/50 border-border/50 text-sm resize-y"
        />
      )}

      {type === "build-external" && (
        <>
          <h4 className="text-sm font-semibold mb-1">Submit Your Work</h4>
          <p className="text-xs text-muted-foreground mb-4">
            Paste a link to your repo, workspace, or screenshot — or describe what you built. This is for your own record.
          </p>
          <div className="space-y-3">
            <Input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Link to repo, workspace, or screenshot"
              className="bg-background/50 border-border/50 text-sm"
            />
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what you built (optional)"
              className="min-h-[80px] bg-background/50 border-border/50 text-sm resize-y"
            />
          </div>
        </>
      )}

      {type === "build-platform" && (
        <>
          <h4 className="text-sm font-semibold mb-1">Upload a screenshot of your work</h4>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {screenshot ? (
            <div className="mt-3 space-y-3">
              <div className="relative rounded-lg overflow-hidden border border-border/30">
                <img src={screenshot} alt="Screenshot" className="w-full max-h-[300px] object-contain bg-background/50" />
                <button
                  onClick={() => { setScreenshot(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute top-2 right-2 text-xs bg-background/80 backdrop-blur px-2 py-1 rounded border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Replace
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`mt-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
                dragging
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/50 bg-background/30 hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Drag and drop or click to upload</span>
            </div>
          )}
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add any notes about what you did (optional)"
            className="mt-3 min-h-[80px] bg-background/50 border-border/50 text-sm resize-y"
          />
        </>
      )}

      <div className="flex items-center gap-3 mt-3">
        <Button onClick={handleSave} size="sm" variant="outline" className="text-xs">
          Save
        </Button>
        {saved && (
          <span className="text-xs text-[hsl(145,60%,45%)] font-medium animate-in fade-in">
            Saved ✓
          </span>
        )}
      </div>
    </div>
  );
};

export default HandsOnSubmission;
