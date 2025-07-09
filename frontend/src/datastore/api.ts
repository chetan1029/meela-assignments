import { Question } from "../types/question";

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch("http://0.0.0.0:3005/api/questions");
  if (!res.ok) throw new Error("Failed to load questions");
  return res.json();
}
