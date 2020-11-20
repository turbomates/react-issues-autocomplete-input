import { Issue, IssuesResponse } from "../types";

export function loadIssues(query: string): Promise<Issue[]> {
  const encodedQuery = query.replaceAll(" ", "+");
  const url = `https://api.github.com/search/issues?q=${encodedQuery}+repo:facebook/react+type:issue+in:title+in:body`;
  return fetch(url)
    .then((resp) => resp.json())
    .then((data: IssuesResponse) => data.items);
}
