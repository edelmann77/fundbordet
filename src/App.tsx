import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, outdoorTheme } from "fundbrdet-ui";
import "./index.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import HomePage from "./pages/HomePage/HomePage";
import MyFindingsPage from "./pages/MyFindingsPage/MyFindingsPage";
import SharedFindingsPage from "./pages/SharedFindingsPage/SharedFindingsPage";
import CreateFindingPage from "./pages/CreateFindingPage/CreateFindingPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import FundDatabasePage from "./pages/FundDatabasePage/FundDatabasePage";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import RedirectIfAuthed from "./components/RedirectIfAuthed/RedirectIfAuthed";
import AppShell from "./components/AppShell/AppShell";

function App() {
  return (
    <ThemeProvider theme={outdoorTheme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RedirectIfAuthed>
                <LandingPage />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <LoginPage />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfAuthed>
                <SignUpPage />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/detector/home"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/detector/my-findings"
            element={
              <RequireAuth>
                <AppShell>
                  <MyFindingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/detector/my-findings/:id"
            element={
              <RequireAuth>
                <AppShell>
                  <MyFindingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/detector/shared-findings"
            element={
              <RequireAuth>
                <AppShell>
                  <SharedFindingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/detector/shared-findings/:id"
            element={
              <RequireAuth>
                <AppShell>
                  <SharedFindingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/detector/fund-database"
            element={
              <RequireAuth>
                <AppShell>
                  <FundDatabasePage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/detector/create-finding"
            element={
              <RequireAuth>
                <AppShell>
                  <CreateFindingPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/detector/settings"
            element={
              <RequireAuth>
                <AppShell>
                  <SettingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/detector/friends"
            element={
              <RequireAuth>
                <AppShell>
                  <FriendsPage />
                </AppShell>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
