import React, { useCallback, useState } from "react";

import { GithubIssueAutocomplete } from "./GithubIssueAutocomplete";

function App() {
  const [query, setQuery] = useState("");
  const onChange = useCallback(
    (text: string) => {
      setQuery(text);
    },
    [setQuery]
  );

  return <GithubIssueAutocomplete value={query} onChange={onChange} />;
}

export default App;
