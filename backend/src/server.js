import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
console.log("Server file loaded");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
