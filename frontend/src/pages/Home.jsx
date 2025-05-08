import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    async function fetchTournaments() {
      const { data, error } = await supabase
        .from('tournament')
        .select('*');

      if (error) {
        console.error('Error fetching tournaments:', error);
      } else {
        setTournaments(data);
      }
    }

    fetchTournaments();
  }, []);

  return (
    <div>
      <h1>Tournaments</h1>
      <ul>
        {tournaments.map(t => (
          <li key={t.tr_id}>{t.tr_name}</li>
        ))}
      </ul>
    </div>
  );
}
