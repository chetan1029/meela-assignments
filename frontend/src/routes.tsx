import { Navigate, Route, Router } from "@solidjs/router";
import StepForm from "./pages/step/[step]";
import Landing from "./Landing";

export default function AppRoutes() {
  return (
    <Router>
      <Route path="/" component={Landing} />
      <Route path="/step/:step" component={StepForm} />
      <Route path="*" component={() => <p>Page Not Found</p>} />
    </Router>
  );
}
