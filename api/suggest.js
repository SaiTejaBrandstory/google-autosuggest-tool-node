export default async function handler(req, res) {
    const query = req.query.q;
  
    if (!query) {
      return res.status(400).json({ error: 'Missing query' });
    }
  
    try {
      const response = await fetch(
        `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      res.status(200).json({ suggestions: data[1] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  }
  