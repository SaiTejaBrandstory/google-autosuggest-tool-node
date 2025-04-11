const form = document.getElementById("searchForm");
const input = document.getElementById("keyword");
const results = document.getElementById("results");
const loading = document.getElementById("loading");

// When the form is submitted
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const keyword = input.value.trim();

  if (!keyword) {
    loading.classList.add("hidden");
    results.innerHTML = `<p>Please enter a keyword.</p>`;
    return;
  }

  results.innerHTML = "";
  loading.classList.remove("hidden");

  try {
    // Dynamically fetch from same domain (local or live)
    const res = await fetch(`/api/suggest?q=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    const suggestions = data.suggestions;

    if (suggestions && suggestions.length) {
      results.innerHTML = `
        <h2>Suggestions for "${data.keyword}" (${suggestions.length})</h2>
        <div class="mb-3">
          <button class="btn btn-success btn-sm" onclick="copyAll()">📋 Copy All</button>
          <button class="btn btn-warning btn-sm" onclick='exportCSV("${data.keyword}", ${JSON.stringify(suggestions)})'>⬇️ Export CSV</button>
        </div>
        <ul>${suggestions.map(s => `<li>${s}</li>`).join("")}</ul>
      `;
    } else {
      results.innerHTML = `<p>No suggestions found.</p>`;
    }
  } catch (err) {
    results.innerHTML = `<p>❌ Error fetching suggestions.</p>`;
  } finally {
    loading.classList.add("hidden");
  }
});

// Copy all suggestions to clipboard
function copyAll() {
  const text = Array.from(document.querySelectorAll("#results li"))
    .map(li => li.textContent)
    .join("\n");
  navigator.clipboard.writeText(text)
    .then(() => alert("✅ Copied all suggestions!"));
}

// Export suggestions as CSV
function exportCSV(keyword, suggestions) {
  const csvContent = "data:text/csv;charset=utf-8," + suggestions.map(s => `"${s}"`).join("\n");
  const encoded = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encoded);
  link.setAttribute("download", `${keyword}_suggestions.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}




// const res = await fetch(`http://localhost:3000/api/suggest?q=${encodeURIComponent(keyword)}`);
