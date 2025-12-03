// src/api.js

const OWNER = "ShekhuGG";
const REPO = "Unsolved_JSONS";
const BRANCH = "main";
// Your personal access token
let GITHUB_TOKEN = localStorage.getItem("GITHUB_TOKEN");
console.log("Fetched Token for API.js : ", GITHUB_TOKEN, GITHUB_TOKEN == null);
if (!GITHUB_TOKEN) {
    GITHUB_TOKEN = prompt("Kindly Enter The Access Token");
    localStorage.setItem("GITHUB_TOKEN", GITHUB_TOKEN);
    console.log("TOKEN : ", GITHUB_TOKEN)
}

// ----------------------------------------------
// NEW — Build file path dynamically per user
// ----------------------------------------------
export function getFilePathForUser(username) {
    if (!username || username.trim() === "") {
        throw new Error("Username missing for file path.");
    }
    return `user_${username}.json`;   // Each user gets separate file
}


// Base64 helpers
function encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}
function decode(str) {
    return decodeURIComponent(escape(atob(str)));
}


// --------------------------------------------------
// STEP 1 — Fetch file + SHA (Now uses dynamic path)
// --------------------------------------------------
export async function fetchProblemsFile(username) {
    const FILE_PATH = getFilePathForUser(username);
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });

    if (res.status === 404) {
        // File does NOT exist → create empty structure
        return {
            sha: null,
            json: { problems: [] }
        };
    }

    const data = await res.json();
    const content = decode(data.content);

    return {
        sha: data.sha,
        json: JSON.parse(content)
    };
}


// --------------------------------------------------
// STEP 2 — Upload new JSON (Uses dynamic path)
// --------------------------------------------------
export async function uploadProblemsFile(newJson, sha, username) {
    const FILE_PATH = getFilePathForUser(username);
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    const body = {
        message: `Updated from LetSolver Dashboard (user: ${username})`,
        content: encode(JSON.stringify(newJson, null, 2)),
        branch: BRANCH,
    };

    if (sha) body.sha = sha;  // Required for updating

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return res.json();
}
