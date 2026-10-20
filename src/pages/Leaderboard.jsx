import { useEffect, useState } from "react";
import { getLeaderboard, getSkills } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Leaderboard() {
  const { userId } = useAuth();
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        setSkills(await getSkills());
      } catch (err) {
        setSkillsError(err.message);
      } finally {
        setSkillsLoading(false);
      }
    }
    loadSkills();
  }, []);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      setError("");
      try {
        setRows(await getLeaderboard(selectedSkill));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, [selectedSkill]);

  return (
    <section className="page-shell leaderboard-page">
      <div className="leaderboard-heading">
        <div>
          <h1 className="page-title">Leaderboard</h1>
          <p className="page-intro">A community view of public study hours.</p>
        </div>
        <label className="leaderboard-filter" htmlFor="leaderboard-skill">Skill
          <select id="leaderboard-skill" value={selectedSkill} onChange={(event) => setSelectedSkill(event.target.value)}>
            <option value="">All skills</option>
            {skills.map((skill) => <option key={skill} value={skill}>{skill}</option>)}
          </select>
        </label>
      </div>
      {skillsError && <p className="state-message error-state" role="alert">Could not load skills: {skillsError}</p>}
      {skillsLoading && <p className="muted-copy" aria-live="polite">Loading skill options...</p>}
      {!skillsLoading && !skillsError && skills.length === 0 && <p className="muted-copy">No skills are available to filter yet.</p>}
      {loading ? (
        <p className="state-message loading-state" aria-live="polite">Loading leaderboard...</p>
      ) : error ? (
        <p className="state-message error-state" role="alert">Could not load leaderboard: {error}</p>
      ) : rows.length === 0 ? (
        <p className="state-message empty-state">No public study sessions for this selection yet.</p>
      ) : (
        <div className="table-scroll">
          <table className="leaderboard-table">
            <thead><tr><th scope="col">Rank</th><th scope="col">Username</th><th scope="col">Hours</th><th scope="col">Sessions</th></tr></thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.user_id} className={String(row.user_id) === String(userId) ? "current-user-row" : ""}>
                  <th scope="row">{index + 1}</th>
                  <td>{row.username || "Student"}{String(row.user_id) === String(userId) && <span className="current-user-label">You</span>}</td>
                  <td>{Number(row.total_hours || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td>{Number(row.sessions || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
