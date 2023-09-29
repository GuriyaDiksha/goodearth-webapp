// Import necessary modules and middleware
import path from "path";
import Koa from "koa";
import Pug from "koa-pug";
import serve from "koa-static";
import history from "./middleware/history";
import reduxStore from "./middleware/reduxStore";
import cookies from "./middleware/cookies";
import device from "./middleware/device";
import initAction from "./middleware/initAction";
import viewHandler from "./middleware/viewHandler";
import errorHandler from "./middleware/errorHandler";
import logger from "koa-logger";

// Get the current working directory
const cwd = process.cwd();

// Define the root directory for serving static files
const staticRoot = `${cwd}/dist`;

// Create a new Koa application
const app = new Koa();

// Define the port for the server to listen on, defaulting to 3000 if NODE_PORT is not provided
const PORT = process.env.NODE_PORT || 3000;

// Use the Koa logger middleware for logging requests
app.use(logger());

// Serve static files from the specified directory with a cache duration of 1 year
app.use(
  serve(staticRoot, {
    maxAge: 31536000000 // 1 year in milliseconds
  })
);

// Configure the Pug template engine
const pug = new Pug({
  viewPath: path.resolve(__dirname, "templates"), // Set the directory for Pug templates
  debug: false, // Disable debugging for Pug
  pretty: false, // Disable pretty formatting of HTML output
  compileDebug: false, // Disable debugging for template compilation
  app: app // Initialize Pug with the Koa app
});

// Use Pug as a middleware
pug.use(app);

// Add custom middleware to the Koa application
app.use(errorHandler); // Handle errors
app.use(history); // Handle client-side routing (e.g., with React Router)
app.use(reduxStore); // Manage Redux store
app.use(device); // Detect the user's device (e.g., mobile, desktop)
app.use(cookies); // Handle cookies
app.use(initAction); // Initialize actions (possibly for Redux or data fetching)
app.use(viewHandler); // Render views using Pug templates

// Start the Koa server on the specified port
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// Set a timeout of 10 minutes (600,000 milliseconds) for long-running connections
server.timeout = 600000;
