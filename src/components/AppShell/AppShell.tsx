import "./AppShell.css";
import AccountMenu from "../AccountMenu/AccountMenu";
import NotificationsMenu from "../NotificationsMenu/NotificationsMenu";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <span className="app-shell__logo">🪙</span>
        <div className="app-shell__actions">
          <NotificationsMenu />
          <AccountMenu />
        </div>
      </header>

      <main className="app-shell__main">
        <div className="app-shell__content">{children}</div>
      </main>
    </div>
  );
};

export default AppShell;
