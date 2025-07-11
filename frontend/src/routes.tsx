import { Navigate, Route, Router } from "@solidjs/router";
import StepForm from "./pages/step/[step]";
import Landing from "./landingpage";
import Result from "./pages/result";

export default function AppRoutes() {
  return (
    <Router>
      <Route path="/" component={Landing} />
      <Route path="/step/:uuid/:step" component={StepForm} />
      <Route path="/results/:uuid" component={Result} />
      <Route path="*" component={() => <p>Page Not Found</p>} />
    </Router>
  );
}
