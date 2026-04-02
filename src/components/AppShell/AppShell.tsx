import "./AppShell.css";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <span className="app-shell__logo">🪙</span>
      </header>

      <main className="app-shell__main">
        <div className="app-shell__content">{children}</div>
      </main>
    </div>
  );
};

export default AppShell;
