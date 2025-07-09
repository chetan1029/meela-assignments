import { useParams, useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { createResource, createSignal, Show, For } from "solid-js";
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
  const [message, setMessage] = createSignal<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submissionError, setSubmissionError] = createSignal<string | null>(
    null
  );
  const [isLoadingSubmission, setIsLoadingSubmission] = createSignal(true);

  onMount(async () => {
    if (!uuid()) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const data = await fetchSubmission(uuid());

      if (data && Array.isArray(data.form_data)) {
        const mapped: Record<number, number[]> = {};
        for (const entry of data.form_data || []) {
          mapped[entry.question_id] = entry.selected_options;
        }
        setSelectedOptions(mapped);

        // Redirect to the last saved step
        if (data.step && data.step !== step()) {
          navigate(`/step/${uuid()}/${data.step}`, { replace: true });
        }
      }
    } catch (err: any) {
      setSubmissionError(err.message || "Failed to fetch submission");
    } finally {
      setIsLoadingSubmission(false);
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

  const handleNext = () => navigate(`/step/${uuid()}/${step() + 1}`);
  const handleSave = async () => {
    const form_data = Object.entries(selectedOptions()).map(
      ([qid, selected]) => ({
        question_id: Number(qid),
        selected_options: selected,
      })
    );

    try {
      await saveSubmission({ user_uuid: uuid(), form_data, step: step() });
      setMessage({ type: "success", text: "Progress saved!" });
    } catch (err: any) {
      setMessage({ type: "error", text: "Save failed: " + err.message });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div class="p-4 max-w-lg mx-auto">
      <Show when={message()}>
        <div
          class={`mb-4 px-4 py-2 rounded text-sm ${
            message()!.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message()!.text}
        </div>
      </Show>

      <Show when={questions.loading || isLoadingSubmission()}>
        <p class="text-gray-500">Loading questions...</p>
      </Show>

      <Show when={questions.error || submissionError()}>
        <p class="text-red-600">
          {questions.error?.message || submissionError()}
        </p>
      </Show>

      <Show when={!questions.loading && !isLoadingSubmission() && questions()}>
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
                      class={`block w-full px-4 py-2 rounded border cursor-pointer ${
                        selectedOptions()[q().id]?.includes(opt.id)
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black hover:bg-blue-100"
                      }`}
                      onClick={() => handleSelect(q().id, opt.id, q().multiple)}
                    >
                      {opt.text}
                    </button>
                  )}
                </For>
              </div>
              <Show when={step() < questions()?.length}>
                <div class="mt-4 text-right">
                  <button
                    class="px-4 py-2 bg-yellow-500 text-white rounded cursor-pointer"
                    onClick={handleSave}
                  >
                    Save Progress
                  </button>
                </div>
              </Show>
              <div class="mt-3 flex justify-between items-center">
                <Show when={step() > 1}>
                  <button
                    class="mt-4 px-4 py-2 bg-gray-300 text-black rounded cursor-pointer"
                    onClick={() => navigate(`/step/${uuid()}/${step() - 1}`)}
                  >
                    Previous
                  </button>
                </Show>
                <Show when={step() === questions()?.length}>
                  <button
                    class="mt-6 px-6 py-2 bg-blue-600 text-white rounded cursor-pointer"
                    onClick={async () => {
                      await handleSave();
                      navigate(`/results/${uuid()}`);
                    }}
                  >
                    Submit
                  </button>
                </Show>
                <Show when={step() < questions()?.length}>
                  <button
                    class="mt-6 px-6 py-2 bg-green-600 text-white rounded cursor-pointer"
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
