
'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { kpis, Bet } from '../../../lib/math';

export default function BR({ params }:{ params:{ id:string }}){
  const id = params.id;
  const [name,setName]=useState('Bankroll'); const [bets,setBets]=useState<Bet[]>([]);
  const [f,setF]=useState({match:'',market:'1X2',outcome:'Home',odds:2.0,stake:100,result:'pending'});
  async function load(){
    const br = await supabase.from('bankrolls').select('*').eq('id',id).single(); if(!br.error) setName((br.data as any).name);
    const {data} = await supabase.from('bets').select('*').eq('bankroll_id',id).order('created_at',{ascending:true}); setBets((data||[]) as Bet[]);
  }
  useEffect(()=>{ load(); },[id]);
  async function add(){
    const {match,market,outcome,odds,stake,result}=f as any;
    const pnl = result==='pending'?0:(result==='win'?(odds*stake-stake):-stake);
    await supabase.from('bets').insert({bankroll_id:id,match,market,outcome,odds,stake,result,pnl});
    setF({...f,match:'',odds:2.0,stake:100,result:'pending'}); load();
  }
  const s = kpis(bets);
  return (<div className='card'>
    <h1>{name}</h1>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,margin:'12px 0'}}>
      <K l='Profit' v={s.profit.toFixed(2)} />
      <K l='ROI' v={s.roi.toFixed(2)+'%'} />
      <K l='Win%' v={s.winPct.toFixed(1)+'%'} />
    </div>
    <h2 style={{marginTop:12}}>Aggiungi scommessa</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
      <input placeholder='Match' value={f.match} onChange={e=>setF({...f,match:e.target.value})}/>
      <input placeholder='Mercato' value={f.market} onChange={e=>setF({...f,market:e.target.value})}/>
      <input placeholder='Outcome' value={f.outcome} onChange={e=>setF({...f,outcome:e.target.value})}/>
      <input type='number' placeholder='Quota' value={f.odds} onChange={e=>setF({...f,odds:parseFloat(e.target.value)})}/>
      <input type='number' placeholder='Stake' value={f.stake} onChange={e=>setF({...f,stake:parseFloat(e.target.value)})}/>
      <select value={f.result} onChange={e=>setF({...f,result:e.target.value})}>
        <option value='pending'>pending</option>
        <option value='win'>win</option>
        <option value='lose'>lose</option>
      </select>
    </div>
    <button onClick={add} style={{marginTop:10,padding:'8px 12px',background:'#00f0ff22',color:'#00f0ff',borderRadius:8}}>Aggiungi</button>
    <h2 style={{marginTop:16}}>Scommesse</h2>
    <table style={{width:'100%',fontSize:14}}>
      <thead><tr><th>Data</th><th>Match</th><th>Mercato</th><th>Sel</th><th>Odds</th><th>Stake</th><th>P/L</th></tr></thead>
      <tbody>{bets.map(b=>(<tr key={b.id}>
        <td>{(b.created_at||'').slice(0,16).replace('T',' ')}</td>
        <td>{b.match}</td><td>{b.market}</td><td>{b.outcome}</td>
        <td style={{textAlign:'right'}}>{b.odds?.toFixed(2)}</td>
        <td style={{textAlign:'right'}}>{b.stake?.toFixed(2)}</td>
        <td style={{textAlign:'right',color:(b.pnl??0)>=0?'#19c37d':'#ff4b4b'}}>{(b.pnl??0).toFixed(2)}</td>
      </tr>))}</tbody>
    </table>
  </div>);
}
function K({l,v}:{l:string,v:string}){return(<div style={{background:'#00000055',padding:10,border:'1px solid #222',borderRadius:8}}><div style={{opacity:.6,fontSize:12}}>{l}</div><div style={{fontWeight:700}}>{v}</div></div>)}
