const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors());

async function fetchSuggestions(keyword) {
  const baseUrl = "https://suggestqueries.google.com/complete/search";
  const params = {
    client: "firefox",
    q: keyword,
    hl: "en",
    gl: "us",
  };

  const res = await axios.get(baseUrl, { params });
  return res.data[1];
}

app.get("/api/index", async (req, res) => {
  const query = req.query.q || "";
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const allSuggestions = new Set();

  try {
    const promises = [fetchSuggestions(query)];

    for (const letter of alphabet) {
      promises.push(fetchSuggestions(`${query} ${letter}`));
    }

    const results = await Promise.all(promises);

    results.flat().forEach((suggestion) => allSuggestions.add(suggestion));

    res.json({
      keyword: query,
      suggestions: Array.from(allSuggestions).slice(0, 100),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Suggestion fetch failed." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
