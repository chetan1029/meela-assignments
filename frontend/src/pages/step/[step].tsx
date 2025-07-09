import { useParams, useNavigate } from "@solidjs/router";
import { createResource, createSignal, Show, For } from "solid-js";
import { fetchQuestions } from "../../datastore/api";

export default function StepForm() {
  const params = useParams();
  const step = () => Number(params.step);
  const navigate = useNavigate();

  const [questions] = createResource(fetchQuestions);
  const [selectedOptions, setSelectedOptions] = createSignal<
    Record<number, number[]>
  >({});

  const handleSelect = (
    questionId: number,
    optionId: number,
    multiple: boolean
  ) => {
    setSelectedOptions((prev) => {
      const current = prev[questionId] || [];
      if (multiple) {
        return {
          ...prev,
          [questionId]: current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleNext = () => {
    const nextStep = step() + 1;
    navigate(`/step/${nextStep}`);
  };

  return (
    <div class="p-4 max-w-lg mx-auto">
      <Show when={questions.loading}>
        <p class="text-gray-500">Loading questions...</p>
      </Show>

      <Show when={questions.error}>
        <p class="text-red-600">
          Failed to load questions: {questions.error.message}
        </p>
      </Show>

      <Show when={!questions.loading && questions()}>
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
              <div class="mt-3 flex justify-between items-center">
                <Show when={step() > 1}>
                  <button
                    class="mt-4 px-4 py-2 bg-gray-300 text-black rounded"
                    onClick={() => navigate(`/step/${step() - 1}`)}
                  >
                    Previous
                  </button>
                </Show>
                <Show when={step() === questions()?.length}>
                  <button
                    class="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
                    onClick={() => navigate("/results")}
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
