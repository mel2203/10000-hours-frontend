import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPosts, getSkills } from "../api";
import PostCard from "../components/PostCard";
import StatsPanel from "../components/StatsPanel";

export default function Feed() {
  const { refreshKey } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [refreshKey]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const visiblePosts = selectedSkill
    ? posts.filter((post) => post.skill === selectedSkill)
    : posts;

  return (
    <div className="page-shell feed-page">
      <section className="feed-main">
        <h1 className="page-title">Study Progress</h1>
        <section className="welcome-board" aria-labelledby="welcome-title">
          <h2 id="welcome-title">Welcome to 10,000 Hours</h2>
          <p>
            We’re a community of learners who show up, practice with purpose,
            and keep track of their progress. Inspired by the 10,000-hour idea,
            we believe mastery grows through deliberate practice, one focused
            session at a time.
          </p>
        </section>
        {skillsError && (
          <p className="state-message error-state" role="alert">
            Could not load skill filters: {skillsError}
          </p>
        )}
        {skillsLoading && (
          <p className="muted-copy" aria-live="polite">
            Loading skill filters...
          </p>
        )}
        {!skillsLoading && !skillsError && skills.length === 0 && (
          <p className="muted-copy">No skills are available to filter yet.</p>
        )}
        <div className="skill-filters" aria-label="Filter posts by skill">
          <button
            type="button"
            className={`filter-chip ${selectedSkill === "" ? "active" : ""}`}
            aria-pressed={selectedSkill === ""}
            onClick={() => setSelectedSkill("")}
          >
            All
          </button>
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              className={`filter-chip ${selectedSkill === skill ? "active" : ""}`}
              aria-pressed={selectedSkill === skill}
              onClick={() => setSelectedSkill(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
        <div className="post-list">
          {visiblePosts.length === 0 ? (
            <p className="state-message empty-state">
              {selectedSkill
                ? `No ${selectedSkill} posts yet. Your next study session can start the list.`
                : "No progress posts yet. Share your first study session to get started."}
            </p>
          ) : (
            visiblePosts.map((post) => (
              <PostCard key={post.post_id} post={post} />
            ))
          )}
        </div>
      </section>
      <aside className="feed-stats">
        <StatsPanel refreshKey={refreshKey} />
      </aside>
    </div>
  );
}
