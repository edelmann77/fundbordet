import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, outdoorTheme } from "fundbrdet-ui";
import "./index.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import MyFindingsPage from "./pages/MyFindingsPage";
import CreateFindingPage from "./pages/CreateFindingPage";
import ImportFindingsPage from "./pages/ImportFindingsPage";
import RequireAuth from "./components/RequireAuth";
import RedirectIfAuthed from "./components/RedirectIfAuthed";
import AppShell from "./components/AppShell";

function App() {
  return (
    <ThemeProvider theme={outdoorTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectIfAuthed><LandingPage /></RedirectIfAuthed>} />
          <Route path="/login" element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
          <Route path="/signup" element={<RedirectIfAuthed><SignUpPage /></RedirectIfAuthed>} />
          <Route path="/detector/home" element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/detector/my-findings" element={<RequireAuth><AppShell><MyFindingsPage /></AppShell></RequireAuth>} />
          <Route path="/detector/create-finding" element={<RequireAuth><AppShell><CreateFindingPage /></AppShell></RequireAuth>} />
          <Route path="/detector/import-findings" element={<RequireAuth><AppShell><ImportFindingsPage /></AppShell></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
