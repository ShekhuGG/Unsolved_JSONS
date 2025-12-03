// src/components/NoteModal.js

import React, { useState, useEffect } from "react";

export default function NoteModal({ open, initialNote, onClose, onSave }) {
    const [note, setNote] = useState("");

    useEffect(() => {
        setNote(initialNote || "");
    }, [initialNote]);

    if (!open) return null;

    return (
        <div className="note-modal-overlay">
            <div className="note-modal">
                <h3 style={{ marginBottom: "10px" }}>Add / Edit Note</h3>

                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <div className="modal-buttons">
                    <button className="action-btn" onClick={onClose}>Cancel</button>
                    <button className="action-btn" onClick={() => onSave(note)}>Save</button>
                </div>
            </div>
        </div>
    );
}
