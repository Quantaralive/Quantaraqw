
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Bet, dailyPL } from '../../lib/math';
export default function C(){
  const [bets,setBets]=useState<Bet[]>([]);
  useEffect(()=>{(async()=>{const {data}=await supabase.from('bets').select('*').order('created_at',{ascending:true}); setBets((data||[]) as Bet[]);})()},[]);
  const days = dailyPL(bets);
  return (<div className='card'><h1>Calendario P/L</h1>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
      {days.map(d=>{const pos=d.pl>=0; return (<div key={d.date} style={{padding:10,border:'1px solid #222',borderRadius:8,background:pos?'#0b3d2a':'#3d0b0b'}}>
        <div style={{opacity:.7,fontSize:12}}>{d.date}</div><div style={{fontWeight:700,color:pos?'#19c37d':'#ff4b4b'}}>{(pos?'+':'')+d.pl.toFixed(2)}</div>
      </div>)})}
    </div>
  </div>)
}
