import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, outdoorTheme } from "fundbrdet-ui";
import "./index.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import RequireAuth from "./components/RequireAuth";
import RedirectIfAuthed from "./components/RedirectIfAuthed";

function App() {
  return (
    <ThemeProvider theme={outdoorTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectIfAuthed><LandingPage /></RedirectIfAuthed>} />
          <Route path="/login" element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
          <Route path="/signup" element={<RedirectIfAuthed><SignUpPage /></RedirectIfAuthed>} />
          <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
