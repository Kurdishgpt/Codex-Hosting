const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ✅ Don't use hardcoded port like 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
