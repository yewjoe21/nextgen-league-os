'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [players, setPlayers] = useState([])
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
    loadPlayers()
    const timer = setInterval(() => {
      setPage(prev => (prev + 1) % pages.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  async function loadPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('winning_points', { ascending: false })

    setPlayers(data || [])
  }

  const malaysia = players
  const perak = players.filter(p => String(p.branch || '').toUpperCase().includes('IPOH') || String(p.branch || '').toUpperCase().includes('BOTANI'))
  const branch = players.filter(p => String(p.branch || '').toUpperCase().includes('BOTANI'))

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

        {['HOME','MALAYSIA RANKING','PERAK RANKING','BRANCH RANKING','STATE RANKING','UPCOMING BATTLE'].map((x,i)=>(
          <div className={i === page % 6 ? 'nav active' : 'nav'} key={x}>{x}</div>
        ))}

        <div className="time">
          <small>SYSTEM TIME</small>
          <b>{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</b>
          <span>● LIVE</span>
        </div>
      </aside>

      <section className="main">
        <TopStats players={players} />

        {current === 'intro' && <Intro />}
        {current === 'malaysia1' && <Ranking title="MALAYSIA RANKING TOP 32" subtitle="PAGE 1 / 2" players={malaysia.slice(0,16)} color="blue" start={1} />}
        {current === 'malaysia2' && <Ranking title="MALAYSIA RANKING TOP 32" subtitle="PAGE 2 / 2" players={malaysia.slice(16,32)} color="blue" start={17} />}
        {current === 'perak1' && <Ranking title="PERAK RANKING TOP 32" subtitle="PAGE 1 / 2" players={perak.slice(0,16)} color="red" start={1} />}
        {current === 'perak2' && <Ranking title="PERAK RANKING TOP 32" subtitle="PAGE 2 / 2" players={perak.slice(16,32)} color="red" start={17} />}
        {current === 'branch1' && <Ranking title="BOTANI BRANCH TOP 32" subtitle="PAGE 1 / 2" players={branch.slice(0,16)} color="purple" start={1} />}
        {current === 'branch2' && <Ranking title="BOTANI BRANCH TOP 32" subtitle="PAGE 2 / 2" players={branch.slice(16,32)} color="purple" start={17} />}
        {current === 'state' && <StateRanking />}
        {current === 'battle' && <BattlePage />}

        <TierGuide />
      </section>
    </main>
  )
}

function TopStats({players}) {
  const total = players.length
  const highBreak = Math.max(...players.map(p => Number(p.high_break || 0)), 0)
  return (
    <div className="topStats">
      <Stat label="TOTAL PLAYERS" value={total} />
      <Stat label="TOTAL BRANCHES" value="24" />
      <Stat label="TOTAL MATCHES" value="7,890" />
      <Stat label="HIGHEST BREAK" value={highBreak || 147} />
      <Stat label="AVG ACCURACY" value="94.2%" />
    </div>
  )
}

function Stat({label,value}) {
  return <div className="stat"><small>{label}</small><b>{value}</b></div>
}

function Intro() {
  return (
    <div className="hero panel">
      <div>
        <small>SV LADDER SNOOKER TOURNAMENT MALAYSIA</small>
        <h1>THE MOST PRESTIGIOUS<br/><span>SNOOKER LADDER SYSTEM</span></h1>
        <p>
          A competitive ranking platform designed to recognize and reward snooker players across Malaysia.
          Players earn points, climb tiers, represent their branch, and prove their skill through fair ranking.
        </p>
        <div className="features">
          <div>FAIR PLAY</div>
          <div>MERIT BASED</div>
          <div>EARN POINTS</div>
          <div>NATIONAL RANKING</div>
        </div>
      </div>
      <div className="heroText">CLIMB THE RANKS<br/>PROVE YOUR SKILL<br/><span>BECOME A LEGEND</span></div>
    </div>
  )
}

function Ranking({title, subtitle, players, color, start}) {
  return (
    <div className={`panel ranking ${color}`}>
      <div className="panelHead">
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>

      <div className="rankGrid">
        {players.map((p,i)=>(
          <div className="rankRow" key={p.id || i}>
            <b className="rankNo">{start + i}</b>
            <div className="avatar">{String(p.name || '?').slice(0,1)}</div>
            <div>
              <strong>{p.name || 'Player'}</strong>
              <small>{p.branch || 'MALAYSIA'}</small>
            </div>
            <TierBadge tier={p.tier || 'Bronze'} />
            <b className="points">{p.winning_points || p.rating || 0}</b>
          </div>
        ))}

        {players.length === 0 && (
          <div className="empty">No player data yet. Add players in Supabase.</div>
        )}
      </div>
    </div>
  )
}

function TierBadge({tier}) {
  const t = String(tier).toLowerCase()
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
  const states = ['SELANGOR','JOHOR','PERAK','KEDAH','PENANG','SABAH','TERENGGANU','MELAKA','NEGERI SEMBILAN','PAHANG','SARAWAK','PUTRAJAYA','WP KUALA LUMPUR','LABUAN','KELANTAN','PERLIS']
  return (
    <div className="panel state">
      <div className="panelHead"><h2>STATE RANKING TOP 32</h2><span>PAGE 1 / 2</span></div>
      <div className="stateGrid">
        {states.map((s,i)=>(
          <div className="stateRow" key={s}>
            <b>{i+1}</b>
            <span>{s}</span>
            <strong>{2890 - i*130}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function BattlePage() {
  const battles = ['BOTANI VS FALIM','IPOH VS TAIPING','PENANG VS KL','JOHOR VS SELANGOR','PERAK VS KEDAH','MELAKA VS SABAH','SARAWAK VS PAHANG','LABUAN VS PUTRAJAYA']
  return (
    <div className="panel battle">
      <div className="panelHead"><h2>UPCOMING BATTLE</h2><span>LOCAL + STATE VS STATE</span></div>
      <div className="battleGrid">
        {battles.map((b,i)=>(
          <div className="battleRow" key={b}>
            <b>{i+1}</b>
            <span>{b}</span>
            <strong>{22+i} MAY · 8:00PM</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function TierGuide() {
  return (
    <div className="tierGuide">
      {['Bronze','Silver','Gold','Platinum','Master','Challenger'].map(t=>(
        <TierBadge key={t} tier={t} />
      ))}
    </div>
  )
}

const css = `
*{box-sizing:border-box}
body{margin:0;background:#03050b;color:white;font-family:Arial,Helvetica,sans-serif;overflow:hidden}
.screen{
  min-height:100vh;
  display:grid;
  grid-template-columns:230px 1fr;
  background:
    radial-gradient(circle at 15% 15%,rgba(0,140,255,.28),transparent 28%),
    radial-gradient(circle at 90% 20%,rgba(255,30,60,.28),transparent 30%),
    linear-gradient(135deg,#03050b,#07111f 55%,#120409);
}
.sidebar{
  border-right:1px solid rgba(0,174,255,.35);
  background:linear-gradient(180deg,rgba(0,30,70,.75),rgba(0,0,0,.88));
  padding:18px 14px;
}
.logo{
  height:150px;
  border:1px solid rgba(0,174,255,.45);
  border-radius:14px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  background:linear-gradient(135deg,rgba(0,100,255,.15),rgba(255,0,40,.12));
  box-shadow:0 0 24px rgba(0,174,255,.25);
  margin-bottom:18px;
}
.sv{font-size:52px;font-weight:1000;font-style:italic;background:linear-gradient(90deg,#fff,#00aeff,#ff2448);-webkit-background-clip:text;color:transparent}
.logo div:nth-child(2){font-size:24px;font-weight:1000}
.logo small{font-size:10px;color:#ddd;letter-spacing:1px;text-align:center}
.nav{
  padding:15px 18px;
  margin:8px 0;
  border:1px solid rgba(255,255,255,.08);
  border-radius:10px;
  background:rgba(255,255,255,.035);
  font-weight:900;
  font-size:14px;
}
.nav.active{
  color:white;
  border-color:#ff2448;
  background:linear-gradient(90deg,rgba(255,36,72,.65),rgba(0,174,255,.18));
  box-shadow:0 0 22px rgba(255,36,72,.4);
}
.time{
  margin-top:28px;
  padding:22px;
  border:1px solid rgba(255,36,72,.35);
  border-radius:14px;
  text-align:center;
  background:rgba(0,0,0,.4);
}
.time b{font-size:32px;display:block;margin:8px 0}
.time span{color:#ff2448;font-weight:900}
.main{padding:14px;display:grid;grid-template-rows:96px 1fr 90px;gap:14px}
.topStats{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:12px;
}
.stat{
  border:1px solid rgba(255,255,255,.12);
  border-radius:12px;
  background:linear-gradient(135deg,rgba(0,174,255,.16),rgba(255,36,72,.12));
  padding:16px 20px;
  box-shadow:0 0 22px rgba(0,174,255,.12);
}
.stat small{font-size:12px;color:#aaa;font-weight:900}
.stat b{display:block;font-size:34px;color:#fff;margin-top:4px}
.panel{
  border-radius:16px;
  border:1px solid rgba(0,174,255,.35);
  background:linear-gradient(135deg,rgba(5,12,24,.92),rgba(0,0,0,.88));
  box-shadow:0 0 30px rgba(0,174,255,.15), inset 0 0 40px rgba(255,36,72,.06);
  overflow:hidden;
}
.hero{
  display:grid;
  grid-template-columns:1.2fr .8fr;
  padding:40px;
  background:
    radial-gradient(circle at 60% 40%,rgba(0,174,255,.22),transparent 35%),
    radial-gradient(circle at 90% 50%,rgba(255,36,72,.25),transparent 30%),
    linear-gradient(135deg,rgba(5,12,24,.94),rgba(0,0,0,.88));
}
.hero small{color:#00d9ff;font-weight:900;letter-spacing:2px}
.hero h1{font-size:58px;line-height:1.02;margin:18px 0;font-weight:1000}
.hero h1 span{color:#ff2448}
.hero p{font-size:18px;color:#d7d7d7;max-width:720px;line-height:1.5}
.heroText{
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:34px;
  font-weight:1000;
  line-height:1.3;
  text-align:right;
}
.heroText span{color:#ff2448}
.features{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:26px}
.features div{padding:16px;border:1px solid rgba(0,174,255,.25);border-radius:12px;text-align:center;font-weight:900;color:#00d9ff}
.panelHead{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:15px 20px;
  border-bottom:1px solid rgba(255,255,255,.1);
}
.panelHead h2{margin:0;font-size:28px;font-weight:1000}
.panelHead span{font-weight:900;color:#ddd}
.ranking.blue .panelHead h2{color:#00d9ff}
.ranking.red .panelHead h2{color:#ff304d}
.ranking.purple .panelHead h2{color:#d550ff}
.rankGrid{
  padding:14px;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px 12px;
}
.rankRow{
  display:grid;
  grid-template-columns:42px 42px 1fr 130px 90px;
  gap:10px;
  align-items:center;
  min-height:48px;
  padding:7px 12px;
  border:1px solid rgba(255,255,255,.08);
  border-radius:10px;
  background:linear-gradient(90deg,rgba(255,255,255,.06),rgba(255,255,255,.02));
}
.rankNo{color:#ffd447;font-size:20px;text-align:center}
.avatar{
  width:36px;height:36px;border-radius:50%;
  display:grid;place-items:center;
  background:linear-gradient(135deg,#00d9ff,#ff2448);
  font-weight:1000;color:#000;
}
.rankRow strong{font-size:15px}
.rankRow small{display:block;color:#aaa;font-size:10px;font-weight:900}
.points{color:#ffd447;text-align:right;font-size:18px}
.tier{
  display:flex;
  align-items:center;
  gap:7px;
  font-size:11px;
  font-weight:1000;
  text-transform:uppercase;
}
.tier span{
  width:28px;height:28px;border-radius:8px;
  display:grid;place-items:center;
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
  grid-template-columns:50px 1fr 130px;
  align-items:center;
  padding:14px 18px;
  border:1px solid rgba(255,255,255,.1);
  border-radius:12px;
  background:rgba(255,255,255,.045);
}
.stateRow b,.battleRow b{color:#ffd447;font-size:22px}
.stateRow strong,.battleRow strong{color:#ffb347;text-align:right}
.tierGuide{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:34px;
  border:1px solid rgba(255,255,255,.1);
  border-radius:16px;
  background:linear-gradient(90deg,rgba(0,174,255,.12),rgba(255,36,72,.12));
}
.empty{
  grid-column:1/3;
  padding:30px;
  color:#aaa;
  text-align:center;
}
`
