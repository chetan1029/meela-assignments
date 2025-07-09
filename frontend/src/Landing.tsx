import { useNavigate } from "@solidjs/router";

export default function Landing() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/step/1`);
  };

  return (
    <div class="p-4 max-w-lg mx-auto text-center">
      <h1 class="text-4xl font-medium mb-10 mt-10">
        Find the right therapist, near you or online
      </h1>
      <button
        class="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={handleStart}
      >
        Continue
      </button>
    </div>
  );
}
