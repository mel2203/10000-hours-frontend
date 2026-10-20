import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getProfile, getPosts, sendFriendRequest, updateProfile, uploadImage } from "../api";
import PostCard from "../components/PostCard";
import StatsPanel from "../components/StatsPanel";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: "", bio: "", city: "", avatar_url: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [friendRequestState, setFriendRequestState] = useState("");
  const [actionError, setActionError] = useState("");
  const { refreshKey } = useOutletContext();
  const { userId } = useAuth();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const profileData = await getProfile(id);
        const allPosts = await getPosts();
        setProfile(profileData);
        setProfileForm({ username: profileData.username || "", bio: profileData.bio || "", city: profileData.city || "", avatar_url: profileData.avatar_url || "" });
        setPosts(allPosts.filter((p) => p.user_id === Number(id)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id, refreshKey]);

  useEffect(() => {
    if (!avatarPreview) return undefined;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const isOwnProfile = String(id) === String(userId);

  function handleProfileChange(event) {
    setProfileForm({ ...profileForm, [event.target.name]: event.target.value });
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setActionError("");
    if (file.size > 5 * 1024 * 1024) {
      setActionError("Choose a profile picture smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleProfileSave(event) {
    event.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      const avatarUrl = avatarFile ? await uploadImage(avatarFile) : profileForm.avatar_url;
      const updatedProfile = await updateProfile({ ...profileForm, avatar_url: avatarUrl });
      setProfile(updatedProfile);
      setAvatarFile(null);
      setAvatarPreview("");
      setEditing(false);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleFriendRequest() {
    setFriendRequestState("sending");
    setActionError("");
    try {
      await sendFriendRequest(id);
      setFriendRequestState("sent");
    } catch (err) {
      setFriendRequestState("");
      setActionError(err.message);
    }
  }

  if (loading) return <p className="state-message loading-state">Loading...</p>;
  if (error) return <p className="state-message error-state">{error}</p>;

  return (
    <main className="page-shell profile-page">
      <section className="profile-card">
        {editing ? (
          <form className="profile-edit-form" onSubmit={handleProfileSave}>
            <h1 className="page-title">Edit profile</h1>
            <div className="profile-avatar-editor">
              {avatarPreview || profile.avatar_url ? (
                <img className="profile-avatar-image" src={avatarPreview || profile.avatar_url} alt="Profile preview" />
              ) : (
                <span className="profile-avatar-fallback" aria-hidden="true">{(profile.username || "?").charAt(0).toUpperCase()}</span>
              )}
              <div>
                <label htmlFor="profile-avatar">Profile picture</label>
                <input id="profile-avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handleAvatarChange} />
                <p className="profile-avatar-help">Choose a JPG, PNG, WebP, GIF, or AVIF image.</p>
              </div>
            </div>
            <label htmlFor="profile-username">Username</label>
            <input id="profile-username" name="username" value={profileForm.username} onChange={handleProfileChange} required />
            <label htmlFor="profile-bio">Bio</label>
            <textarea id="profile-bio" name="bio" value={profileForm.bio} onChange={handleProfileChange} rows="4" />
            <label htmlFor="profile-city">City</label>
            <input id="profile-city" name="city" value={profileForm.city} onChange={handleProfileChange} />
            {actionError && <p className="profile-action-error" role="alert">{actionError}</p>}
            <div className="profile-actions">
              <button type="submit" disabled={saving}>{saving ? (avatarFile ? "Uploading..." : "Saving...") : "Save profile"}</button>
              <button type="button" className="secondary-button" onClick={() => { setEditing(false); setActionError(""); setAvatarFile(null); setAvatarPreview(""); setProfileForm({ username: profile.username || "", bio: profile.bio || "", city: profile.city || "", avatar_url: profile.avatar_url || "" }); }}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-card-heading">
              <div className="profile-avatar-display">
                {profile.avatar_url ? (
                  <img className="profile-avatar-image" src={profile.avatar_url} alt={`${profile.username}'s profile`} />
                ) : (
                  <span className="profile-avatar-fallback" aria-hidden="true">{(profile.username || "?").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h1 className="page-title">{profile.username}</h1>
                {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                {profile.city && <p className="profile-city">{profile.city}</p>}
              </div>
              {isOwnProfile ? (
                <button type="button" className="secondary-button" onClick={() => { setEditing(true); setActionError(""); }}>Edit profile</button>
              ) : (
                <button type="button" onClick={handleFriendRequest} disabled={friendRequestState !== ""}>
                  {friendRequestState === "sent" ? "Request sent" : friendRequestState === "sending" ? "Sending..." : "Add friend"}
                </button>
              )}
            </div>
            {actionError && <p className="profile-action-error" role="alert">{actionError}</p>}
          </>
        )}
      </section>
      {isOwnProfile && <StatsPanel refreshKey={refreshKey} showBySkill />}
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
