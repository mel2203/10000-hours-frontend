import { Link } from "react-router-dom";

//post card component to display a single post
export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <header className="post-header">
        <div className="post-author">
          <span className="post-avatar" aria-hidden="true">
            {(post.username || "Unknown").charAt(0).toUpperCase()}
          </span>
          <div>
            <Link className="post-author-name" to={`/profile/${post.user_id}`}>
              {post.username || "Unknown"}
            </Link>
            <p className="post-meta">
              <span className="post-date">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span
                className={`visibility-badge ${
                  String(post.visibility).toLowerCase() === "public"
                    ? "visibility-public"
                    : "visibility-friends"
                }`}
              >
                {post.visibility}
              </span>
            </p>
          </div>
        </div>
        <h3 className="post-title">{post.title}</h3>
      </header>
      <p className="post-content">{post.content}</p>
      {post.image_url && (
        <img className="post-image" src={post.image_url} alt={post.title} width="300" />
      )}
    </article>
  );
}

//post includes : profile picture, username, title, content, image, visibility, created_at
