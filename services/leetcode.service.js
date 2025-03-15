import axios from "axios";

const formatDate = (epochSeconds) => {
  const date = new Date(epochSeconds * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
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
  return `${day} ${monthName} ${year} ${hours}:${minutesStr} ${ampm}`;
};

const fetchLeetCodeContests = async () => {
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
    if (!json.data || !json.data.allContests) {
      console.warn("Error: Missing contest data", JSON.stringify(json));
      return [];
    }

    return json.data.allContests.map((c) => ({
      platform: "LeetCode",
      name: c.title,
      start_time: formatDate(c.originStartTime),
      duration: c.duration / 60.0,
    }));
  } catch (error) {
    console.error("Error fetching contests:", error);
    return [];
  }
};

const fetchPastLeetCodeContests = async () => {
  const contests = await fetchLeetCodeContests();
  const now = Date.now() / 1000;
  return contests
    .filter((contest) => new Date(contest.start_time).getTime() / 1000 < now)
    .slice(0, 100)
    .map((contest) => ({
      ...contest,
      youtube_tutorial: "",
      url: `https://leetcode.com/contest/${contest.name.toLowerCase().replace(/ /g, "-")}`,
    }));
};

const fetchCurrentAndUpcomingLeetCodeContests = async () => {
  const contests = await fetchLeetCodeContests();
  const now = Date.now() / 1000;
  return contests
    .filter((contest) => new Date(contest.start_time).getTime() / 1000 >= now)
    .map((contest) => ({
      ...contest,
      youtube_tutorial: "",
      url: `https://leetcode.com/contest/${contest.name.toLowerCase().replace(/ /g, "-")}`,
    }));
};

export { fetchCurrentAndUpcomingLeetCodeContests, fetchPastLeetCodeContests };
