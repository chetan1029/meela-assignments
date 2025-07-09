import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";
import { v4 as uuidv4 } from "uuid";

export default function Landing() {
  const navigate = useNavigate();

  createEffect(() => {
    const existing = localStorage.getItem("user_uuid");
    if (existing) {
      navigate(`/step/1?uuid=${existing}`);
    }
  });

  const handleStart = () => {
    const uuid = uuidv4();
    localStorage.setItem("user_uuid", uuid);
    navigate(`/step/1?uuid=${uuid}`);
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
