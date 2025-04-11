// api/index.js

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ API route to fetch Google suggestions
app.get("/api/suggest", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const response = await axios.get(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
    );

    const suggestions = response.data[1];
    res.status(200).json({ keyword: query, suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
