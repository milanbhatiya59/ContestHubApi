import axios from "axios";

// Configuration variables
const HOST = "localhost"; // Not used in the final output
const RID = -1; // Not used in the final output
const TIMEZONE = "Asia/Kolkata"; // IANA timezone for India (for reference)

// Helper function to format the date
function formatDate(epochSeconds) {
  // Convert epoch seconds to a Date object (assumes the timestamp is in seconds)
  const date = new Date(epochSeconds * 1000);

  // Extract hour and minute
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12; // handle midnight (0 becomes 12)

  // Format minutes to always have two digits
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  // Get day, month and year
  const day = date.getDate();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  // Return formatted string like "8:00 AM 15-March-2025"
  return `${hours}:${minutesStr} ${ampm} ${day}-${monthName}-${year}`;
}

async function fetchContests() {
  const url = "https://leetcode.com/graphql";
  const query = `
{
  brightTitle
  allContests {
    containsPremium
    title
    cardImg
    titleSlug
    description
    startTime
    duration
    originStartTime
    isVirtual
    company {
      watermark
      __typename
    }
    __typename
  }
}`;

  const postData = {
    operationName: null,
    variables: {},
    query: query,
  };

  try {
    const response = await axios.post(url, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = response.data;

    // Validate that the contest data exists
    if (!json.data || !json.data.allContests) {
      console.warn("Error: Missing contest data", JSON.stringify(json));
      return;
    }

    // Process and format each contest's details
    const contests = json.data.allContests.map((c) => ({
      name: c.title,
      start_time: formatDate(c.originStartTime),
      duration: c.duration / 60.0, // Convert duration from seconds to minutes
    }));

    // Output the list of contests
    console.log(contests);
  } catch (error) {
    console.error("Error fetching contests:", error);
  }
}

fetchContests();
