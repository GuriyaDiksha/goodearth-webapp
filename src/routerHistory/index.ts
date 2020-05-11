import { createBrowserHistory, createMemoryHistory } from "history";

export const getHistory = (client = true, url?: string) => {
  return client
    ? createBrowserHistory()
    : createMemoryHistory({
        initialEntries: url ? [url] : []
      });
};
