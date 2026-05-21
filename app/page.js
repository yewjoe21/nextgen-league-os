"use client"

import { useEffect, useState } from "react"

export default function Home() {

  const pages = [
    "MATCHES",
    "RANKING",
    "PLAYERS",
    "LIVE TABLES"
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % pages.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  return (
    <main style={{
      background:"#000",
      color:"#caff00",
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      fontSize:"60px",
      fontWeight:"900"
    }}>
      {pages[index]}
    </main>
  )
}
