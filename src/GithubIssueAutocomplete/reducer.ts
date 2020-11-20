import { Issue } from "../types";

export type State = {
  issues: Issue[];
  isIssuesVibible: boolean;
  isIssuesLoading: boolean;
  focusedIssueNumber: number | null;
};

export const initialState: State = {
  issues: [],
  isIssuesVibible: false,
  isIssuesLoading: false,
  focusedIssueNumber: null,
};

type Action =
  | { type: "LOAD_ISSUES_REQUEST" }
  | { type: "LOAD_ISSUES_SUCCESS"; issues: Issue[] }
  | { type: "LOAD_ISSUES_FAILURE" }
  | { type: "NEXT_ISSUE" }
  | { type: "PREV_ISSUE" }
  | { type: "SHOW_ISSUES" }
  | { type: "HIDE_ISSUES" }
  | { type: "CLEAR" };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD_ISSUES_REQUEST":
      return { ...state, isIssuesLoading: true };
    case "LOAD_ISSUES_SUCCESS":
      return {
        ...state,
        isIssuesLoading: false,
        issues: action.issues,
        isIssuesVibible: true,
      };
    case "LOAD_ISSUES_FAILURE":
      return { ...state, isIssuesLoading: false, issues: [] };
    case "NEXT_ISSUE":
      const nextFocusedIssueNumber = findNextFocusedIssueNumber(state);
      return {
        ...state,
        focusedIssueNumber: nextFocusedIssueNumber,
        isIssuesVibible: true,
      };
    case "PREV_ISSUE":
      const prevFocusedIssueNumber = findPrevFocusedIssueNumber(state);
      return {
        ...state,
        focusedIssueNumber: prevFocusedIssueNumber,
        isIssuesVibible: true,
      };
    case "HIDE_ISSUES":
      return { ...state, isIssuesVibible: false, focusedIssueNumber: null };
    case "SHOW_ISSUES":
      return { ...state, isIssuesVibible: true };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

function findNextFocusedIssueNumber({ issues, focusedIssueNumber }: State) {
  if (issues.length === 0) return null;
  const index = issues.findIndex(
    (issue) => issue.number === focusedIssueNumber
  );

  if (index === -1) {
    return issues[0].number;
  } else if (index === issues.length - 1) {
    return null;
  } else {
    return issues[index + 1].number;
  }
}

function findPrevFocusedIssueNumber({ issues, focusedIssueNumber }: State) {
  if (issues.length === 0) return null;
  const index = issues.findIndex(
    (issue) => issue.number === focusedIssueNumber
  );

  if (index === -1) {
    return issues[issues.length - 1].number;
  } else if (index === 0) {
    return null;
  } else {
    return issues[index - 1].number;
  }
}
