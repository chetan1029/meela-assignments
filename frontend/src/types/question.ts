export interface Option {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  step: number;
  question: string;
  description: string | null;
  multiple: boolean;
  optional: boolean;
  min_selection: number | null;
  max_selection: number | null;
  options: Option[];
}
