
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
type Bankroll = { id:string; name:string; created_at:string };
export default function B(){
  const [l,setL]=useState<Bankroll[]>([]); const [n,setN]=useState('');
  async function load(){ const {data}=await supabase.from('bankrolls').select('*').order('created_at',{ascending:false}); setL((data||[]) as Bankroll[]); }
  useEffect(()=>{ load(); },[]);
  async function create(){ if(!n.trim()) return; await supabase.from('bankrolls').insert({name:n}); setN(''); load(); }
  return (<div className='card'>
    <h1>Bankroll</h1>
    <div style={{display:'flex',gap:8,margin:'12px 0'}}>
      <input value={n} onChange={e=>setN(e.target.value)} placeholder='Nome' style={{padding:8,flex:1}}/>
      <button onClick={create} style={{padding:'8px 12px',background:'#00f0ff22',color:'#00f0ff',borderRadius:8}}>Crea</button>
    </div>
    <div>{l.map(b=>(<div key={b.id} style={{padding:10,border:'1px solid #222',borderRadius:8,marginBottom:8}}>
      <a href={`/bankroll/${b.id}`}>{b.name}</a> <span style={{opacity:.6,fontSize:12,marginLeft:8}}>{new Date(b.created_at).toLocaleString()}</span>
    </div>))}{l.length===0 && <div style={{opacity:.7}}>Nessun bankroll.</div>}</div>
  </div>);
}
