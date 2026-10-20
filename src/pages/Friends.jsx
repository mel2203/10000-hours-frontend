import { useState } from "react";
import { Link } from "react-router-dom";
import useFriends from "../hooks/useFriends";
import { searchProfiles } from "../api";

export default function Friends() {
  const {
    friends,
    requests,
    loading,
    error,
    busyId,
    statusOf,
    send,
    accept,
    remove,
  } = useFriends();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searchError, setSearchError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setSearchError("");
    try {
      setResults(await searchProfiles(query.trim()));
    } catch (err) {
      setResults(null);
      setSearchError(err.message);
    }
  }

  // the right button or label for a person, depending on how we're connected
  function renderAction(id) {
    const status = statusOf(id);
    const busy = busyId === id;
    if (status === "friends") return <span>Friends</span>;
    if (status === "sent") return <span>Request sent</span>;
    if (status === "incoming") {
      return (
        <button type="button" onClick={() => accept(id)} disabled={busy}>
          Accept
        </button>
      );
    }
    return (
      <button type="button" onClick={() => send(id)} disabled={busy}>
        Add friend
      </button>
    );
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="friends-page">
      <h1>Friends</h1>
      {error && <p role="alert">{error}</p>}

      <section className="friend-section">
        <h2>Find people</h2>
        <form onSubmit={handleSearch}>
          <label htmlFor="friend-search">Search by username</label>
          <input
            id="friend-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. meilin"
            minLength={2}
            required
          />
          <button type="submit">Search</button>
        </form>
        {searchError && <p role="alert">{searchError}</p>}
        {results && results.length === 0 && <p>No one found with that name.</p>}
        {results &&
          results.map((person) => (
            <div className="friend-row" key={person.user_id}>
              <div>
                <Link to={`/profile/${person.user_id}`}>{person.username}</Link>
                {person.city && <span> · {person.city}</span>}
              </div>
              <div className="friend-actions">
                {renderAction(person.user_id)}
              </div>
            </div>
          ))}
      </section>

      <section className="friend-section">
        <h2>Friend requests</h2>
        {requests.length === 0 && <p>No pending requests.</p>}
        {requests.map((person) => (
          <div className="friend-row" key={person.user_id}>
            <div>
              <Link to={`/profile/${person.user_id}`}>{person.username}</Link>
              {person.city && <span> · {person.city}</span>}
            </div>
            <div className="friend-actions">
              <button
                type="button"
                onClick={() => accept(person.user_id)}
                disabled={busyId === person.user_id}
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => remove(person.user_id)}
                disabled={busyId === person.user_id}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="friend-section">
        <h2>Your friends ({friends.length})</h2>
        {friends.length === 0 && (
          <p>No friends yet. Search for someone above to send a request.</p>
        )}
        {friends.map((person) => (
          <div className="friend-row" key={person.user_id}>
            <div>
              <Link to={`/profile/${person.user_id}`}>{person.username}</Link>
              {person.city && <span> · {person.city}</span>}
              {person.bio && <p>{person.bio}</p>}
            </div>
            <div className="friend-actions">
              <button
                type="button"
                onClick={() => remove(person.user_id)}
                disabled={busyId === person.user_id}
              >
                Unfriend
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
