import { useCallback, useEffect, useState } from "react";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} from "../api";

export default function useFriends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]); // requests other people sent to me
  const [sentIds, setSentIds] = useState([]); // requests I sent this session
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [friendList, requestList] = await Promise.all([getFriends(), getFriendRequests()]);
      setFriends(friendList);
      setRequests(requestList);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // run an action for one person, then reload both lists
  async function act(friendId, action) {
    setBusyId(friendId);
    setError("");
    try {
      await action(friendId);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function send(friendId) {
    setBusyId(friendId);
    setError("");
    try {
      await sendFriendRequest(friendId);
      setSentIds((ids) => [...ids, friendId]);
    } catch (err) {
      // the backend refuses duplicates, which means a request is already pending
      if (err.message === "Friend request already exists") {
        setSentIds((ids) => [...ids, friendId]);
      } else {
        setError(err.message);
      }
    } finally {
      setBusyId(null);
    }
  }

  function statusOf(id) {
    if (friends.some((f) => f.user_id === id)) return "friends";
    if (requests.some((r) => r.user_id === id)) return "incoming";
    if (sentIds.includes(id)) return "sent";
    return "none";
  }

  return {
    friends,
    requests,
    loading,
    error,
    busyId,
    statusOf,
    send,
    accept: (id) => act(id, acceptFriendRequest),
    remove: (id) => act(id, removeFriend),
  };
}