import { useEffect, useState } from "react";
import { getPosts, createPost } from "../api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: "",
    visibility: "Public",
  });
  const [formError, setFormError] = useState("");

  //for posting a new progress
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    try {
      await createPost({
        title: form.title,
        content: form.content,
        visibility: form.visibility,
        image_url: form.image_url || null,
      });
      setForm({ title: "", content: "", image_url: "", visibility: "Public" });
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setFormError(err.message);
    }
  }

  //load posts
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
            No progress posts yet. Share your progress here and update your
            hours
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            required
          />
          <input
            name="image_url"
            placeholder="Image URL (optional)"
            value={form.image_url}
            onChange={handleChange}
          />
          <label htmlFor="visibility">Visibility</label>
          <select
            id="visibility"
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
          >
            <option value="Public">Public</option>
            <option value="Friends-Only">Friends-Only</option>
          </select>
          <button type="submit">Post</button>
          {formError && <p>{formError}</p>}
        </form>
        {posts.map((post) => (
          <PostCard key={post.post_id} post={post} />
        ))}
      </section>
    </main>
  );
}
