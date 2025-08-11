
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Bet, kpis } from '../../lib/math';
export default function A(){
  const [bets,setBets]=useState<Bet[]>([]);
  useEffect(()=>{(async()=>{const {data}=await supabase.from('bets').select('*'); setBets((data||[]) as Bet[]);})()},[]);
  const {profit,stakes,roi,winPct,maxDD}=kpis(bets);
  return (<div className='card'><h1>Analytics</h1><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
    <K l='Profit' v={profit.toFixed(2)} /><K l='Stakes' v={stakes.toFixed(2)} /><K l='ROI' v={roi.toFixed(2)+'%'} />
    <K l='Win %' v={winPct.toFixed(1)+'%'} /><K l='Max DD' v={maxDD.toFixed(2)} />
  </div></div>);
}
function K({l,v}:{l:string,v:string}){return(<div style={{background:'#00000055',padding:10,border:'1px solid #222',borderRadius:8}}><div style={{opacity:.6,fontSize:12}}>{l}</div><div style={{fontWeight:700}}>{v}</div></div>)}
