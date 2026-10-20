import { useEffect, useState } from "react";
import { getMyStats } from "../api";

export default function StatsPanel({ refreshKey = 0, showBySkill = false }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError("");
      try {
        setStats(await getMyStats());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [refreshKey]);

  if (loading) return <section className="stats-panel state-card" aria-live="polite">Loading study stats...</section>;
  if (error) return <section className="stats-panel state-card error-text" role="alert">Could not load study stats: {error}</section>;

  const totalHours = Number(stats?.total_hours) || 0;
  const bySkill = stats?.by_skill || [];
  const maxSkillHours = Math.max(...bySkill.map((item) => Number(item.hours) || 0), 0);

  return (
    <section className="stats-panel" aria-labelledby="stats-title">
      <h2 id="stats-title" className="section-title">Study stats</h2>
      <div className="stats-primary">
        <p className="stats-label">Progress toward mastery</p>
        <p className="stats-total"><span>{totalHours.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span> / 10,000 hrs</p>
        <progress className="progress-track" aria-label="Progress toward 10,000 study hours" value={Math.min(totalHours, 10000)} max="10000" />
      </div>
      <dl className="stats-grid">
        <div><dt>Study sessions</dt><dd>{stats?.study_count ?? 0}</dd></div>
        <div><dt>This week</dt><dd>{Number(stats?.week_hours || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} hrs</dd></div>
        <div><dt>Current streak</dt><dd>{stats?.streak_days ?? 0} days</dd></div>
      </dl>
      {totalHours === 0 && <p className="stats-encouragement">Every journey starts with one focused session.</p>}
      {showBySkill && (
        <div className="by-skill">
          <h3>By skill</h3>
          {bySkill.length === 0 ? (
            <p className="muted-copy">Your skill breakdown will appear after your first study post.</p>
          ) : (
            <ul className="skill-stats-list">
              {bySkill.map((item) => {
                const hours = Number(item.hours) || 0;
                return (
                  <li key={item.skill || "other"}>
                    <div className="skill-stats-heading"><span>{item.skill || "Other"}</span><span>{hours.toLocaleString(undefined, { maximumFractionDigits: 2 })} hrs · {item.sessions} sessions</span></div>
                    <progress className="skill-bar-track" aria-label={`${item.skill || "Other"} study hours`} value={hours} max={maxSkillHours || 1} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
