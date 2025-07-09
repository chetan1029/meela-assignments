import { Navigate, Route, Router } from "@solidjs/router";
import StepForm from "./pages/step/[step]";

export default function AppRoutes() {
  return (
    <Router>
      <Route path="/" component={() => <Navigate href="/step/1" />} />
      <Route path="/step/:step" component={StepForm} />
      <Route path="*" component={() => <p>Page Not Found</p>} />
    </Router>
  );
}
