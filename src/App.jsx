import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine } from "recharts";

// ═══════════════════════════ DATA ═══════════════════════════

const hadlock = {
  id:"hadlock", name:"Hadlock 1991", short:"Hadlock", color:"#e74c3c",
  weeks:[10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
  p3: [26,34,43,55,70,88,110,136,167,205,248,299,359,426,503,589,685,791,908,1034,1169,1313,1465,1622,1783,1946,2110,2271,2427,2576,2714],
  p10:[29,37,48,61,77,97,121,150,185,227,275,331,398,471,556,652,758,876,1004,1145,1294,1453,1621,1794,1973,2154,2335,2513,2686,2851,3004],
  p50:[35,45,58,73,93,117,146,181,223,273,331,399,478,568,670,785,913,1055,1210,1379,1559,1751,1953,2162,2377,2595,2813,3028,3236,3435,3619],
  p90:[41,53,68,85,109,137,171,212,261,319,387,467,559,665,784,918,1068,1234,1416,1613,1824,2049,2285,2530,2781,3036,3291,3543,3786,4019,4234],
  p97:[44,56,73,91,116,146,183,226,279,341,414,499,598,710,838,981,1141,1319,1513,1724,1949,2189,2441,2703,2971,3244,3516,3785,4045,4294,4524],
};

const ig17 = {
  id:"ig17", name:"INTERGROWTH 2017", short:"IG-2017", color:"#27ae60",
  weeks:[22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
  p3: [463,516,575,641,716,800,892,994,1106,1227,1357,1495,1641,1792,1948,2106,2265,2422,2574],
  p10:[481,538,602,674,757,849,951,1065,1190,1326,1473,1630,1795,1967,2144,2321,2495,2663,2818],
  p50:[525,592,669,756,856,969,1097,1239,1396,1568,1755,1954,2162,2378,2594,2806,3006,3186,3338],
  p90:[578,658,751,858,980,1119,1276,1452,1647,1860,2089,2332,2583,2838,3089,3326,3541,3722,3858],
  p97:[607,695,796,913,1048,1202,1375,1569,1783,2016,2266,2529,2800,3071,3335,3582,3799,3976,4101],
};

const ig20 = {
  id:"ig20", name:"INTERGROWTH 2020", short:"IG-2020", color:"#2980b9",
  weeks:[18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41],
  p3: [184,224,271,324,385,453,530,616,710,813,925,1046,1175,1312,1455,1604,1757,1913,2070,2226,2379,2527,2667,2798],
  p10:[193,235,284,341,405,478,559,650,751,862,982,1113,1252,1400,1556,1718,1885,2056,2228,2400,2569,2733,2888,3034],
  p50:[216,263,318,381,454,537,630,734,851,979,1119,1272,1435,1610,1795,1988,2189,2394,2602,2811,3017,3217,3409,3588],
  p90:[244,297,359,430,513,607,714,834,968,1116,1279,1457,1649,1854,2072,2300,2538,2782,3031,3280,3527,3768,3999,4217],
  p97:[260,316,381,457,544,645,758,887,1030,1189,1364,1554,1760,1981,2216,2462,2719,2983,3251,3522,3789,4051,4302,4538],
};

// WHO combined - p3/p97 via quantile regression (Kiserud 2017 coefficients, Carvalho)
const who = {
  id:"who", name:"WHO 2017", short:"WHO", color:"#8e44ad",
  weeks:[14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
  p3: [71,90,114,142,176,216,262,316,378,449,528,617,714,822,938,1063,1197,1339,1488,1642,1802,1965,2131,2298,2464,2628,2789],
  p10:[78,99,124,155,192,235,286,345,412,489,576,673,780,898,1026,1165,1313,1470,1635,1807,1985,2167,2352,2537,2723,2905,3084],
  p50:[90,114,144,179,222,272,330,398,476,565,665,778,902,1039,1189,1350,1523,1707,1901,2103,2312,2527,2745,2966,3186,3403,3617],
  p90:[104,132,166,207,255,313,380,458,548,650,765,894,1038,1196,1368,1554,1753,1964,2187,2419,2659,2904,3153,3403,3652,3897,4135],
  p97:[112,143,179,223,276,338,410,494,591,701,825,963,1117,1286,1471,1670,1883,2110,2349,2598,2857,3122,3392,3665,3938,4208,4474],
};

// WHO female - p3/p97 via quantile regression (Kiserud 2017 coefficients)
const whoF = {
  id:"whoF", name:"WHO 2017 (female)", short:"WHO \u2640", color:"#e84393",
  weeks:[14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
  p3: [71,90,114,142,175,214,260,312,372,441,517,603,699,804,919,1043,1176,1317,1465,1620,1778,1938,2096,2251,2397,2532,2651],
  p10:[77,97,122,152,188,231,281,338,405,481,567,663,769,886,1013,1150,1297,1452,1614,1783,1957,2134,2313,2492,2669,2843,3012],
  p50:[89,113,141,176,217,266,322,388,464,551,649,758,880,1014,1160,1319,1489,1670,1861,2061,2268,2481,2698,2917,3136,3354,3567],
  p90:[102,129,162,201,248,304,369,444,530,629,740,865,1003,1156,1323,1504,1699,1907,2127,2358,2598,2846,3100,3358,3617,3875,4129],
  p97:[111,140,176,218,269,329,398,479,572,679,799,933,1083,1248,1428,1624,1834,2057,2293,2540,2794,3054,3317,3578,3835,4083,4318],
};

// WHO male - p3/p97 via quantile regression (Kiserud 2017 coefficients)
const whoM = {
  id:"whoM", name:"WHO 2017 (male)", short:"WHO \u2642", color:"#0984e3",
  weeks:[14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
  p3: [72,92,116,145,180,221,270,325,389,461,542,633,733,843,962,1090,1226,1371,1522,1679,1841,2005,2171,2337,2500,2659,2812],
  p10:[79,100,127,158,196,241,293,354,424,503,592,692,803,924,1056,1197,1349,1509,1677,1852,2032,2217,2403,2591,2778,2962,3143],
  p50:[92,116,146,183,226,277,337,407,487,578,681,796,923,1063,1215,1380,1555,1741,1937,2140,2350,2564,2782,3000,3217,3432,3641],
  p90:[105,134,169,210,260,320,389,469,561,666,785,917,1063,1224,1399,1587,1788,2001,2224,2456,2695,2939,3185,3432,3676,3916,4149],
  p97:[115,145,182,226,279,342,415,501,599,711,838,980,1138,1311,1500,1705,1923,2155,2399,2653,2916,3185,3458,3734,4009,4282,4551],
};

const ALL_SOURCES = [hadlock, ig17, ig20, who, whoF, whoM];

// ═══════════════════════════ HELPERS ═══════════════════════════

const PERCENTILES = ["p3","p10","p50","p90","p97"];
const PERC_LABELS = {p3:"3-й",p10:"10-й",p50:"50-й (медиана)",p90:"90-й",p97:"97-й"};
const PERC_STYLES = {
  p3:  {dash:"4 3",width:1.2,opacity:0.75},
  p10: {dash:"2 2",width:1.6,opacity:0.9},
  p50: {dash:"0",  width:2.5,opacity:1.0},
  p90: {dash:"2 2",width:1.6,opacity:0.9},
  p97: {dash:"4 3",width:1.2,opacity:0.75},
};

function getVal(src,week,perc){
  const i=src.weeks.indexOf(week);
  if(i===-1)return null;
  return src[perc]?(src[perc][i]!=null?src[perc][i]:null):null;
}

function commonWeeks(sources){
  let min=Math.max(...sources.map(s=>s.weeks[0]));
  let max=Math.min(...sources.map(s=>s.weeks[s.weeks.length-1]));
  const r=[];for(let w=min;w<=max;w++)r.push(w);return r;
}

function buildData(sources,perc,weeks){
  return weeks.map(w=>{
    const row={week:w};
    sources.forEach(s=>{row[s.short]=getVal(s,w,perc);});
    return row;
  }).filter(r=>sources.some(s=>r[s.short]!==null));
}

function buildAllPercData(sources,weeks){
  return weeks.map(w=>{
    const row={week:w};
    sources.forEach(s=>{PERCENTILES.forEach(p=>{row[s.short+"_"+p]=getVal(s,w,p);});});
    return row;
  });
}

function buildDiffData(a,b,perc,weeks){
  return weeks.map(w=>{
    const va=getVal(a,w,perc),vb=getVal(b,w,perc);
    if(va===null||vb===null)return null;
    return{week:w,diff:va-vb,pct:((va-vb)/vb*100).toFixed(1)};
  }).filter(Boolean);
}

// ═══════════════════════════ STYLES ═══════════════════════════

const P={bg:"#0f1117",card:"#181b24",border:"#262a36",text:"#e8e8ed",muted:"#8b8fa3",grid:"#262a36",tip:"#1e2130"};

const S={
  page:{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:P.bg,color:P.text,minHeight:"100vh",padding:"24px 16px"},
  header:{textAlign:"center",marginBottom:32},
  h1:{fontSize:26,fontWeight:700,letterSpacing:"-0.5px",margin:0,background:"linear-gradient(135deg,#e74c3c,#2980b9,#27ae60,#8e44ad)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  subtitle:{color:P.muted,fontSize:13,marginTop:6},
  toggleSection:{marginBottom:24,textAlign:"center"},
  toggleLabel:{fontSize:12,color:P.muted,marginBottom:10,fontWeight:500},
  toggleRow:{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"},
  toggle:(active,color)=>({padding:"8px 14px",borderRadius:8,border:"2px solid "+(active?color:P.border),background:active?color+"22":"transparent",color:active?"#fff":P.muted,cursor:"pointer",fontSize:13,fontWeight:active?600:400,transition:"all .15s"}),
  percTabs:{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginBottom:20},
  percTab:a=>({padding:"5px 12px",borderRadius:6,border:"1px solid "+(a?"#f39c12":P.border),background:a?"#f39c1222":"transparent",color:a?"#f5c842":P.muted,cursor:"pointer",fontSize:12,fontWeight:a?600:400}),
  card:{background:P.card,borderRadius:14,border:"1px solid "+P.border,padding:"20px 16px",marginBottom:20},
  cardTitle:{fontSize:15,fontWeight:600,marginBottom:14,color:P.text},
  table:{width:"100%",borderCollapse:"collapse",fontSize:12},
  th:{padding:"8px 6px",borderBottom:"2px solid "+P.border,textAlign:"right",color:P.muted,fontWeight:600,position:"sticky",top:0,background:P.card},
  thL:{textAlign:"left"},
  td:{padding:"6px",borderBottom:"1px solid "+P.border+"22",textAlign:"right",fontVariantNumeric:"tabular-nums"},
  tdL:{textAlign:"left",fontWeight:600,color:P.muted},
  dP:{color:"#e74c3c"},dN:{color:"#2980b9"},
  legend:{display:"flex",gap:16,justifyContent:"center",marginBottom:12,flexWrap:"wrap"},
  legendItem:{display:"flex",alignItems:"center",gap:5,fontSize:12,color:P.muted},
  legendDot:c=>({width:10,height:10,borderRadius:"50%",background:c}),
  scroll:{overflowX:"auto",WebkitOverflowScrolling:"touch"},
  percLegend:{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:8,fontSize:11,color:P.muted},
  percLI:{display:"flex",alignItems:"center",gap:5},
};

// ═══════════════════════════ TOOLTIPS ═══════════════════════════

const CTip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(<div style={{background:P.tip,border:"1px solid "+P.border,borderRadius:8,padding:"10px 14px",fontSize:12}}>
    <div style={{fontWeight:700,marginBottom:6}}>Неделя {label}</div>
    {payload.map((p,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",gap:16,color:p.color}}>
      <span>{p.name}</span><span style={{fontWeight:600}}>{p.value!=null?p.value+" г":"—"}</span>
    </div>))}
  </div>);
};

const APTip=({active,payload,label,sources})=>{
  if(!active||!payload?.length)return null;
  const by={};
  payload.forEach(p=>{const[sh,pc]=p.dataKey.split("_");if(!by[sh])by[sh]={color:p.color,v:{}};by[sh].v[pc]=p.value;});
  return(<div style={{background:P.tip,border:"1px solid "+P.border,borderRadius:8,padding:"10px 14px",fontSize:11,minWidth:200}}>
    <div style={{fontWeight:700,marginBottom:6,fontSize:12}}>Неделя {label}</div>
    {sources.map(s=>{const d=by[s.short];if(!d)return null;return(<div key={s.short} style={{marginBottom:6}}>
      <div style={{color:s.color,fontWeight:600,marginBottom:2}}>{s.name}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4,fontSize:10}}>
        {PERCENTILES.map(p=>(<div key={p} style={{textAlign:"center"}}><div style={{color:P.muted}}>{PERC_LABELS[p].split(" ")[0]}</div><div style={{fontWeight:600}}>{d.v[p]!=null?d.v[p]:"—"}</div></div>))}
      </div>
    </div>);})}
  </div>);
};

const DTip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  const d=payload[0]?.payload;
  return(<div style={{background:P.tip,border:"1px solid "+P.border,borderRadius:8,padding:"10px 14px",fontSize:12}}>
    <div style={{fontWeight:700,marginBottom:6}}>Неделя {label}</div>
    <div>Разница: <b>{d.diff>0?"+":""}{d.diff} г</b></div>
    <div>Относительная: <b>{d.pct>0?"+":""}{d.pct}%</b></div>
  </div>);
};

// ═══════════════════════════ CHARTS ═══════════════════════════

function CompChart({sources,perc,weeks,h=340}){
  const data=buildData(sources,perc,weeks);
  return(<ResponsiveContainer width="100%" height={h}><LineChart data={data} margin={{top:8,right:12,left:0,bottom:4}}>
    <CartesianGrid strokeDasharray="3 3" stroke={P.grid}/>
    <XAxis dataKey="week" tick={{fill:P.muted,fontSize:11}} label={{value:"Неделя",position:"insideBottomRight",offset:-4,fill:P.muted,fontSize:11}}/>
    <YAxis tick={{fill:P.muted,fontSize:11}} label={{value:"Вес (г)",angle:-90,position:"insideLeft",offset:10,fill:P.muted,fontSize:11}}/>
    <Tooltip content={<CTip/>}/>
    <Legend wrapperStyle={{fontSize:12}}/>
    {sources.map(s=>(<Line key={s.short} type="monotone" dataKey={s.short} name={s.name} stroke={s.color} strokeWidth={2.5} dot={{r:2.5}} activeDot={{r:5}} connectNulls/>))}
  </LineChart></ResponsiveContainer>);
}

function AllPChart({sources,weeks,h=420}){
  const data=buildAllPercData(sources,weeks);
  return(<ResponsiveContainer width="100%" height={h}><LineChart data={data} margin={{top:8,right:12,left:0,bottom:4}}>
    <CartesianGrid strokeDasharray="3 3" stroke={P.grid}/>
    <XAxis dataKey="week" tick={{fill:P.muted,fontSize:11}} label={{value:"Неделя",position:"insideBottomRight",offset:-4,fill:P.muted,fontSize:11}}/>
    <YAxis tick={{fill:P.muted,fontSize:11}} label={{value:"Вес (г)",angle:-90,position:"insideLeft",offset:10,fill:P.muted,fontSize:11}}/>
    <Tooltip content={<APTip sources={sources}/>}/>
    {sources.map(s=>PERCENTILES.map(p=>{const st=PERC_STYLES[p];return(<Line key={s.short+"_"+p} type="monotone" dataKey={s.short+"_"+p} name={s.short+" "+PERC_LABELS[p].split(" ")[0]} stroke={s.color} strokeWidth={st.width} strokeDasharray={st.dash} strokeOpacity={st.opacity} dot={false} activeDot={{r:3}} connectNulls legendType="none"/>);}))}
  </LineChart></ResponsiveContainer>);
}

function DiffChart({a,b,perc,weeks,h=280}){
  const data=buildDiffData(a,b,perc,weeks);
  return(<ResponsiveContainer width="100%" height={h}><BarChart data={data} margin={{top:8,right:12,left:0,bottom:4}}>
    <CartesianGrid strokeDasharray="3 3" stroke={P.grid}/>
    <XAxis dataKey="week" tick={{fill:P.muted,fontSize:11}}/>
    <YAxis tick={{fill:P.muted,fontSize:11}} label={{value:"\u0394 (\u0433)",angle:-90,position:"insideLeft",offset:10,fill:P.muted,fontSize:11}}/>
    <Tooltip content={<DTip/>}/>
    <ReferenceLine y={0} stroke={P.muted} strokeDasharray="3 3"/>
    <Bar dataKey="diff" name="Разница (г)" fill={a.color} radius={[3,3,0,0]} fillOpacity={0.8}
      shape={props=>{const{x,y,width,height:hh,payload}=props;const f=payload.diff>=0?a.color:b.color;return (<rect x={x} y={y} width={width} height={Math.abs(hh)} rx={3} fill={f} fillOpacity={0.7}/>);}}/>
  </BarChart></ResponsiveContainer>);
}

// ═══════════════════════════ TABLE ═══════════════════════════

function CompTable({sources,perc,weeks}){
  const pair=sources.length===2;
  return(<div style={S.scroll}><table style={S.table}><thead><tr>
    <th style={{...S.th,...S.thL}}>Нед.</th>
    {sources.map(s=><th key={s.short} style={{...S.th,color:s.color}}>{s.short}</th>)}
    {pair&&<th style={{...S.th,color:"#f39c12"}}>{"\u0394"} (г)</th>}
    {pair&&<th style={{...S.th,color:"#f39c12"}}>{"\u0394"} (%)</th>}
  </tr></thead><tbody>
    {weeks.map(w=>{
      const vals=sources.map(s=>getVal(s,w,perc));
      if(vals.every(v=>v===null))return null;
      const diff=pair&&vals[0]!=null&&vals[1]!=null?vals[0]-vals[1]:null;
      const pct=diff!==null?((diff/vals[1])*100).toFixed(1):null;
      return(<tr key={w}>
        <td style={{...S.td,...S.tdL}}>{w}</td>
        {vals.map((v,i)=><td key={i} style={S.td}>{v!=null?v:"—"}</td>)}
        {pair&&<td style={{...S.td,...(diff>0?S.dP:diff<0?S.dN:{})}}>{diff!==null?(diff>0?"+":"")+diff:"—"}</td>}
        {pair&&<td style={{...S.td,...(parseFloat(pct)>0?S.dP:parseFloat(pct)<0?S.dN:{})}}>{pct!==null?(pct>0?"+":"")+pct+"%":"—"}</td>}
      </tr>);
    })}
  </tbody></table></div>);
}

function LineIcon({dash,width,opacity}){
  return (<svg width="28" height="8" style={{display:"inline-block"}}><line x1="0" y1="4" x2="28" y2="4" stroke={P.muted} strokeWidth={width} strokeDasharray={dash==="0"?undefined:dash} strokeOpacity={opacity}/></svg>);
}

// ═══════════════════════════ MAIN ═══════════════════════════

export default function App(){
  const [active,setActive]=useState({hadlock:true,ig17:true,ig20:true,who:false,whoF:false,whoM:false});
  const [perc,setPerc]=useState("p50");

  const toggle=id=>{
    const next={...active,[id]:!active[id]};
    // at least 1 must remain
    if(Object.values(next).every(v=>!v))return;
    setActive(next);
  };

  const sources=ALL_SOURCES.filter(s=>active[s.id]);
  const weeks=sources.length?commonWeeks(sources):[];
  const isPair=sources.length===2;

  return(<div style={S.page}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <header style={S.header}>
      <h1 style={S.h1}>Сравнение нормативов ПМП</h1>
      <p style={S.subtitle}>Hadlock 1991 · INTERGROWTH-21st 2017 / 2020 · WHO 2017</p>
    </header>

    {/* Source toggles */}
    <div style={S.toggleSection}>
      <div style={S.toggleLabel}>Выберите нормативы для сравнения:</div>
      <div style={S.toggleRow}>
        {ALL_SOURCES.map(s=>(<button key={s.id} style={S.toggle(active[s.id],s.color)} onClick={()=>toggle(s.id)}>{s.short}</button>))}
      </div>
      <div style={{fontSize:11,color:P.muted,marginTop:8}}>
        Выбрано: {sources.length} {sources.length===1?"норматив":sources.length<5?"норматива":"нормативов"}
        {isPair?" · Показана разница между двумя":""}
      </div>
    </div>

    {/* Percentile selector */}
    <div style={S.percTabs}>
      {PERCENTILES.map(p=>(<button key={p} style={S.percTab(perc===p)} onClick={()=>setPerc(p)}>{PERC_LABELS[p]}</button>))}
    </div>

    {/* Legend */}
    <div style={S.legend}>
      {sources.map(s=>(<div key={s.short} style={S.legendItem}><div style={S.legendDot(s.color)}/><span>{s.name}</span></div>))}
    </div>

    {sources.length===0?(<div style={{...S.card,textAlign:"center",color:P.muted}}>Выберите хотя бы один норматив</div>):(
    <>
      {/* Main chart */}
      <div style={S.card}>
        <div style={S.cardTitle}>{PERC_LABELS[perc]} перцентиль — абсолютные значения (г)</div>
        <CompChart sources={sources} perc={perc} weeks={weeks}/>
      </div>

      {/* All percentiles */}
      <div style={S.card}>
        <div style={S.cardTitle}>Все перцентили (3 / 10 / 50 / 90 / 97) — коридоры нормы</div>
        <div style={S.percLegend}>
          <div style={S.percLI}><LineIcon {...PERC_STYLES.p3}/><span>3-й / 97-й</span></div>
          <div style={S.percLI}><LineIcon {...PERC_STYLES.p10}/><span>10-й / 90-й</span></div>
          <div style={S.percLI}><LineIcon {...PERC_STYLES.p50}/><span>50-й (медиана)</span></div>
        </div>
        <p style={{fontSize:11,color:P.muted,margin:"0 0 12px",textAlign:"center"}}>Цвет — норматив, стиль линии — перцентиль</p>
        <AllPChart sources={sources} weeks={weeks}/>
      </div>

      {/* Diff chart (pair only) */}
      {isPair&&(<div style={S.card}>
        <div style={S.cardTitle}>Разница: {sources[0].short} - {sources[1].short} ({PERC_LABELS[perc]})</div>
        <p style={{fontSize:12,color:P.muted,margin:"0 0 12px"}}>Положительные — {sources[0].short} больше, отрицательные — {sources[1].short} больше</p>
        <DiffChart a={sources[0]} b={sources[1]} perc={perc} weeks={weeks}/>
      </div>)}

      {/* Table */}
      <div style={S.card}>
        <div style={S.cardTitle}>Таблица — {PERC_LABELS[perc]} перцентиль</div>
        <CompTable sources={sources} perc={perc} weeks={weeks}/>
      </div>

      {/* Summary stats (pair only) */}
      {isPair&&(()=>{
        const diffs=buildDiffData(sources[0],sources[1],perc,weeks);
        if(!diffs.length)return null;
        const abs=diffs.map(d=>Math.abs(d.diff));
        const avg=(diffs.reduce((s,d)=>s+d.diff,0)/diffs.length).toFixed(0);
        const maxA=Math.max(...abs);
        const maxP=diffs.reduce((m,d)=>Math.abs(d.pct)>Math.abs(m)?d.pct:m,0);
        return(<div style={S.card}>
          <div style={S.cardTitle}>Сводная статистика ({PERC_LABELS[perc]})</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
            {[{l:"Средняя разница",v:(avg>0?"+":"")+avg+" г"},{l:"Макс. |разница|",v:maxA+" г"},{l:"Макс. \u0394%",v:(maxP>0?"+":"")+maxP+"%"},{l:"Период",v:weeks[0]+"\u2013"+weeks[weeks.length-1]+" нед."}].map((x,i)=>(<div key={i} style={{background:P.bg,borderRadius:10,padding:"14px 12px",textAlign:"center"}}>
              <div style={{fontSize:11,color:P.muted,marginBottom:4}}>{x.l}</div>
              <div style={{fontSize:18,fontWeight:700,color:"#f5c842"}}>{x.v}</div>
            </div>))}
          </div>
        </div>);
      })()}
    </>)}

    <div style={{textAlign:"center",color:P.muted,fontSize:11,marginTop:20,paddingBottom:20}}>
      Hadlock et al. 1991 · INTERGROWTH-21st (Stirnemann 2017, 2020) · WHO (Kiserud et al. 2017)
    </div>
  </div>);
}