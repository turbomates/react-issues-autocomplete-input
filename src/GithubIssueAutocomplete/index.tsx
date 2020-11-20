import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { useDebounce } from "use-debounce";

import { IssueCard } from "./IssueCard";
import { loadIssues } from "./http";
import { initialState, reducer } from "./reducer";

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
  const ref = useRef<HTMLInputElement>(null);
  const [query] = useDebounce(value, 800);
  const [
    { issues, focusedIssueNumber, isIssuesLoading, isIssuesVibible },
    dispatch,
  ] = useReducer(reducer, initialState);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowDown":
          event.preventDefault();
          dispatch({ type: "NEXT_ISSUE" });
          return;
        case "ArrowUp":
          event.preventDefault();
          dispatch({ type: "PREV_ISSUE" });
          return;
        case "Escape":
          event.preventDefault();
          dispatch({ type: "HIDE_ISSUES" });
          return;
        case "Enter":
          event.preventDefault();
          const focusedIssue = issues.find(
            (issue) => issue.number === focusedIssueNumber
          );
          if (focusedIssue) {
            window.location.href = `https://github.com/facebook/react/issues/${focusedIssue.number}`;
          }
          return;
        default:
          return;
      }
    },
    [focusedIssueNumber, issues]
  );

  const handleFocus = () => {
    dispatch({ type: "SHOW_ISSUES" });
  };

  const handleBlur = () => {
    dispatch({ type: "HIDE_ISSUES" });
  };

  useEffect(() => {
    if (focusedIssueNumber === null) {
      ref.current?.focus();
    }
  }, [focusedIssueNumber]);

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
    <div className="autocomplete">
      <input
        ref={ref}
        className="autocomplete-input"
        value={value}
        onInput={(event) => onChange(event.currentTarget.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isIssuesLoading && <div className="autocomplete-loading" />}
      {isIssuesVibible && issues.length > 0 && (
        <div className="autocomplete-list">
          {issues.slice(0, limit).map((issue) => (
            <IssueCard
              key={issue.number}
              issue={issue}
              isFocused={issue.number === focusedIssueNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
};

GithubIssueAutocomplete.defaultProps = {
  limit: 5,
};
