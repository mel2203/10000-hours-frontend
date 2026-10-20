import { useEffect, useState } from "react";
import { createPost, getSkills, uploadImage } from "../api";

const MAX_SIZE = 5 * 1024 * 1024; // matches the backend limit

export default function NewPostModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    visibility: "Public",
    skill: "",
    hours: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        skill: form.skill,
        hours: Number(form.hours),
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
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <label htmlFor="post-content">Content</label>
          <textarea
            id="post-content"
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            required
          />
          <label htmlFor="post-skill">Skill</label>
          <select
            id="post-skill"
            name="skill"
            value={form.skill}
            onChange={handleChange}
            required
            disabled={skillsLoading || Boolean(skillsError)}
          >
            <option value="">{skillsLoading ? "Loading skills..." : skills.length === 0 && !skillsError ? "No skills available" : "Select a skill"}</option>
            {skills.map((skill) => <option key={skill} value={skill}>{skill}</option>)}
          </select>
          {skillsError && <p className="error-text">Could not load skills: {skillsError}</p>}
          <label htmlFor="post-hours">Hours studied</label>
          <input
            id="post-hours"
            name="hours"
            type="number"
            min="0.25"
            max="24"
            step="0.25"
            value={form.hours}
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
          <button type="submit" disabled={submitting || skillsLoading || Boolean(skillsError) || skills.length === 0}>
            {submitting ? "Posting..." : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
