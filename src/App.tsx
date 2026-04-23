import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
import { routes } from "./lib/routes";

const LegacyDetectorRedirect = () => {
  const location = useLocation();
  const nextPath = location.pathname.replace(/^\/detector/, "") || routes.home;

  return (
    <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />
  );
};

const App = () => {
  return (
    <ThemeProvider theme={outdoorTheme}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
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
            path={routes.home}
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path={routes.myFindings}
            element={
              <RequireAuth>
                <AppShell>
                  <MyFindingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path={`${routes.myFindings}/:id`}
            element={
              <RequireAuth>
                <AppShell>
                  <MyFindingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path={routes.sharedFindings}
            element={
              <RequireAuth>
                <AppShell>
                  <SharedFindingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path={`${routes.sharedFindings}/:id`}
            element={
              <RequireAuth>
                <AppShell>
                  <SharedFindingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path={routes.fundDatabase}
            element={
              <RequireAuth>
                <AppShell>
                  <FundDatabasePage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path={routes.createFinding}
            element={
              <RequireAuth>
                <AppShell>
                  <CreateFindingPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path={routes.settings}
            element={
              <RequireAuth>
                <AppShell>
                  <SettingsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route
            path={routes.friends}
            element={
              <RequireAuth>
                <AppShell>
                  <FriendsPage />
                </AppShell>
              </RequireAuth>
            }
          />
          <Route path="/detector/*" element={<LegacyDetectorRedirect />} />
          <Route path="*" element={<Navigate to={routes.landing} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
