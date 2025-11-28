import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  const altDistPath = path.resolve(process.cwd(), "dist", "public");
  
  const publicPath = fs.existsSync(distPath) ? distPath : altDistPath;
  
  if (!fs.existsSync(publicPath)) {
    console.error(`Could not find public directory at: ${publicPath}`);
    console.error(`Current working directory: ${process.cwd()}`);
    console.error(`__dirname: ${__dirname}`);
    // Fallback: don't throw, just don't serve static files
    return;
  }

  app.use(express.static(publicPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    try {
      res.sendFile(path.resolve(publicPath, "index.html"));
    } catch (e) {
      res.status(404).json({ error: "Not found" });
    }
  });
}
