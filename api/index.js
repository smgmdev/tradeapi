import('../dist/index.cjs').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
