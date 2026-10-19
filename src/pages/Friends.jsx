import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { acceptFriendRequest, getFriendRequests, getFriends, removeFriend } from "../api";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [friendList, requestList] = await Promise.all([getFriends(), getFriendRequests()]);
      setFriends(friendList);
      setRequests(requestList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  async function handleRequestAction(person, action) {
    setBusyId(person.user_id);
    setActionError("");
    try {
      if (action === "accept") await acceptFriendRequest(person.user_id);
      else await removeFriend(person.user_id);
      await loadFriends();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="page-shell friends-page">
      <header className="friends-heading">
        <h1 className="page-title">Friends</h1>
        <p className="page-intro">Stay connected with people who share your learning journey.</p>
      </header>
      {loading ? (
        <p className="state-message loading-state" aria-live="polite">Loading friends...</p>
      ) : error ? (
        <p className="state-message error-state" role="alert">Could not load friends: {error}</p>
      ) : (
        <>
          {actionError && <p className="state-message error-state" role="alert">{actionError}</p>}
          <section className="friends-section">
            <h2 className="section-title">Friend requests</h2>
            {requests.length === 0 ? (
              <p className="state-message empty-state">You’re all caught up. New requests will appear here.</p>
            ) : (
              <ul className="people-list">
                {requests.map((person) => (
                  <li className="person-row" key={person.user_id}>
                    <div>
                      <Link to={`/profile/${person.user_id}`} className="person-name">{person.username || "Student"}</Link>
                      {person.city && <p className="person-detail">{person.city}</p>}
                    </div>
                    <div className="person-actions">
                      <button type="button" onClick={() => handleRequestAction(person, "accept")} disabled={busyId === person.user_id}>{busyId === person.user_id ? "Working..." : "Accept"}</button>
                      <button type="button" className="secondary-button" onClick={() => handleRequestAction(person, "decline")} disabled={busyId === person.user_id}>Decline</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="friends-section">
            <h2 className="section-title">Your friends</h2>
            {friends.length === 0 ? (
              <p className="state-message empty-state">No friends yet. Visit a learner’s profile to send a request.</p>
            ) : (
              <ul className="people-list">
                {friends.map((person) => (
                  <li className="person-row" key={person.user_id}>
                    <div>
                      <Link to={`/profile/${person.user_id}`} className="person-name">{person.username || "Student"}</Link>
                      {person.city && <p className="person-detail">{person.city}</p>}
                    </div>
                    <button type="button" className="secondary-button" onClick={() => handleRequestAction(person, "remove")} disabled={busyId === person.user_id}>{busyId === person.user_id ? "Working..." : "Remove"}</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
