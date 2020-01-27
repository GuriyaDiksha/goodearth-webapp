import { createBrowserHistory, createMemoryHistory } from "history";

export const getHistory = (client = true) => {
  return client ? createBrowserHistory() : createMemoryHistory();
};
