import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import PromptGenerator from "./pages/HomePage";

function App() {
  return (
    // <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/prompt-testing"
            element={
              <>
                <div className="pt">
                  <PromptGenerator />
                </div>
              </>
            }
          />
        </Route>
      </Routes>
    // </div>
  );
}

export default App;
