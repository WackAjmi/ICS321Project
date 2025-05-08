import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import GuestDashboard from "./pages/GuestDashboard";
import MatchResults from "./pages/MatchResults";
import TopScorer from "./pages/TopScorer";
import RedCards from "./pages/RedCards";
import TeamDetails from "./pages/TeamDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "guest", element: <GuestDashboard /> },
      { path: "match-results/:tournamentId", element: <MatchResults /> },
      { path: "top-scorer", element: <TopScorer /> },
      { path: "red-cards", element: <RedCards /> },
      { path: "team-details/:teamId", element: <TeamDetails /> },
    ],
  },
]);

export default router;
