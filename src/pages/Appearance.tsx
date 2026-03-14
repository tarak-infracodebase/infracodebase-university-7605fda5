import { AppLayout } from "@/components/AppLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const Appearance = () => {
  const { theme, setTheme } = useTheme();

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Theme</h1>
          <p className="text-sm text-muted-foreground">Choose your preferred color scheme.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Light */}
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "rounded-xl border-2 p-6 flex flex-col items-center gap-4 transition-all",
              theme === "light"
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border hover:border-border/80 bg-card"
            )}
          >
            <div className="h-28 w-full rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <Sun className="h-8 w-8 text-amber-500" />
            </div>
            <span className="text-sm font-medium">Light</span>
          </button>

          {/* Dark */}
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "rounded-xl border-2 p-6 flex flex-col items-center gap-4 transition-all",
              theme === "dark"
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border hover:border-border/80 bg-card"
            )}
          >
            <div className="h-28 w-full rounded-lg bg-[hsl(228,30%,6%)] border border-[hsl(228,16%,16%)] flex items-center justify-center">
              <Moon className="h-8 w-8 text-crystal-violet" />
            </div>
            <span className="text-sm font-medium">Dark</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Appearance;
