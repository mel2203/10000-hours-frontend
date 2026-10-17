import { useEffect, useState } from "react";
import { getPosts } from "../api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <p className="state-message loading-state">Loading...</p>;
  if (error) return <p className="state-message error-state">{error}</p>;

  return (
    <main className="page-shell feed-page">
      <header className="page-heading">
        <h1 className="page-title">Study Progress</h1>
        <p className="page-intro">See what everyone has been working on.</p>
      </header>
      <section className="post-list">
        {posts.length === 0 && (
          <p className="state-message empty-state">
            No progress posts yet. Share your progress here and update your hours
          </p>
        )}
        {posts.map((post) => (
          <PostCard key={post.post_id} post={post} />
        ))}
      </section>
    </main>
  );
}
