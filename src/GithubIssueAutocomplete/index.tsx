import React, { useCallback, useEffect, useReducer } from "react";
import { useDebounce } from "use-debounce";

import { IssueCard } from "./IssueCard";
import { loadIssues } from "./http";
import { initialState, reducer } from "./reducer";
import { Issue } from "../types";

type Props = {
  value: string;
  onChange: (query: string) => void;
  limit?: number;
};

export const GithubIssueAutocomplete: React.FC<Props> = ({
  value,
  onChange,
  limit,
}) => {
  const [query] = useDebounce(value, 400);
  const [
    { issues, focusedIssueNumber, isIssuesLoading, isIssuesVisible },
    dispatch,
  ] = useReducer(reducer, initialState);

  const pickIssue = useCallback(
    (issue: Issue) => {
      onChange(issue.title);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowDown":
          event.preventDefault();
          dispatch({ type: "NEXT_ISSUE" });
          break;
        case "ArrowUp":
          event.preventDefault();
          dispatch({ type: "PREV_ISSUE" });
          break;
        case "Escape":
          event.preventDefault();
          dispatch({ type: "HIDE_ISSUES" });
          break;
        case "Enter":
          event.preventDefault();
          const focusedIssue = issues.find(
            (issue) => issue.number === focusedIssueNumber
          );
          if (focusedIssue) {
            pickIssue(focusedIssue);
          }
          break;
      }
    },
    [focusedIssueNumber, issues, pickIssue]
  );

  const handleFocus = () => {
    dispatch({ type: "SHOW_ISSUES" });
  };

  const handleBlur = () => {
    dispatch({ type: "HIDE_ISSUES" });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const fetchData = async () => {
      if (query === "") {
        dispatch({ type: "CLEAR" });
        return;
      }

      dispatch({ type: "LOAD_ISSUES_REQUEST" });
      loadIssues(query)
        .then((data) =>
          dispatch({
            type: "LOAD_ISSUES_SUCCESS",
            issues: data.slice(0, limit),
          })
        )
        .catch(() => dispatch({ type: "LOAD_ISSUES_FAILURE" }));
    };

    fetchData();
  }, [query, limit]);

  return (
    <>
      {isIssuesVisible && <div className="outside-area" onClick={handleBlur} />}
      <div className="autocomplete-input-container">
        <input
          className="autocomplete-input"
          placeholder="Search React Issue"
          value={value}
          onInput={(event) => onChange(event.currentTarget.value)}
          onFocus={handleFocus}
        />
        {isIssuesLoading && (
          <div className="icon-container">
            <div className="loader" />
          </div>
        )}
      </div>
      {isIssuesVisible && issues.length > 0 && (
        <div className="autocomplete-list">
          {issues.slice(0, limit).map((issue) => (
            <IssueCard
              key={issue.number}
              issue={issue}
              isFocused={issue.number === focusedIssueNumber}
              onClick={() => {
                pickIssue(issue);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

GithubIssueAutocomplete.defaultProps = {
  limit: 5,
};
