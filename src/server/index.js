// Import necessary modules
const Koa = require('koa');
const fs = require('fs');
const serve = require('koa-static');

// Read the HTML content of the index.html file from the 'dist/static' directory
const html = fs.readFileSync(__dirname + '/../../dist/static/index.html', 'utf-8');

// Create a new Koa application
const app = new Koa();

// Define the port for the server to listen on, defaulting to 3000 if NODE_PORT is not provided
const PORT = process.env.NODE_PORT || 3000;

// Serve static files (e.g., JavaScript, CSS) from the 'dist/static' directory
app.use(serve(__dirname + '/../../dist/static'));

// Define a middleware to respond with the previously read HTML content for all requests
app.use(async ctx => {
  ctx.body = html; // Set the response body to the HTML content
});

// Start the Koa server on the specified port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});