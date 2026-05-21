'use client'

import { useEffect, useState } from 'react'

const PLAYERS_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSg3DKAUUzqFxtkDD9jOpgK8UxdFb7LtjLYiEQzmJxRtqgyTazpPJBOLDk4pfyRRx4C_xtyj0FWVgCv/pub?gid=0&single=true&output=csv'

const BATTLES_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSg3DKAUUzqFxtkDD9jOpgK8UxdFb7LtjLYiEQzmJxRtqgyTazpPJBOLDk4pfyRRx4C_xtyj0FWVgCv/pub?gid=901416296&single=true&output=csv'

export default function Home() {
  const [players, setPlayers] = useState([])
  const [battles, setBattles] = useState([])
  const [page, setPage] = useState(0)

  const pages = [
    'intro',
    'malaysia1',
    'malaysia2',
    'perak1',
    'perak2',
    'branch1',
    'branch2',
    'state',
    'battle'
  ]

  useEffect(() => {
    loadData()

    const timer = setInterval(() => {
      setPage(prev => (prev + 1) % pages.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  async function loadData() {
    const playerText = await fetch(PLAYERS_CSV).then(r => r.text())
    const battleText = await fetch(BATTLES_CSV).then(r => r.text())

    setPlayers(csvToJson(playerText))
    setBattles(csvToJson(battleText))
  }

  const malaysia = [...players].sort(
    (a, b) => Number(b.points || 0) - Number(a.points || 0)
  )

  const perak = malaysia.filter(
    p =>
      String(p.state || '').toUpperCase().includes('PERAK')
  )

  const branch = malaysia.filter(
    p =>
      String(p.branch || '').toUpperCase().includes('BOTANI')
  )

  const current = pages[page]

  return (
    <main className="screen">
      <style>{css}</style>

      <aside className="sidebar">
        <div className="logo">
          <div className="sv">SV</div>
          <div>LADDER</div>
          <small>SNOOKER TOURNAMENT MALAYSIA</small>
        </div>

        <div className="nav active">
          AUTO ROTATING TV SYSTEM
        </div>

        <div className="time">
          <small>SYSTEM TIME</small>
          <b>
            {new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </b>
          <span>● LIVE</span>
        </div>
      </aside>

      <section className="main">
        <TopStats players={players} />

        {current === 'intro' && <Intro />}
        {current === 'malaysia1' && (
          <Ranking
            title="MALAYSIA RANKING TOP 32"
            subtitle="PAGE 1 / 2"
            players={malaysia.slice(0, 16)}
            start={1}
          />
        )}

        {current === 'malaysia2' && (
          <Ranking
            title="MALAYSIA RANKING TOP 32"
            subtitle="PAGE 2 / 2"
            players={malaysia.slice(16, 32)}
            start={17}
          />
        )}

        {current === 'perak1' && (
          <Ranking
            title="PERAK RANKING TOP 32"
            subtitle="PAGE 1 / 2"
            players={perak.slice(0, 16)}
            start={1}
          />
        )}

        {current === 'perak2' && (
          <Ranking
            title="PERAK RANKING TOP 32"
            subtitle="PAGE 2 / 2"
            players={perak.slice(16, 32)}
            start={17}
          />
        )}

        {current === 'branch1' && (
          <Ranking
            title="BOTANI BRANCH TOP 32"
            subtitle="PAGE 1 / 2"
            players={branch.slice(0, 16)}
            start={1}
          />
        )}

        {current === 'branch2' && (
          <Ranking
            title="BOTANI BRANCH TOP 32"
            subtitle="PAGE 2 / 2"
            players={branch.slice(16, 32)}
            start={17}
          />
        )}

        {current === 'state' && <StateRanking />}
        {current === 'battle' && (
          <BattlePage battles={battles} />
        )}

        <TierGuide />
      </section>
    </main>
  )
}

function csvToJson(csv) {
  const lines = csv.split('\n')
  const headers = lines[0].split(',')

  return lines.slice(1).map(line => {
    const values = line.split(',')
    let obj = {}

    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]
    })

    return obj
  })
}

function TopStats({ players }) {
  return (
    <div className="topStats">
      <Stat label="TOTAL PLAYERS" value={players.length} />
      <Stat label="TOTAL BRANCHES" value="24" />
      <Stat label="TOTAL MATCHES" value="7,890" />
      <Stat label="ACTIVE STATES" value="13" />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <small>{label}</small>
      <b>{value}</b>
    </div>
  )
}

function Intro() {
  return (
    <div className="hero panel">
      <div>
        <small>SV LADDER SYSTEM</small>

        <h1>
          THE MOST COMPETITIVE
          <br />
          SNOOKER LADDER
          <br />
          IN MALAYSIA
        </h1>

        <p>
          Climb the ladder, challenge opponents,
          represent your branch, earn ranking points,
          and become one of Malaysia's elite snooker players.
        </p>
      </div>

      <div className="bigText">
        PLAY
        <br />
        CLIMB
        <br />
        DOMINATE
      </div>
    </div>
  )
}

function Ranking({ title, subtitle, players, start }) {
  return (
    <div className="panel ranking">
      <div className="panelHead">
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>

      <div className="rankGrid">
        {players.map((p, i) => (
          <div className="rankRow" key={i}>
            <b className="rankNo">{start + i}</b>

            <div className="avatar">
              {String(p.name || '?')
                .slice(0, 1)
                .toUpperCase()}
            </div>

            <div>
              <strong>{p.name}</strong>
              <small>{p.branch}</small>
            </div>

            <TierBadge tier={p.tier} />

            <b className="points">{p.points}</b>
          </div>
        ))}
      </div>
    </div>
  )
}

function TierBadge({ tier }) {
  const t = String(tier || '').toLowerCase()

  let cls = 'bronze'

  if (t.includes('silver')) cls = 'silver'
  if (t.includes('gold')) cls = 'gold'
  if (t.includes('plat')) cls = 'platinum'
  if (t.includes('master')) cls = 'master'
  if (t.includes('challenger')) cls = 'challenger'

  return (
    <div className={`tier ${cls}`}>
      <span>◆</span>
      <small>{tier}</small>
    </div>
  )
}

function StateRanking() {
  const states = [
    'SELANGOR',
    'JOHOR',
    'PERAK',
    'PENANG',
    'KEDAH',
    'SABAH',
    'SARAWAK',
    'PAHANG'
  ]

  return (
    <div className="panel state">
      <div className="panelHead">
        <h2>STATE RANKING</h2>
      </div>

      <div className="stateGrid">
        {states.map((s, i) => (
          <div className="stateRow" key={s}>
            <b>{i + 1}</b>
            <span>{s}</span>
            <strong>{2800 - i * 120}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function BattlePage({ battles }) {
  return (
    <div className="panel battle">
      <div className="panelHead">
        <h2>UPCOMING BATTLE</h2>
      </div>

      <div className="battleGrid">
        {battles.slice(0, 8).map((b, i) => (
          <div className="battleRow" key={i}>
            <b>{i + 1}</b>

            <span>
              {b.player_a} VS {b.player_b}
            </span>

            <strong>
              {b.date} {b.time}
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function TierGuide() {
  return (
    <div className="tierGuide">
      {[
        'Bronze',
        'Silver',
        'Gold',
        'Platinum',
        'Master',
        'Challenger'
      ].map(t => (
        <TierBadge key={t} tier={t} />
      ))}
    </div>
  )
}

const css = `
body{
margin:0;
background:#02040b;
color:white;
font-family:Arial;
overflow:hidden;
}
.screen{
display:grid;
grid-template-columns:220px 1fr;
min-height:100vh;
background:
radial-gradient(circle at 10% 10%,rgba(0,174,255,.2),transparent 30%),
radial-gradient(circle at 90% 20%,rgba(255,40,70,.2),transparent 30%),
linear-gradient(135deg,#02040b,#08111f 55%,#14040a);
}
.sidebar{
padding:18px;
border-right:1px solid rgba(255,255,255,.1);
background:rgba(0,0,0,.45);
}
.logo{
height:150px;
border-radius:16px;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
background:linear-gradient(135deg,#0077ff,#ff2448);
font-weight:1000;
margin-bottom:18px;
}
.sv{
font-size:52px;
font-style:italic;
}
.nav{
padding:18px;
border-radius:12px;
background:rgba(255,255,255,.05);
font-weight:900;
}
.time{
margin-top:25px;
padding:20px;
border-radius:14px;
background:rgba(255,255,255,.05);
text-align:center;
}
.time b{
display:block;
font-size:32px;
margin:8px 0;
}
.time span{
color:#ff304d;
font-weight:900;
}
.main{
padding:16px;
display:grid;
grid-template-rows:90px 1fr 80px;
gap:14px;
}
.topStats{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:12px;
}
.stat{
padding:16px;
border-radius:14px;
background:linear-gradient(135deg,rgba(0,174,255,.18),rgba(255,40,70,.18));
}
.stat small{
display:block;
font-weight:900;
color:#bbb;
}
.stat b{
font-size:34px;
}
.panel{
border-radius:18px;
background:rgba(0,0,0,.4);
border:1px solid rgba(255,255,255,.08);
overflow:hidden;
}
.panelHead{
padding:18px 22px;
display:flex;
justify-content:space-between;
align-items:center;
border-bottom:1px solid rgba(255,255,255,.08);
}
.panelHead h2{
margin:0;
font-size:34px;
color:#00d9ff;
}
.hero{
display:grid;
grid-template-columns:1fr .8fr;
padding:40px;
}
.hero h1{
font-size:62px;
line-height:1;
margin:20px 0;
}
.hero p{
font-size:20px;
max-width:650px;
color:#ddd;
}
.bigText{
display:flex;
align-items:center;
justify-content:center;
font-size:52px;
font-weight:1000;
line-height:1.2;
text-align:right;
color:#ff304d;
}
.rankGrid{
padding:14px;
display:grid;
grid-template-columns:1fr 1fr;
gap:10px;
}
.rankRow{
display:grid;
grid-template-columns:40px 40px 1fr 130px 80px;
gap:10px;
align-items:center;
padding:10px;
border-radius:12px;
background:rgba(255,255,255,.05);
}
.rankNo{
font-size:22px;
color:#ffd447;
}
.avatar{
width:36px;
height:36px;
border-radius:50%;
display:grid;
place-items:center;
background:linear-gradient(135deg,#00d9ff,#ff304d);
font-weight:1000;
}
.points{
color:#ffd447;
font-size:18px;
text-align:right;
}
.tier{
display:flex;
align-items:center;
gap:8px;
font-size:11px;
font-weight:1000;
text-transform:uppercase;
}
.tier span{
width:28px;
height:28px;
display:grid;
place-items:center;
clip-path:polygon(50% 0,100% 25%,85% 100%,15% 100%,0 25%);
}
.bronze span{background:linear-gradient(135deg,#ffb36b,#8a3f10)}
.silver span{background:linear-gradient(135deg,#fff,#777)}
.gold span{background:linear-gradient(135deg,#fff07a,#d88b00)}
.platinum span{background:linear-gradient(135deg,#8fffff,#0077ff)}
.master span{background:linear-gradient(135deg,#f08cff,#6800ff)}
.challenger span{background:linear-gradient(135deg,#ffd36b,#ff2d2d)}
.stateGrid,.battleGrid{
padding:18px;
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;
}
.stateRow,.battleRow{
display:grid;
grid-template-columns:50px 1fr 120px;
align-items:center;
padding:16px;
border-radius:12px;
background:rgba(255,255,255,.05);
}
.tierGuide{
display:flex;
justify-content:center;
gap:24px;
align-items:center;
border-radius:14px;
background:rgba(255,255,255,.05);
}
`
