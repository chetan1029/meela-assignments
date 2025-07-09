import Header from "./components/header";
import AppRoutes from "./routes";

export default function App() {
  return (
    <div class="min-h-screen bg-gray-50">
      <Header />
      <AppRoutes />
    </div>
  );
}
