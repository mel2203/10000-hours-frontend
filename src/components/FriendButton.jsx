import useFriends from "../hooks/useFriends";
import { useAuth } from "../context/AuthContext";

export default function FriendButton({ profileUserId }) {
  const { userId } = useAuth();
  const { loading, error, busyId, statusOf, send, accept, remove } =
    useFriends();

  // no button on your own profile
  if (Number(userId) === profileUserId || loading) return null;

  const status = statusOf(profileUserId);
  const busy = busyId === profileUserId;

  return (
    <div className="friend-actions">
      {status === "none" && (
        <button
          type="button"
          onClick={() => send(profileUserId)}
          disabled={busy}
        >
          Add friend
        </button>
      )}
      {status === "sent" && (
        <button type="button" disabled>
          Request sent
        </button>
      )}
      {status === "incoming" && (
        <button
          type="button"
          onClick={() => accept(profileUserId)}
          disabled={busy}
        >
          Accept request
        </button>
      )}
      {status === "friends" && (
        <button
          type="button"
          onClick={() => remove(profileUserId)}
          disabled={busy}
        >
          Unfriend
        </button>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
