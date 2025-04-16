// We wrap sveltekit generated index.js to avoid some passenger error with top level await
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  try {
    await import("./index.js");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
