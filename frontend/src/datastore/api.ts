const API_BASE = "http://0.0.0.0:3005/api";

export const fetchQuestions = async () => {
  const res = await fetch(`${API_BASE}/questions`);
  if (!res.ok) throw new Error("Failed to load questions");
  return res.json();
};

export const fetchSubmission = async (uuid: string) => {
  const res = await fetch(`${API_BASE}/submission/${uuid}`);
  if (!res.ok) throw new Error("Failed to fetch submission");
  return res.json();
};

export const saveSubmission = async (payload: {
  user_uuid: string;
  form_data: { question_id: number; selected_options: number[] }[];
  step: number;
}) => {
  const res = await fetch(`${API_BASE}/submission`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to save submission");

  return res.json();
};
