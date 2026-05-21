import { supabase } from "../lib/supabase"

export default async function Home() {

  const { data: players } = await supabase
    .from("players")
    .select("*")

  return (
    <main style={{
      background: "#020402",
      minHeight: "100vh",
      color: "white",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      <h1 style={{
        color: "#caff00",
        fontSize: "60px",
        fontWeight: "900"
      }}>
        NEXTGEN LEAGUE OS
      </h1>

      <h2>Players</h2>

      {players?.map(player => (
        <div key={player.id}>
          {player.name} - Rating: {player.rating}
        </div>
      ))}
    </main>
  )
}
