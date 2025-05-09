import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({
    team_id: "",
    tr_id: "",
    team_group: "A",
  });
  const [captain, setCaptain] = useState({
    match_no: "",
    team_id: "",
    player_id: "",
  });
  const [approval, setApproval] = useState({
    player_id: "",
    team_id: "",
    tr_id: "",
  });
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const { data, error } = await supabase.from("tournament").select("*");
    if (!error) setTournaments(data);
  };

  const handleAddTournament = async () => {
    const { error } = await supabase.from("tournament").insert({
      tr_name: newTournament.name,
      start_date: newTournament.start_date,
      end_date: newTournament.end_date,
    });
    if (!error) {
      fetchTournaments();
      setNewTournament({ name: "", start_date: "", end_date: "" });
    }
  };

  const handleAddTeam = async () => {
    const { error } = await supabase.from("tournament_team").insert({
      team_id: newTeam.team_id,
      tr_id: newTeam.tr_id,
      team_group: newTeam.team_group,
      match_played: 0,
      won: 0,
      draw: 0,
      lost: 0,
      goal_for: 0,
      goal_against: 0,
      goal_diff: 0,
      points: 0,
      group_position: 0,
    });
    if (!error) setNewTeam({ team_id: "", tr_id: "", team_group: "A" });
  };

  const handleSelectCaptain = async () => {
    const { error } = await supabase.from("match_captain").insert({
      match_no: captain.match_no,
      team_id: captain.team_id,
      player_captain: captain.player_id,
    });
    if (!error) setCaptain({ match_no: "", team_id: "", player_id: "" });
  };

  const handleApprovePlayer = async () => {
    const { error } = await supabase
      .from("team_player")
      .update({ status: "approved" })
      .eq("player_id", Number(approval.player_id))
      .eq("team_id", approval.team_id)
      .eq("tr_id", approval.tr_id);
    if (!error) setApproval({ player_id: "", team_id: "", tr_id: "" });
  };

  const handleDeleteTournament = async () => {
    const { error } = await supabase
      .from("tournament")
      .delete()
      .eq("tr_id", deleteId);
    if (!error) {
      fetchTournaments();
      setDeleteId("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Add Tournament</h2>
          <input
            className="w-full border p-2 mb-2"
            placeholder="Tournament Name"
            value={newTournament.name}
            onChange={(e) =>
              setNewTournament({ ...newTournament, name: e.target.value })
            }
          />
          <input
            className="w-full border p-2 mb-2"
            type="date"
            value={newTournament.start_date}
            onChange={(e) =>
              setNewTournament({ ...newTournament, start_date: e.target.value })
            }
          />
          <input
            className="w-full border p-2 mb-2"
            type="date"
            value={newTournament.end_date}
            onChange={(e) =>
              setNewTournament({ ...newTournament, end_date: e.target.value })
            }
          />
          <button
            onClick={handleAddTournament}
            className="bg-green-500 text-white px-4 py-2 w-full rounded"
          >
            Add Tournament
          </button>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Add Team to Tournament</h2>
          <input
            className="w-full border p-2 mb-2"
            placeholder="Team ID"
            value={newTeam.team_id}
            onChange={(e) =>
              setNewTeam({ ...newTeam, team_id: e.target.value })
            }
          />
          <input
            className="w-full border p-2 mb-2"
            placeholder="Tournament ID"
            value={newTeam.tr_id}
            onChange={(e) => setNewTeam({ ...newTeam, tr_id: e.target.value })}
          />
          <button
            onClick={handleAddTeam}
            className="bg-blue-500 text-white px-4 py-2 w-full rounded"
          >
            Add Team
          </button>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Select Team Captain</h2>
          <input
            className="w-full border p-2 mb-2"
            placeholder="Match No"
            value={captain.match_no}
            onChange={(e) =>
              setCaptain({ ...captain, match_no: e.target.value })
            }
          />
          <input
            className="w-full border p-2 mb-2"
            placeholder="Team ID"
            value={captain.team_id}
            onChange={(e) =>
              setCaptain({ ...captain, team_id: e.target.value })
            }
          />
          <input
            className="w-full border p-2 mb-2"
            placeholder="Player ID (Captain)"
            value={captain.player_id}
            onChange={(e) =>
              setCaptain({ ...captain, player_id: e.target.value })
            }
          />
          <button
            onClick={handleSelectCaptain}
            className="bg-purple-500 text-white px-4 py-2 w-full rounded"
          >
            Assign Captain
          </button>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Approve Player</h2>
          <input
            className="w-full border p-2 mb-2"
            placeholder="Player ID"
            value={approval.player_id}
            onChange={(e) =>
              setApproval({ ...approval, player_id: e.target.value })
            }
          />
          <input
            className="w-full border p-2 mb-2"
            placeholder="Team ID"
            value={approval.team_id}
            onChange={(e) =>
              setApproval({ ...approval, team_id: e.target.value })
            }
          />
          <input
            className="w-full border p-2 mb-2"
            placeholder="Tournament ID"
            value={approval.tr_id}
            onChange={(e) =>
              setApproval({ ...approval, tr_id: e.target.value })
            }
          />
          <button
            onClick={handleApprovePlayer}
            className="bg-yellow-500 text-white px-4 py-2 w-full rounded"
          >
            Approve Player
          </button>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Delete Tournament</h2>
          <input
            className="w-full border p-2 mb-2"
            placeholder="Tournament ID to Delete"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
          />
          <button
            onClick={handleDeleteTournament}
            className="bg-red-600 text-white px-4 py-2 w-full rounded"
          >
            Delete Tournament
          </button>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Existing Tournaments</h2>
          <ul className="space-y-2">
            {tournaments.map((t) => (
              <li key={t.tr_id} className="border p-2 rounded shadow">
                {t.tr_name} ({t.start_date} – {t.end_date})
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
