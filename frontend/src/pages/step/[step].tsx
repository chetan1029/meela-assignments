import { useParams, useNavigate } from "@solidjs/router";
import {
  createResource,
  createSignal,
  Show,
  For,
  createEffect,
} from "solid-js";
import {
  fetchQuestions,
  saveSubmission,
  fetchSubmission,
} from "../../datastore/api";

export default function StepForm() {
  const params = useParams();
  const uuid = () => params.uuid;
  const step = () => Number(params.step);
  const navigate = useNavigate();

  const [questions] = createResource(fetchQuestions);
  const [selectedOptions, setSelectedOptions] = createSignal<
    Record<number, number[]>
  >({});

  const [submission] = createResource(uuid, fetchSubmissionAndInit);

  async function fetchSubmissionAndInit(id: string) {
    const data = await fetchSubmission(id);

    const mapped: Record<number, number[]> = {};
    for (const entry of data.form_data || []) {
      mapped[entry.question_id] = entry.selected_options;
    }

    setSelectedOptions(mapped);
    return data;
  }

  createEffect(() => {
    if (!uuid()) {
      navigate("/", { replace: true });
    }
  });

  const handleSelect = (
    questionId: number,
    optionId: number,
    multiple: boolean
  ) => {
    setSelectedOptions((prev) => {
      const current = prev[questionId] || [];
      const updated = multiple
        ? current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId]
        : [optionId];

      return { ...prev, [questionId]: updated };
    });
  };

  const handleNext = () => {
    const nextStep = step() + 1;
    navigate(`/step/${uuid()}/${nextStep}`);
  };

  const handleSave = async () => {
    const form_data = Object.entries(selectedOptions()).map(
      ([qid, selected]) => ({
        question_id: Number(qid),
        selected_options: selected,
      })
    );

    try {
      await saveSubmission({ user_uuid: uuid(), form_data, step: step() });
      alert("Progress saved!");
    } catch (err: any) {
      alert("Save failed: " + err.message);
    }
  };

  return (
    <div class="p-4 max-w-lg mx-auto">
      <Show when={questions.loading || submission.loading}>
        <p class="text-gray-500">Loading questions...</p>
      </Show>

      <Show when={questions.error || submission.error}>
        <p class="text-red-600">
          {questions.error?.message || submission.error?.message}
        </p>
      </Show>

      <Show when={!questions.loading && !submission.loading && questions()}>
        <Show
          when={questions()?.find((q) => q.step === step())}
          fallback={<p>Step not found</p>}
        >
          {(q) => (
            <>
              <h2 class="text-xl font-bold mb-2">{q().question}</h2>
              <p class="text-gray-600 mb-4">{q().description}</p>
              <div class="space-y-2">
                <For each={q().options}>
                  {(opt) => (
                    <button
                      class={`block w-full px-4 py-2 rounded border ${
                        selectedOptions()[q().id]?.includes(opt.id)
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => handleSelect(q().id, opt.id, q().multiple)}
                    >
                      {opt.text}
                    </button>
                  )}
                </For>
              </div>
              <div class="mt-4 text-right">
                <button
                  class="px-4 py-2 bg-yellow-500 text-white rounded"
                  onClick={handleSave}
                >
                  Save Progress
                </button>
              </div>
              <div class="mt-3 flex justify-between items-center">
                <Show when={step() > 1}>
                  <button
                    class="mt-4 px-4 py-2 bg-gray-300 text-black rounded"
                    onClick={() => navigate(`/step/${uuid()}/${step() - 1}`)}
                  >
                    Previous
                  </button>
                </Show>
                <Show when={step() === questions()?.length}>
                  <button
                    class="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
                    onClick={() => navigate(`/results/${uuid()}`)}
                  >
                    Submit
                  </button>
                </Show>
                <Show when={step() < questions()?.length}>
                  <button
                    class="mt-6 px-6 py-2 bg-green-600 text-white rounded"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </Show>
              </div>
            </>
          )}
        </Show>
      </Show>
    </div>
  );
}
