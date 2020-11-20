export type IssuesResponse = {
  incomplete_results: boolean;
  items: Issue[];
  total_count: number;
};

export type Issue = {
  title: string;
  state: string;
  labels: Label[];
  number: number;
  user: User;
  created_at: string;
};

export type Label = {
  name: string;
  color: string;
};

export type User = {
  login: string;
};
