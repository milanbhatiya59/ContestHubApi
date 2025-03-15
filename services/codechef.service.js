import axios from "axios";
import { URL } from "url";

const config = {
  URL: "https://www.codechef.com",
  HOST: "www.codechef.com",
  RID: -1,
};

function formatToIST(utcDateString) {
  const date = new Date(utcDateString);
  const options = {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  const formattedDate = date.toLocaleString("en-IN", options);
  return formattedDate.replace("at ", "").replace("pm", "PM").replace("am", "AM");
}

function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.floor((end - start) / (1000 * 60));
}

async function httpGet(url, headers = {}) {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function fetchPastCodechefContests() {
  const contests = await fetchCodeChefContests("past", 1000);
  return contests
    .filter((contest) => contest.name.includes("Starters "))
    .map((contest) => {
      const match = contest.name.match(/Starters (\d+)/);
      const startersNumber = match ? match[1] : "";
      return {
        ...contest,
        youtube_tutorial: "",
        url: `https://codechef.com/START${startersNumber}`,
      };
    });
}

async function fetchCurrentAndUpcomingCodechefContests() {
  const presentContests = await fetchCodeChefContests("present");
  const futureContests = await fetchCodeChefContests("future");
  const contests = [...presentContests, ...futureContests];
  return contests
    .filter((contest) => contest.name.includes("Starters "))
    .map((contest) => {
      const match = contest.name.match(/Starters (\d+)/);
      const startersNumber = match ? match[1] : "";
      return {
        ...contest,
        youtube_tutorial: "",
        url: `https://codechef.com/START${startersNumber}`,
      };
    });
}

async function fetchCodeChefContests(time, maxPastContests = null) {
  const urlObj = new URL(config.URL);
  const urlSchemeHost = `${urlObj.protocol}//${urlObj.host}`;

  let contests = [];
  let pastCount = 0;
  let offset = 0;
  const limit = 20;

  while (true) {
    const apiUrl = `${urlSchemeHost}/api/list/contests/${time}?sort_by=START&sorting_order=desc&offset=${offset}&mode=all`;
    const data = await httpGet(apiUrl);
    if (!data || !data.contests) break;

    for (const c of data.contests) {
      if (time === "past" && pastCount >= maxPastContests) break;

      contests.push({
        platform: "CodeChef",
        name: c.contest_name,
        start_time: formatToIST(c.contest_start_date_iso),
        duration: calculateDuration(c.contest_start_date_iso, c.contest_end_date_iso),
      });

      if (time === "past") pastCount++;
    }
    offset += limit;
    if (data.contests.length !== limit || (time === "past" && pastCount >= maxPastContests)) break;
  }
  return contests;
}

export { fetchCurrentAndUpcomingCodechefContests, fetchPastCodechefContests };
