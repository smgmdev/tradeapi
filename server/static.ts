import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // For bundled code, __dirname doesn't work reliably
  // Try common deployment paths
  const cwd = process.cwd();
  const possiblePaths = [
    path.join(cwd, "dist", "public"),           // Local dev
    path.join(cwd, ".vercel", "output", "dist", "public"), // Vercel build output
    path.join(cwd, "public"),                   // Root public folder
  ];
  
  let publicPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      publicPath = p;
      console.log(`[Static] Using public directory: ${publicPath}`);
      break;
    }
  }
  
  if (!publicPath) {
    console.error(`[Static] ⚠️  Could not find public directory!`);
    console.error(`[Static] Checked: ${possiblePaths.join(" | ")}`);
    console.error(`[Static] CWD: ${cwd}`);
    // Don't setup static serving if we can't find the public folder
    return;
  }
  
  // Serve static files
  app.use(express.static(publicPath));
  
  // SPA fallback: serve index.html for all unknown routes
  app.use("*", (req, res) => {
    const indexPath = path.join(publicPath!, "index.html");
    if (fs.existsSync(indexPath)) {
      res.type("text/html").sendFile(indexPath);
    } else {
      res.status(404).json({ error: "index.html not found" });
    }
  });
}
