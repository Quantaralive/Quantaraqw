
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
const demo=[
  {match:'Juventus - Milan',market:'1X2',options:[{label:'Juventus',odds:2.10},{label:'Draw',odds:3.30},{label:'Milan',odds:3.40}]},
  {match:'Arsenal - Chelsea',market:'1X2',options:[{label:'Arsenal',odds:1.80},{label:'Draw',odds:3.60},{label:'Chelsea',odds:4.20}]},
];
export default function M(){
  const [br,setBr]=useState<{id:string;name:string}[]>([]);
  useEffect(()=>{(async()=>{const {data}=await supabase.from('bankrolls').select('id,name').order('created_at',{ascending:false}); setBr((data||[]) as any);})()},[]);
  async function add(id:string, match:string, market:string, outcome:string, odds:number){
    const s=prompt('Stake (€)?'); if(!s) return; const stake=parseFloat(s); if(!stake) return;
    await supabase.from('bets').insert({bankroll_id:id,match,market,outcome,odds,stake,result:'pending',pnl:0});
    alert('Aggiunta! Vai nel bankroll per vederla.');
  }
  return (<div className='card'><h1>Quote (demo)</h1>
    {demo.map((m,i)=>(<div key={i} style={{margin:'12px 0',padding:12,border:'1px solid #222',borderRadius:8}}>
      <div style={{fontWeight:700}}>{m.match}</div><div style={{opacity:.7,fontSize:12}}>{m.market}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginTop:8}}>
        {m.options.map((o,j)=>(<div key={j} style={{display:'flex',gap:8,alignItems:'center'}}>
          <select id={`br-${i}-${j}`} style={{padding:8,borderRadius:8,background:'#0b0c10',color:'#fff',border:'1px solid #222',minWidth:160}}>
            {br.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <button onClick={()=>{const el=document.getElementById(`br-${i}-${j}`) as HTMLSelectElement|null; const bid=el?.value||''; if(!bid) return alert('Crea prima un bankroll'); add(bid,m.match,m.market,o.label,o.odds);}}
            style={{padding:'8px 12px',background:'#00f0ff22',color:'#00f0ff',borderRadius:8}}>{o.label} @ {o.odds.toFixed(2)}</button>
        </div>))}
      </div>
    </div>))}
  </div>)
}
