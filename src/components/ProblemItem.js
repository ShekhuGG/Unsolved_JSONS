import React from "react";

/**
 * ProblemItem
 * Props:
 *  - problem: { problem, link, tags, status, rating, addedAt, note }
 *  - onMark(problem)
 *  - onDelete(problem)
 *  - onNote(problem)
 */
export default function ProblemItem({ problem, onMark, onDelete, onNote }) {
    const isResolved = problem.status === "resolved";

    // rating to color with ~12 discrete steps between 800 and 3000
    const ratingToColor = (rating) => {
        if (rating == null || isNaN(rating)) return "var(--rating-gray)";
        const min = 800;
        const max = 3000;
        const clamped = Math.max(min, Math.min(max, Number(rating)));
        const t = (clamped - min) / (max - min); // 0..1
        const steps = 11; // gives 12 levels (0..11)
        const step = Math.round(t * steps);
        // Hue: 120 (green) -> 0 (red)
        const hue = Math.round(120 - (step * (120 / steps)));
        // use HSL for pleasant color
        return `hsl(${hue} 75% 40%)`;
    };

    // format addedAt to "12 Jan 2025 / 2pm" with smaller year
    const formatAddedAt = (addedAt) => {
        if (!addedAt) return "";
        const d = typeof addedAt === "number" || /^\d+$/.test(addedAt)
            ? new Date(Number(addedAt))
            : new Date(addedAt);

        if (isNaN(d.getTime())) return "";

        const day = d.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[d.getMonth()];
        const year = d.getFullYear();

        // 12-hour time and am/pm
        let hour = d.getHours();
        const minute = d.getMinutes();
        const isPM = hour >= 12;
        hour = hour % 12;
        if (hour === 0) hour = 12;
        const minuteStr = minute === 0 ? "" : `:${String(minute).padStart(2, "0")}`;
        const meridiem = isPM ? "pm" : "am";

        // e.g. "12 Jan " + <small>2025</small> + " / 2pm"
        return {
            main: `${day} ${month} `,
            year: String(year),
            time: ` / ${hour}${minuteStr}${meridiem}`
        };
    };

    const added = formatAddedAt(problem.addedAt);

    const rating = problem.rating ?? null;
    const ratingColor = ratingToColor(rating);
    const val = rating != null ? rating : "";

    return (
        <div className="problem-card">
            <div style={{ display: "flex", columnGap: 12, alignItems: "flex-start" }}>
                <div
                    className={`solve-btn ${isResolved ? "solved" : ""}`}
                    onClick={() => onMark(problem)}
                >
                    {isResolved ? "✓" : ""}
                </div>

                <div style={{ minWidth: 0 }}>
                    <a
                        href={problem.link}
                        className="problem-title"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {problem.problem}
                    </a>

                    <div className="problem-tags">
                        {problem.tags?.join(", ")}
                    </div>

                    {/* {problem.note && (
                        <div className="note-box">{problem.note}</div>
                    )} */}

                    {added && (
                        <div className="added-at">
                            <span>{added.main}</span>
                            <span className="added-year">{added.year}</span>
                            <span>{added.time}</span>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {/* Rating at rightmost, left to Note button */}
                {problem.note && (
                    <div className="note-box">{problem.note}</div>
                )}
                {(
                    <div
                        className={rating != null ? "rating-pill" : "rating-none"}
                        title={`Rating: ${rating}`}
                        style={{ color: ratingColor, borderColor: ratingColor }}
                    >
                        {val}
                    </div>
                )}
                {/* {rating !== null && (
                    <div
                        className="rating-pill"
                        title={`Rating: ${rating}`}
                        style={{ color: ratingColor, borderColor: ratingColor }}
                    >
                        *{rating}
                    </div>
                )} */}

                <button className="action-btn" onClick={() => onNote(problem)}>
                    Note
                </button>

                <button className="action-btn delete" onClick={() => onDelete(problem)}>
                    Delete
                </button>
            </div>
        </div>
    );
}
