// GuestDashboard.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function GuestDashboard() {
  const [tournamentId, setTournamentId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [matchResults, setMatchResults] = useState([]);
  const [topScorer, setTopScorer] = useState(null);
  const [redCards, setRedCards] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const fetchMatchResults = async () => {
    const { data, error } = await supabase
      .from("match_played")
      .select("*")
      .eq("tr_id", Number(tournamentId))
      .order("play_date", { ascending: true });
    setMatchResults(data || []);
  };

  const fetchTopScorer = async () => {
    const { data, error } = await supabase.rpc("get_top_scorer");
    if (error) {
      console.error("Error fetching top scorer:", error);
      return;
    }
    console.log("Top scorer response:", data); // Debug
    setTopScorer(data[0]); // ✅ FIXED
  };
  const fetchRedCards = async () => {
    const { data, error } = await supabase
      .from("player_booked")
      .select("*")
      .eq("sent_off", "Y");
    setRedCards(data || []);
  };
  const fetchTeamMembers = async () => {
    console.log("Fetching team info for team ID:", teamId);
    console.log("Team members:", teamMembers);
    const { data: players, error: err1 } = await supabase
      .from("team_player_info")
      .select("player_id, player_name")
      .eq("team_id", Number(teamId));

    const { data: support, error: err2 } = await supabase
      .from("team_support_info")
      .select("support_id, support_type, support_name")
      .eq("team_id", Number(teamId));

    const { data: captain, error: err3 } = await supabase
      .from("match_captain_info")
      .select("player_captain, captain_name")
      .eq("team_id", Number(teamId));

    if (err1 || err2 || err3) {
      console.error("Team info fetch error:", err1 || err2 || err3);
      return;
    }

    setTeamMembers({
      players: players ?? [],
      support: support ?? [],
      captain: captain ?? [],
    });
  };
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Guest Dashboard</h1>

      {/* Match Results */}
      <section>
        <h2 className="text-xl">Match Results by Tournament</h2>
        <input
          className="border p-2 w-full"
          placeholder="Tournament ID"
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
        />
        <button
          onClick={fetchMatchResults}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Results
        </button>
        <ul className="mt-2 space-y-1">
          {matchResults.map((match) => (
            <li key={match.match_no} className="border p-2 rounded">
              Match #{match.match_no} — {match.play_date} — Result:{" "}
              {match.results}
            </li>
          ))}
        </ul>
      </section>

      {/* Top Scorer */}
      <section>
        <h2 className="text-xl">Top Scorer</h2>
        <button
          onClick={fetchTopScorer}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Get Top Scorer
        </button>
        {topScorer && (
          <p className="mt-2">
            Player ID: {topScorer.player_id} — Goals: {topScorer.goal_count}
          </p>
        )}
      </section>

      {/* Red Carded Players */}
      <section>
        <h2 className="text-xl">Players with Red Cards</h2>
        <button
          onClick={fetchRedCards}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          View Red Cards
        </button>
        <ul className="mt-2 space-y-1">
          {redCards.map((card, idx) => (
            <li key={idx} className="border p-2 rounded">
              Player ID: {card.player_id} — Team ID: {card.team_id} — Match:{" "}
              {card.match_no}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl">Team Members</h2>

        {/* Team ID input */}
        <input
          className="border p-2 w-full"
          placeholder="Team ID"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />

        {/* Fetch button */}
        <button
          onClick={fetchTeamMembers}
          className="mt-2 bg-purple-500 text-white px-4 py-2 rounded"
        >
          Fetch Team Info
        </button>

        {/* Results */}
        {(teamMembers.players?.length > 0 ||
          teamMembers.support?.length > 0 ||
          teamMembers.captain?.length > 0) && (
          <div className="mt-4 space-y-2">
            {teamMembers.players?.length > 0 && (
              <>
                <h3 className="font-semibold">Players</h3>
                <ul>
                  {teamMembers.players.map((p, i) => (
                    <li key={i}>
                      Player: {p.player_name ?? "Unknown"}(ID: {p.player_id})
                    </li>
                  ))}
                </ul>
              </>
            )}
            {teamMembers.support?.length > 0 && (
              <>
                <h3 className="font-semibold mt-2">Support Staff</h3>
                <ul>
                  {teamMembers.support.map((s, i) => (
                    <li key={i}>
                      ID: {s.support_id} — Role: {s.support_type}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {teamMembers.captain?.length > 0 && (
              <>
                <h3 className="font-semibold mt-2">Captain(s)</h3>
                <ul>
                  {teamMembers.captain.map((c, i) => (
                    <li key={i}>
                      Captain: {c.captain_name ?? "Unknown"} (ID:{" "}
                      {c.player_captain})
                    </li>
                  ))}
                </ul>
              </>
            )}
            {""}{" "}
          </div>
        )}
      </section>
    </div>
  );
}
