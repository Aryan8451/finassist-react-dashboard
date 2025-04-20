
import { Navigate } from "react-router-dom";

// Redirect to landing page
const Index = () => {
  return <Navigate to="/landing" replace />;
};

export default Index;
