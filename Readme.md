# Contest Hub

## Quick Links

- **Fronend GitHub Repository:**  
  [ContestHubApi](https://github.com/milanbhatiya59/ContestHub)

- **Deployment Links:**  
  - **Frontend:** [ContestHub](https://contesthub.onrender.com)  
  - **Backend:** [ContestHub API](https://contesthubapi.onrender.com/)  
  > **Note:** The first visit to these links may take some time or show a 502 error because the app is hosted on Render, which shuts down inactive apps. Please wait a few moments for the server to start.

- **Video Proof:**  
  - [Video Link](https://github.com/user-attachments/assets/fa29824a-216b-4458-9781-def6c9a814f3)

---

## Project Overview

### Contest Data
- Fetches **upcoming contests** from **Codeforces**, **CodeChef**, and **Leetcode**.
- Displays the **contest date** and **time remaining** before it starts.
- Shows **past contests** with links to corresponding solution videos on YouTube.
- Displays **YouTube playlist videos** separately for each platform.

### Filtering
- Users can **filter contests** by one or more platforms (e.g., Codeforces + Leetcode).

### Bookmarking
- Users can **bookmark upcoming contests** using the browser's **local storage**. This reduces the need for database calls, making the process faster.

### Automatic YouTube Link Fetching (Bonus)
- Uses **node-cron** to schedule a task every 30 minutes to update past contests with solution links.
- **Process:**
  - Fetches past contests from the database where the `youtube_tutorial` link is empty.
  - Uses the **YouTube API** to fetch playlist data.
  - If a **video title matches the contest name**, the system adds the video link to the contest’s `youtube_tutorial` field.
  > *Note:* The interval for this task can be adjusted based on server performance.

### Additional Features (Bonus)
- **Responsive UI** for mobile and tablet devices.
- **Light and dark mode** toggle option.

### Efficiency Improvements (Bonus++)
- **Optimized data fetching:**
  - Instead of fetching contests from all three websites each time, **upcoming contests are stored in a database**.
  - A **node-cron job** runs every **30 minutes** to:  
    - Move completed contests to the **past contests** list.  
    - Fetch new **upcoming contests** and update the database.
- **Reduces unnecessary API calls**, improving performance.
- **Local storage** for bookmarks eliminates unnecessary database queries.
- **Scheduled tasks** keep the system **efficient and up-to-date** with minimal server load.

---

## Development Stack

- **MERN Stack**:  
  - **MongoDB** (Database)  
  - **Express.js** (Backend framework)  
  - **React.js** (Frontend framework)  
  - **Node.js** (Runtime environment)

---

## Frontend File Structure

The frontend of **Contest Hub** is built using **React** and **Vite** for fast development. The project follows a modular structure to ensure better maintainability.

### Key Directories:
- **`api/`** → Manages API calls for fetching contest data from the backend and YouTube videos from the Google API.  
- **`components/`** → Contains reusable UI components like the navbar, contests list, and video sections.

---

## Backend File Structure, API, and Scheduler Information

### Key Directories and Files:

- **`cron/`** → Contains scheduled tasks for:  
  - Mapping newly uploaded YouTube videos to contest `youtube_tutorial` fields.  
  - Fetching new upcoming contests.  
  - Moving completed contests to past contests.  

- **`controllers/`** → Contains functions for handling API requests and business logic.  

- **`db/`** → Includes database-related files, including `index.js` for connecting to the database.  

- **`models/`** → Mongoose models for `PastContest` and `UpcomingContest`.  

- **`routes/`** → Defines API routes for different schemas.  

- **`services/`** → Fetches contest data from **CodeChef**, **Codeforces**, and **LeetCode**, and retrieves playlist information using the **Google API**.  

- **`utils/`** → Contains utility functions, including:  
  - `ApiResponse.js` → Standardizes the API response format.  
  - `ApiError.js` → Custom error handling.  
  - `asyncHandler.js` → Wrapper for handling asynchronous operations.  

- **`app.js`** → Main application file where routes are defined.

---

### API and Scheduler Information

#### 1. `codechef.service.js`
- **Purpose:**  
  Fetches ongoing, upcoming, and past contests from CodeChef.
- **Details:**  
  - Uses `axios` for HTTP requests and `URL` module for URL handling.
  - Functions:
    - `fetchCurrentAndUpcomingCodechefContests`: Retrieves ongoing/upcoming contests.
    - `fetchPastCodechefContests`: Retrieves past contests (filters for "Starters").
    - `fetchCodeChefContests`: A helper for paginated API requests.
  - Dates are formatted to **Indian Standard Time (IST)**.
  - **API URL:**  
    - `https://www.codechef.com/api/list/contests/{time}` (for past, current, and future contests).

---

#### 2. `codeforces.service.js`
- **Purpose:**  
  Retrieves Codeforces contests (ongoing, upcoming, and past).
- **Details:**  
  - Uses `axios` for API calls.
  - Functions:
    - `fetchCurrentAndUpcomingCodeforcesContests`: Gets live/upcoming contests.
    - `fetchPastCodeforcesContests`: Gets finished contests.
  - Converts Unix timestamps to **IST**.
  - **API URL:**  
    - `https://codeforces.com/api/contest.list` (for contest list).

---

#### 3. `leetcode.service.js`
- **Purpose:**  
  Fetches contest data from LeetCode using its GraphQL API.
- **Details:**  
  - Uses `axios` for GraphQL queries.
  - Functions:
    - `fetchLeetCodeContests`: Retrieves all contest data.
    - `fetchPastLeetCodeContests`: Filters and formats past contests.
    - `fetchCurrentAndUpcomingLeetCodeContests`: Filters future contests.
  - Custom date formatting for better display.
  - **API URL:**  
    - `https://leetcode.com/graphql` (for LeetCode contest data).

---

#### 4. `youtube.service.js`
- **Purpose:**  
  Retrieves videos from YouTube playlists.
- **Details:**  
  - Uses `googleapis` library to interact with the YouTube Data API v3.
  - Function:
    - `fetchPlaylistVideos`: Fetches up to 200 videos with pagination support.
  - **API URL:**  
    - `https://www.googleapis.com/youtube/v3/playlistItems` (for YouTube playlist videos).

---

#### 5. `updatePastContest.cron.js`
- **Purpose:**  
  Updates past contests with YouTube tutorial links every 30 minutes.
- **Details:**  
  - Uses `node-cron` for scheduling.
  - Fetches videos from predefined YouTube playlists.
  - Matches video titles to contest names (case-insensitive) and updates the contest record with the tutorial URL.
  - **API URL:**  
    - Uses the YouTube Data API (`https://www.googleapis.com/youtube/v3/playlistItems`).

---

#### 6. `updateUpcomingContest.cron.js`
- **Purpose:**  
  Updates upcoming contests and moves finished contests to past contests every 30 minutes.
- **Details:**  
  - Uses `node-cron` for scheduling.
  - Fetches contests from **CodeChef**, **Codeforces**, and **LeetCode**.
  - Avoids duplicate entries by comparing existing contests.
  - Moves contests that have ended (using **Asia/Kolkata time**) from upcoming to past.
  - **API URLs:**
    - CodeChef: `https://www.codechef.com/api/list/contests/{time}`
    - Codeforces: `https://codeforces.com/api/contest.list`
    - LeetCode: `https://leetcode.com/graphql`

---