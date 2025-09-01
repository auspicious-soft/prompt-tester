import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import PromptGenerator from "./pages/HomePage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Login route */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected route for prompt-testing */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/prompt-testing"
          element={<PromptGenerator />}
        />
      </Route>

      {/* Catch-all route */}
      <Route
        path="*"
        element={
          token ? (
            <Navigate to="/prompt-testing" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
