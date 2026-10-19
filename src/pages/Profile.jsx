import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getProfile, getPosts } from "../api";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { refreshKey } = useOutletContext();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const profileData = await getProfile(id);
        const allPosts = await getPosts();
        setProfile(profileData);
        setPosts(allPosts.filter((p) => p.user_id === Number(id)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id, refreshKey]);

  if (loading) return <p className="state-message loading-state">Loading...</p>;
  if (error) return <p className="state-message error-state">{error}</p>;

  return (
    <main className="page-shell profile-page">
      <section className="profile-card">
        <h1 className="page-title">{profile.username}</h1>
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        {profile.city && <p className="profile-city">{profile.city}</p>}
      </section>
      <section className="post-list">
        <h2 className="section-title">Study Journey</h2>
        {posts.length === 0 && (
          <p className="state-message empty-state">No posts yet.</p>
        )}
        {posts.map((post) => (
          <PostCard key={post.post_id} post={post} />
        ))}
      </section>
    </main>
  );
}
