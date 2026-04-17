export const routes = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  home: "/home",
  myFindings: "/my-findings",
  myFinding: (id: string) => `/my-findings/${id}`,
  sharedFindings: "/shared-findings",
  sharedFinding: (id: string) => `/shared-findings/${id}`,
  fundDatabase: "/fund-database",
  createFinding: "/create-finding",
  settings: "/settings",
  friends: "/friends",
} as const;
