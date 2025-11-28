import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Try multiple possible paths for the public directory
  const possiblePaths = [
    path.resolve(__dirname, "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.join(__dirname, "..", "dist", "public"),
  ];
  
  let publicPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      publicPath = p;
      console.log(`[Static] Found public directory at: ${publicPath}`);
      break;
    }
  }
  
  if (!publicPath) {
    console.warn(`[Static] Could not find public directory in any location`);
    console.warn(`[Static] Checked: ${possiblePaths.join(", ")}`);
    console.warn(`[Static] CWD: ${process.cwd()}, __dirname: ${__dirname}`);
  } else {
    app.use(express.static(publicPath));
    
    // Serve index.html for all routes (SPA fallback)
    app.use("*", (_req, res) => {
      const indexPath = path.resolve(publicPath!, "index.html");
      if (fs.existsSync(indexPath)) {
        res.set("Content-Type", "text/html");
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ error: "index.html not found" });
      }
    });
  }
}
