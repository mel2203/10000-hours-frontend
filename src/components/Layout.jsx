import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import NewPostModal from "./NewPostModal";

export default function Layout() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="layout">
      <Navbar onNewPost={() => setShowModal(true)} />
      <main className="content">
        <Outlet context={{ refreshKey }} />
      </main>
      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onCreated={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
