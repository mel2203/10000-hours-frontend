import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPosts } from "../api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const { refreshKey } = useOutletContext();
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
  }, [refreshKey]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Study Progress</h1>
      {posts.length === 0 && <p>No progress posts yet.</p>}
      {posts.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}
    </div>
  );
}
