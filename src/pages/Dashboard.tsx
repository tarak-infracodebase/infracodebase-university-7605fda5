import { AppLayout } from "@/components/AppLayout";
import { ProgressRing } from "@/components/DashboardWidgets";
import { learningPaths } from "@/data/courseData";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, Play, ChevronRight, Zap, Target, Layers, Shield
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const tracks = learningPaths;

// Simulated progress state
const trackProgress: Record<string, { completed: number; status: "in_progress" | "completed" | "not_started" }> = {
  "welcome-orientation": { completed: 3, status: "completed" },
  "real-infrastructure": { completed: 2, status: "in_progress" },
  "architecture-diagrams": { completed: 0, status: "not_started" },
  "infrastructure-layers": { completed: 0, status: "not_started" },
};

const totalXP = 2450;
const currentLevel = 7;
const xpToNext = 550;
const tracksCompleted = 1;
const totalTracks = tracks.length;

function getIdentityTitle(level: number) {
  if (level >= 10) return "Architect";
  if (level >= 7) return "Platform Engineer";
  if (level >= 4) return "Builder";
  return "Explorer";
}

const Dashboard = () => {
  const currentTrack = tracks.find(p => trackProgress[p.id]?.status === "in_progress");
  const allCurrentLessons = currentTrack?.courses.flatMap(c => c.lessons) || [];
  const completedLessons = trackProgress[currentTrack?.id || ""]?.completed || 0;
  const currentTrackLessons = allCurrentLessons.length;
  const nextLesson = allCurrentLessons[completedLessons];
  const progressPct = currentTrackLessons > 0 ? Math.round((completedLessons / currentTrackLessons) * 100) : 0;
  const overallProgress = Math.round((tracksCompleted / totalTracks) * 100);
  const identity = getIdentityTitle(currentLevel);

  const inProgress = tracks.filter(t => trackProgress[t.id]?.status === "in_progress");
  const completed = tracks.filter(t => trackProgress[t.id]?.status === "completed");
  const notStarted = tracks.filter(t => !trackProgress[t.id] || trackProgress[t.id]?.status === "not_started");

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Control Plane</h1>
          <p className="text-sm text-muted-foreground">Track your progress, manage your learning, and evolve your infrastructure thinking.</p>
        </div>

        {/* Identity + Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-xl p-5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Identity</span>
            <div className="mt-2">
              <p className="text-lg font-bold text-foreground">{identity}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Level {currentLevel}</p>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Total XP</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <Zap className="h-4 w-4 text-primary" />
              <p className="text-lg font-mono font-bold text-foreground">{totalXP.toLocaleString()}</p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{xpToNext} XP to Level {currentLevel + 1}</p>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Tracks</span>
            <div className="mt-2">
              <p className="text-lg font-mono font-bold text-foreground">{tracksCompleted} / {totalTracks}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">completed</p>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Overall</span>
            <div className="mt-2 flex items-center gap-3">
              <ProgressRing value={overallProgress} max={100} size={48} strokeWidth={5}>
                <span className="text-xs font-mono font-bold">{overallProgress}%</span>
              </ProgressRing>
              <p className="text-[11px] text-muted-foreground">curriculum<br />progress</p>
            </div>
          </div>
        </div>

        {/* Current Workspace */}
        {currentTrack && (
          <div className="glass-panel rounded-xl p-6 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Current Workspace</h2>
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-primary font-mono mb-1">Track {currentTrack.order}</p>
                <h3 className="text-lg font-bold mb-1">{currentTrack.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 max-w-xl">{currentTrack.description.substring(0, 140)}...</p>
                <div className="flex items-center gap-3 mb-2">
                  <Progress value={progressPct} className="h-2 flex-1 max-w-[300px] bg-muted" />
                  <span className="text-xs font-mono text-muted-foreground">{progressPct}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Next: <span className="text-foreground font-medium">{nextLesson?.title ?? "All lessons complete"}</span>
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link to={nextLesson ? `/path/${currentTrack.id}/lesson/${nextLesson.id}` : `/path/${currentTrack.id}`}>
                  <Button size="sm" className="gap-1.5 text-xs">
                    <Play className="h-3 w-3" /> Resume
                  </Button>
                </Link>
                <Link to={`/path/${currentTrack.id}`}>
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    View Track <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Learning State */}
        <div className="space-y-6">
          {/* In Progress */}
          {inProgress.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">In Progress</h2>
              </div>
              <div className="grid gap-3">
                {inProgress.map(track => {
                  const tp = trackProgress[track.id];
                  const lessons = track.courses.flatMap(c => c.lessons);
                  const pct = Math.round(((tp?.completed || 0) / lessons.length) * 100);
                  return (
                    <Link key={track.id} to={`/path/${track.id}`} className="glass-panel rounded-xl p-4 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-primary font-mono">Track {track.order}</p>
                          <h3 className="text-sm font-semibold">{track.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={pct} className="h-1.5 flex-1 max-w-[180px] bg-muted" />
                            <span className="text-[10px] font-mono text-muted-foreground">{tp?.completed}/{lessons.length}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Completed</h2>
              </div>
              <div className="grid gap-3">
                {completed.map(track => {
                  const lessons = track.courses.flatMap(c => c.lessons);
                  return (
                    <Link key={track.id} to={`/path/${track.id}`} className="glass-panel rounded-xl p-4 opacity-80 hover:opacity-100 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground font-mono">Track {track.order}</p>
                          <h3 className="text-sm font-semibold text-muted-foreground">{track.title}</h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{lessons.length} lessons · Complete</p>
                        </div>
                        <span className="text-[10px] text-primary font-mono">✓</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Not Started */}
          {notStarted.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Not Started</h2>
              </div>
              <div className="grid gap-3">
                {notStarted.map(track => {
                  const lessons = track.courses.flatMap(c => c.lessons);
                  return (
                    <Link key={track.id} to={`/path/${track.id}`} className="glass-panel rounded-xl p-4 opacity-60 hover:opacity-90 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 border border-dashed border-border/50">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground font-mono">Track {track.order}</p>
                          <h3 className="text-sm font-semibold text-muted-foreground">{track.title}</h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{lessons.length} lessons</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
