import axios from "axios";
import { URL } from "url";

// --- Configuration ---
const config = {
  URL: "https://www.codechef.com", // CodeChef base URL
  HOST: "www.codechef.com", // Host name
  RID: -1, // Some identifier (not used in output)
};

// Global array to store contest objects
let contests = [];

// Helper function to format date/time in IST
function formatToIST(utcDateString) {
  const date = new Date(utcDateString);
  return date
    .toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(",", ""); // Remove unwanted comma
}

// Function to calculate duration between start and end times
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Fetch data from an API
async function httpGet(url, headers = {}) {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

// Parse contest data from the CodeChef API (Future, Present, Last 50 Past)
async function parseFromJson() {
  const urlObj = new URL(config.URL);
  const urlSchemeHost = `${urlObj.protocol}//${urlObj.host}`;

  const times = ["present", "future", "past"]; // Fetch all contests
  let pastCount = 0;
  const maxPastContests = 100;

  for (const time of times) {
    let offset = 0;
    const limit = 20;
    while (true) {
      const apiUrl = `${urlSchemeHost}/api/list/contests/${time}?sort_by=START&sorting_order=desc&offset=${offset}&mode=all`;
      const data = await httpGet(apiUrl);
      if (!data || !data.contests) break;

      for (const c of data.contests) {
        if (time === "past" && pastCount >= maxPastContests) break; // Stop when we reach 50 past contests

        contests.push({
          name: c.contest_name,
          start_time: formatToIST(c.contest_start_date_iso),
          duration: calculateDuration(c.contest_start_date_iso, c.contest_end_date_iso),
        });

        if (time === "past") pastCount++;
      }
      offset += limit;
      if (data.contests.length !== limit || (time === "past" && pastCount >= maxPastContests))
        break; // Stop fetching past contests early
    }
  }
}

// Main function
async function main() {
  await parseFromJson();
  console.log(contests); // Output the final result
}

main();
