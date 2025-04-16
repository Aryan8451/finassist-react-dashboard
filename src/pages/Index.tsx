import { Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";

// Redirect to landing page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
