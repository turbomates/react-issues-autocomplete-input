import React from "react";

import { Issue } from "../types";

type Props = {
  issue: Issue;
  isFocused: boolean;
  onClick?: () => void;
};

export const IssueCard: React.FC<Props> = ({ issue, isFocused, onClick }) => (
  <div
    key={issue.number}
    className={`issue ${isFocused ? "focused" : ""}`}
    onClick={onClick}
  >
    <div className="issue-maindata">
      <div className="issue-title">{issue.title}</div>
      {issue.labels.map((label) => (
        <span
          key={label.name}
          className="issue-label"
          style={{
            backgroundColor: "#" + label.color,
            color: getLabelTextColor(label.color),
          }}
        >
          {label.name}
        </span>
      ))}
    </div>
    <div className="issue-metadata">
      <span>
        #{issue.number} {issue.state}ed by {issue.user.login}
      </span>
    </div>
  </div>
);

function getLabelTextColor(backgroundColor: string): string {
  const hex = `0x${backgroundColor}`;
  const [r, g, b] = [+hex >> 16, (+hex >> 8) & 255, +hex & 255];
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp > 127.5 ? "#000000" : "#ffffff";
}

IssueCard.defaultProps = {
  onClick: () => {},
};
