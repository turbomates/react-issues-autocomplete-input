import React from "react";

import { Issue } from "../types";

type Props = {
  issue: Issue;
  isFocused: boolean;
};

export const IssueCard: React.FC<Props> = ({ issue, isFocused }) => (
  <div key={issue.number} className={`issue ${isFocused && "focused"}`}>
    <div className="issue-title">{issue.title}</div>
    <span className="issue-labels">
      {issue.labels.map((label) => (
        <span
          key={label.name}
          className="issue-label"
          style={{ backgroundColor: "#" + label.color }}
        >
          {label.name}
        </span>
      ))}
    </span>
    <div className="issue-metadata">
      <span>
        #{issue.number} {issue.state}ed by {issue.user.login}
      </span>
    </div>
  </div>
);
