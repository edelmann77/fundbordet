import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, outdoorTheme } from "fundbrdet-ui";
import "./index.css";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <ThemeProvider theme={outdoorTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
