'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('ranking', { ascending: true })

    if (error) {
      console.log(error)
    } else {
      setPlayers(data)
    }
  }

  return (
    <main
      style={{
        background: '#020402',
        minHeight: '100vh',
        color: 'white',
        padding: '40px',
        fontFamily: 'Arial'
      }}
    >
      <h1
        style={{
          color: '#caff00',
          fontSize: '50px',
          fontWeight: '900'
        }}
      >
        NEXTGEN LEAGUE OS
      </h1>

      <p>Malaysia Snooker Ladder Ranking</p>

      <div style={{ marginTop: '40px' }}>
        {players.map((player, index) => (
          <div
            key={player.id}
            style={{
              border: '1px solid #333',
              padding: '20px',
              marginBottom: '10px',
              borderRadius: '10px'
            }}
          >
            <h2>
              #{index + 1} - {player.name}
            </h2>

            <p>Points: {player.points}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
