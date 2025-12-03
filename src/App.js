// src/App.js
import React, { useEffect, useReducer, useRef, useState } from "react";
import ProblemItem from "./components/ProblemItem";
import NoteModal from "./components/NoteModal";
import { fetchProblemsFile, uploadProblemsFile } from "./api";
import background from './assets/background3.jpg';
import "./App.css";

export default function App() {
  const [problems, setProblems] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [sha, setSha] = useState(null);
  const [loading, setLoading] = useState(true);

  const [noteModal, setNoteModal] = useState({ open: false, problem: null });
  const username = useRef("");

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      username.current = params.get("user");

      const { sha, json } = await fetchProblemsFile(username.current);

      // const { sha, json } = await fetchProblemsFile();
      setSha(sha);
      setProblems(json.problems || []);
      setDeleted(json.deleted || []);
    } catch (e) {
      alert("GitHub Error: " + e.message, username);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // ---- MARK SOLVED ----
  async function handleMark(problem) {
    const now = problem.status === "resolved" ? "unsolved" : "resolved";
    const updated = problems.map(p =>
      p.problem === problem.problem
        ? { ...p, status: now }
        : p
    );

    await uploadProblemsFile(
      { problems: updated, deleted },
      sha, username.current
    );
    load();
  }

  // ---- DELETE ----
  async function handleDelete(problem) {
    const remaining = problems.filter(p => p.problem !== problem.problem);
    const deletedNew = [...deleted, problem];

    await uploadProblemsFile(
      { problems: remaining, deleted: deletedNew },
      sha
    );
    load();
  }

  // ---- OPEN NOTE ----
  function openNote(problem) {
    setNoteModal({ open: true, problem });
  }

  // ---- SAVE NOTE ----
  async function saveNote(noteText) {
    const updated = problems.map(p =>
      p.problem === noteModal.problem.problem
        ? { ...p, note: noteText }
        : p
    );

    await uploadProblemsFile(
      { problems: updated, deleted },
      sha
    );

    setNoteModal({ open: false, problem: null });
    load();
  }

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <div class="welcome-box">
        <span class="welcome-text">Welcome,</span>
        <span class="welcome-username" id="username">{username.current.toUpperCase()}</span>
      </div>

      <div className="inner">
        <h1>LetSolver Dashboard</h1>
        {loading && <p>Loading...</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {problems.map(p => (
            <ProblemItem
              key={p.problem}
              problem={p}
              onMark={handleMark}
              onDelete={handleDelete}
              onNote={openNote}
            />
          ))}
        </div>
      </div>

      <NoteModal
        open={noteModal.open}
        initialNote={noteModal.problem?.note}
        onClose={() => setNoteModal({ open: false, problem: null })}
        onSave={saveNote}
      />
    </div>
  );
}
