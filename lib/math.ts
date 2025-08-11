
export type Bet = { id:string; bankroll_id:string; match:string; market:string|null; outcome:string|null; odds:number|null; stake:number|null; result:string|null; pnl:number|null; created_at:string|null; };
export function kpis(bets: Bet[]) {
  const settled = bets.filter(b=>b.result && b.pnl!==null);
  const stakes = settled.reduce((s,b)=> s + (b.stake ?? 0), 0);
  const profit = settled.reduce((s,b)=> s + (b.pnl ?? 0), 0);
  const roi = stakes ? (profit / stakes) * 100 : 0;
  const wins = settled.filter(b=> (b.result||'').toLowerCase()==='win').length;
  const winPct = settled.length ? (wins/settled.length)*100 : 0;
  let eq=0, peak=0, maxDD=0;
  settled.forEach(b=>{ eq += (b.pnl ?? 0); peak=Math.max(peak,eq); maxDD=Math.min(maxDD, eq-peak); });
  return {profit, stakes, roi, winPct, maxDD};
}
export function dailyPL(bets: Bet[]) {
  const map = new Map<string, number>();
  bets.forEach(b=>{ const d = (b.created_at||'').slice(0,10); map.set(d, (map.get(d)??0) + (b.pnl ?? 0)); });
  return Array.from(map.entries()).map(([date,pl])=>({date, pl})).sort((a,b)=> a.date.localeCompare(b.date));
}
