import { useEffect, useState } from "react";
import { createPost, uploadImage } from "../api";

const MAX_SIZE = 5 * 1024 * 1024; // matches the backend limit

export default function NewPostModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    visibility: "Public",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // close the popup when Escape is pressed
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // free the preview URL when it changes or the popup closes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e) {
    const chosen = e.target.files[0];
    if (!chosen) return;
    if (chosen.size > MAX_SIZE) {
      setError("Image must be 5 MB or smaller");
      e.target.value = "";
      return;
    }
    setError("");
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const image_url = file ? await uploadImage(file) : null;
      await createPost({
        title: form.title,
        content: form.content,
        visibility: form.visibility,
        image_url,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-post-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="new-post-title">New Post</h2>
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
          <label htmlFor="photo">Photo (optional)</label>
          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webpimage/gif,image/avif"
            onChange={handleFile}
          />
          {preview && (
            <img
              src={preview}
              alt="Selected preview"
              className="modal-preview"
            />
          )}
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
          {error && <p>{error}</p>}
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
