import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { googleLogin } from "../api";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    // StrictMode runs effects twice in development, so only run once
    if (started.current) return;
    started.current = true;

    async function finishLogin() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !data.session) {
          throw new Error("Google sign-in failed. Please try again.");
        }
        const result = await googleLogin(data.session.access_token);
        saveAuth(result.token, result.user_id);
        await supabase.auth.signOut({ scope: "local" }); // we use our own token from here
        navigate("/", { replace: true });
      } catch (err) {
        setError(err.message);
      }
    }
    finishLogin();
  }, [navigate, saveAuth]);

  if (error) return <p>{error}</p>;
  return <p>Signing you in...</p>;
}
