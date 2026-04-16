import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine } from "recharts";

const hadlock = {
  name: "Hadlock 1991",
  short: "Hadlock",
  color: "#e74c3c",
  weeks: [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
  p3:  [26,34,43,55,70,88,110,136,167,205,248,299,359,426,503,589,685,791,908,1034,1169,1313,1465,1622,1783,1946,2110,2271,2427,2576,2714],
  p10: [29,37,48,61,77,97,121,150,185,227,275,331,398,471,556,652,758,876,1004,1145,1294,1453,1621,1794,1973,2154,2335,2513,2686,2851,3004],
  p50: [35,45,58,73,93,117,146,181,223,273,331,399,478,568,670,785,913,1055,1210,1379,1559,1751,1953,2162,2377,2595,2813,3028,3236,3435,3619],
  p90: [41,53,68,85,109,137,171,212,261,319,387,467,559,665,784,918,1068,1234,1416,1613,1824,2049,2285,2530,2781,3036,3291,3543,3786,4019,4234],
  p97: [44,56,73,91,116,146,183,226,279,341,414,499,598,710,838,981,1141,1319,1513,1724,1949,2189,2441,2703,2971,3244,3516,3785,4045,4294,4524],
};

const ig20 = {
  name: "INTERGROWTH 2020",
  short: "IG-2020",
  color: "#2980b9",
  weeks: [18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41],
  p3:  [184,224,271,324,385,453,530,616,710,813,925,1046,1175,1312,1455,1604,1757,1913,2070,2226,2379,2527,2667,2798],
  p5:  [187,228,276,330,392,463,541,629,726,832,947,1072,1205,1346,1494,1648,1807,1968,2131,2293,2453,2607,2753,2889],
  p10: [193,235,284,341,405,478,559,650,751,862,982,1113,1252,1400,1556,1718,1885,2056,2228,2400,2569,2733,2888,3034],
  p50: [216,263,318,381,454,537,630,734,851,979,1119,1272,1435,1610,1795,1988,2189,2394,2602,2811,3017,3217,3409,3588],
  p90: [244,297,359,430,513,607,714,834,968,1116,1279,1457,1649,1854,2072,2300,2538,2782,3031,3280,3527,3768,3999,4217],
  p95: [253,308,372,446,532,629,740,865,1005,1160,1330,1515,1716,1930,2158,2397,2646,2902,3163,3425,3684,3937,4180,4409],
  p97: [260,316,381,457,544,645,758,887,1030,1189,1364,1554,1760,1981,2216,2462,2719,2983,3251,3522,3789,4051,4302,4538],
};

const ig16 = {
  name: "INTERGROWTH 2017",
  short: "IG-2017",
  color: "#27ae60",
  weeks: [22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
  p3:  [463,516,575,641,716,800,892,994,1106,1227,1357,1495,1641,1792,1948,2106,2265,2422,2574],
  p5:  [470,524,585,654,732,818,915,1021,1138,1265,1401,1547,1700,1860,2024,2190,2355,2516,2670],
  p10: [481,538,602,674,757,849,951,1065,1190,1326,1473,1630,1795,1967,2144,2321,2495,2663,2818],
  p50: [525,592,669,756,856,969,1097,1239,1396,1568,1755,1954,2162,2378,2594,2806,3006,3186,3338],
  p90: [578,658,751,858,980,1119,1276,1452,1647,1860,2089,2332,2583,2838,3089,3326,3541,3722,3858],
  p95: [596,680,778,891,1020,1168,1335,1521,1728,1953,2195,2450,2713,2978,3237,3480,3697,3876,4006],
  p97: [607,695,796,913,1048,1202,1375,1569,1783,2016,2266,2529,2800,3071,3335,3582,3799,3976,4101],
};

const PERCENTILES = ["p3","p10","p50","p90","p97"];
const PERC_LABELS = { p3:"3-й", p10:"10-й", p50:"50-й (медиана)", p90:"90-й", p97:"97-й" };

// Line styles for each percentile in the "all percentiles" chart
const PERC_STYLES = {
  p3:  { dash: "4 3", width: 1.2, opacity: 0.75 },
  p10: { dash: "2 2", width: 1.6, opacity: 0.9 },
  p50: { dash: "0",   width: 2.5, opacity: 1.0 },
  p90: { dash: "2 2", width: 1.6, opacity: 0.9 },
  p97: { dash: "4 3", width: 1.2, opacity: 0.75 },
};

function getVal(source, week, perc) {
  const idx = source.weeks.indexOf(week);
  if (idx === -1) return null;
  return source[perc] ? (source[perc][idx] != null ? source[perc][idx] : null) : null;
}

function buildComparisonData(sources, percKey, weekRange) {
  return weekRange.map(w => {
    const row = { week: w };
    sources.forEach(s => { row[s.short] = getVal(s, w, percKey); });
    return row;
  }).filter(r => sources.some(s => r[s.short] !== null));
}

function buildAllPercentilesData(sources, weekRange) {
  return weekRange.map(w => {
    const row = { week: w };
    sources.forEach(s => {
      PERCENTILES.forEach(p => {
        row[s.short + "_" + p] = getVal(s, w, p);
      });
    });
    return row;
  });
}

function buildDiffData(a, b, percKey, weekRange) {
  return weekRange.map(w => {
    const va = getVal(a, w, percKey);
    const vb = getVal(b, w, percKey);
    if (va === null || vb === null) return null;
    return { week: w, diff: va - vb, pct: ((va - vb) / vb * 100).toFixed(1) };
  }).filter(Boolean);
}

function commonWeeks(sources) {
  let min = Math.max(...sources.map(s => s.weeks[0]));
  let max = Math.min(...sources.map(s => s.weeks[s.weeks.length - 1]));
  const r = [];
  for (let w = min; w <= max; w++) r.push(w);
  return r;
}

const palette = {
  bg: "#0f1117", card: "#181b24", cardBorder: "#262a36",
  text: "#e8e8ed", textMuted: "#8b8fa3",
  grid: "#262a36", tooltipBg: "#1e2130",
};

const css = {
  page: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: palette.bg, color: palette.text, minHeight: "100vh", padding: "24px 16px" },
  header: { textAlign: "center", marginBottom: 32 },
  h1: { fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", margin: 0, background: "linear-gradient(135deg, #e74c3c, #2980b9, #27ae60)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { color: palette.textMuted, fontSize: 13, marginTop: 6 },
  tabs: { display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 },
  tab: (active) => ({ padding: "8px 16px", borderRadius: 8, border: "1px solid " + (active ? "#2980b9" : palette.cardBorder), background: active ? "#2980b922" : palette.card, color: active ? "#fff" : palette.textMuted, cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400 }),
  percTabs: { display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 },
  percTab: (active) => ({ padding: "5px 12px", borderRadius: 6, border: "1px solid " + (active ? "#f39c12" : palette.cardBorder), background: active ? "#f39c1222" : "transparent", color: active ? "#f5c842" : palette.textMuted, cursor: "pointer", fontSize: 12, fontWeight: active ? 600 : 400 }),
  card: { background: palette.card, borderRadius: 14, border: "1px solid " + palette.cardBorder, padding: "20px 16px", marginBottom: 20 },
  cardTitle: { fontSize: 15, fontWeight: 600, marginBottom: 14, color: palette.text },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: { padding: "8px 6px", borderBottom: "2px solid " + palette.cardBorder, textAlign: "right", color: palette.textMuted, fontWeight: 600, position: "sticky", top: 0, background: palette.card },
  thFirst: { textAlign: "left" },
  td: { padding: "6px 6px", borderBottom: "1px solid " + palette.cardBorder + "22", textAlign: "right", fontVariantNumeric: "tabular-nums" },
  tdFirst: { textAlign: "left", fontWeight: 600, color: palette.textMuted },
  diffPos: { color: "#e74c3c" },
  diffNeg: { color: "#2980b9" },
  legend: { display: "flex", gap: 16, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: palette.textMuted },
  legendDot: (color) => ({ width: 10, height: 10, borderRadius: "50%", background: color }),
  scrollBox: { overflowX: "auto", WebkitOverflowScrolling: "touch" },
  percLegend: { display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 8, fontSize: 11, color: palette.textMuted },
  percLegendItem: { display: "flex", alignItems: "center", gap: 5 },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: palette.tooltipBg, border: "1px solid " + palette.cardBorder, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Неделя {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: p.color }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{p.value != null ? p.value + " г" : "—"}</span>
        </div>
      ))}
    </div>
  );
};

const AllPercTooltip = ({ active, payload, label, sources }) => {
  if (!active || !payload?.length) return null;
  // Group by source
  const bySource = {};
  payload.forEach(p => {
    const [short, perc] = p.dataKey.split("_");
    if (!bySource[short]) bySource[short] = { color: p.color, values: {} };
    bySource[short].values[perc] = p.value;
  });
  return (
    <div style={{ background: palette.tooltipBg, border: "1px solid " + palette.cardBorder, borderRadius: 8, padding: "10px 14px", fontSize: 11, minWidth: 200 }}>
      <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12 }}>Неделя {label}</div>
      {sources.map(s => {
        const data = bySource[s.short];
        if (!data) return null;
        return (
          <div key={s.short} style={{ marginBottom: 6 }}>
            <div style={{ color: s.color, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, fontSize: 10 }}>
              {PERCENTILES.map(p => (
                <div key={p} style={{ textAlign: "center" }}>
                  <div style={{ color: palette.textMuted }}>{PERC_LABELS[p].split(" ")[0]}</div>
                  <div style={{ fontWeight: 600 }}>{data.values[p] != null ? data.values[p] : "—"}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DiffTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: palette.tooltipBg, border: "1px solid " + palette.cardBorder, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Неделя {label}</div>
      <div>Разница: <b>{d.diff > 0 ? "+" : ""}{d.diff} г</b></div>
      <div>Относительная: <b>{d.pct > 0 ? "+" : ""}{d.pct}%</b></div>
    </div>
  );
};

function CompChart({ sources, percKey, weekRange, height = 340 }) {
  const data = buildComparisonData(sources, percKey, weekRange);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
        <XAxis dataKey="week" tick={{ fill: palette.textMuted, fontSize: 11 }} label={{ value: "Неделя", position: "insideBottomRight", offset: -4, fill: palette.textMuted, fontSize: 11 }} />
        <YAxis tick={{ fill: palette.textMuted, fontSize: 11 }} label={{ value: "Вес (г)", angle: -90, position: "insideLeft", offset: 10, fill: palette.textMuted, fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {sources.map(s => (
          <Line key={s.short} type="monotone" dataKey={s.short} name={s.name} stroke={s.color} strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 5 }} connectNulls />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function AllPercentilesChart({ sources, weekRange, height = 420 }) {
  const data = buildAllPercentilesData(sources, weekRange);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
        <XAxis dataKey="week" tick={{ fill: palette.textMuted, fontSize: 11 }} label={{ value: "Неделя", position: "insideBottomRight", offset: -4, fill: palette.textMuted, fontSize: 11 }} />
        <YAxis tick={{ fill: palette.textMuted, fontSize: 11 }} label={{ value: "Вес (г)", angle: -90, position: "insideLeft", offset: 10, fill: palette.textMuted, fontSize: 11 }} />
        <Tooltip content={<AllPercTooltip sources={sources} />} />
        {sources.map(s =>
          PERCENTILES.map(p => {
            const style = PERC_STYLES[p];
            return (
              <Line
                key={s.short + "_" + p}
                type="monotone"
                dataKey={s.short + "_" + p}
                name={s.short + " " + PERC_LABELS[p].split(" ")[0]}
                stroke={s.color}
                strokeWidth={style.width}
                strokeDasharray={style.dash}
                strokeOpacity={style.opacity}
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls
                legendType="none"
              />
            );
          })
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

function DiffChart({ a, b, percKey, weekRange, height = 280 }) {
  const data = buildDiffData(a, b, percKey, weekRange);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
        <XAxis dataKey="week" tick={{ fill: palette.textMuted, fontSize: 11 }} />
        <YAxis tick={{ fill: palette.textMuted, fontSize: 11 }} label={{ value: "Δ (г)", angle: -90, position: "insideLeft", offset: 10, fill: palette.textMuted, fontSize: 11 }} />
        <Tooltip content={<DiffTooltip />} />
        <ReferenceLine y={0} stroke={palette.textMuted} strokeDasharray="3 3" />
        <Bar dataKey="diff" name="Разница (г)" fill={a.color} radius={[3,3,0,0]} fillOpacity={0.8}
          shape={(props) => {
            const { x, y, width, height: h, payload } = props;
            const fill = payload.diff >= 0 ? a.color : b.color;
            return <rect x={x} y={y} width={width} height={Math.abs(h)} rx={3} fill={fill} fillOpacity={0.7} />;
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CompTable({ sources, percKey, weekRange }) {
  const showDiff = sources.length === 2;
  return (
    <div style={css.scrollBox}>
      <table style={css.table}>
        <thead>
          <tr>
            <th style={{ ...css.th, ...css.thFirst }}>Нед.</th>
            {sources.map(s => <th key={s.short} style={{ ...css.th, color: s.color }}>{s.short}</th>)}
            {showDiff && <th style={{ ...css.th, color: "#f39c12" }}>Δ (г)</th>}
            {showDiff && <th style={{ ...css.th, color: "#f39c12" }}>Δ (%)</th>}
          </tr>
        </thead>
        <tbody>
          {weekRange.map(w => {
            const vals = sources.map(s => getVal(s, w, percKey));
            if (vals.every(v => v === null)) return null;
            const diff = showDiff && vals[0] != null && vals[1] != null ? vals[0] - vals[1] : null;
            const pct = diff !== null ? ((diff / vals[1]) * 100).toFixed(1) : null;
            return (
              <tr key={w}>
                <td style={{ ...css.td, ...css.tdFirst }}>{w}</td>
                {vals.map((v, i) => <td key={i} style={css.td}>{v != null ? v : "—"}</td>)}
                {showDiff && <td style={{ ...css.td, ...(diff > 0 ? css.diffPos : diff < 0 ? css.diffNeg : {}) }}>{diff !== null ? (diff > 0 ? "+" : "") + diff : "—"}</td>}
                {showDiff && <td style={{ ...css.td, ...(diff > 0 ? css.diffPos : diff < 0 ? css.diffNeg : {}) }}>{pct !== null ? (pct > 0 ? "+" : "") + pct + "%" : "—"}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Small SVG showing line style
function LineStyleIcon({ dash, width, opacity }) {
  return (
    <svg width="28" height="8" style={{ display: "inline-block" }}>
      <line x1="0" y1="4" x2="28" y2="4" stroke={palette.textMuted} strokeWidth={width} strokeDasharray={dash === "0" ? undefined : dash} strokeOpacity={opacity} />
    </svg>
  );
}

const GROUPS = [
  { id: "all", label: "Все 3 норматива", sources: [hadlock, ig16, ig20] },
  { id: "ig", label: "IG-2017 vs IG-2020", sources: [ig16, ig20] },
  { id: "h16", label: "Hadlock vs IG-2017", sources: [hadlock, ig16] },
  { id: "h20", label: "Hadlock vs IG-2020", sources: [hadlock, ig20] },
];

export default function App() {
  const [groupId, setGroupId] = useState("all");
  const [perc, setPerc] = useState("p50");

  const group = GROUPS.find(g => g.id === groupId);
  const weeks = commonWeeks(group.sources);
  const isPair = group.sources.length === 2;

  return (
    <div style={css.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <header style={css.header}>
        <h1 style={css.h1}>Сравнение нормативов ПМП</h1>
        <p style={css.subtitle}>Hadlock 1991 · INTERGROWTH-21st 2017 · INTERGROWTH-21st 2020</p>
      </header>

      <div style={css.tabs}>
        {GROUPS.map(g => (
          <button key={g.id} style={css.tab(groupId === g.id)} onClick={() => setGroupId(g.id)}>{g.label}</button>
        ))}
      </div>

      <div style={css.percTabs}>
        {PERCENTILES.map(p => (
          <button key={p} style={css.percTab(perc === p)} onClick={() => setPerc(p)}>{PERC_LABELS[p]}</button>
        ))}
      </div>

      <div style={css.legend}>
        {group.sources.map(s => (
          <div key={s.short} style={css.legendItem}>
            <div style={css.legendDot(s.color)} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>

      <div style={css.card}>
        <div style={css.cardTitle}>{PERC_LABELS[perc]} перцентиль — абсолютные значения (г)</div>
        <CompChart sources={group.sources} percKey={perc} weekRange={weeks} />
      </div>

      {/* NEW: All percentiles chart */}
      <div style={css.card}>
        <div style={css.cardTitle}>Все перцентили (3-й / 10-й / 50-й / 90-й / 97-й) — коридоры нормы</div>
        <div style={css.percLegend}>
          <div style={css.percLegendItem}>
            <LineStyleIcon dash={PERC_STYLES.p3.dash} width={PERC_STYLES.p3.width} opacity={PERC_STYLES.p3.opacity} />
            <span>3-й / 97-й</span>
          </div>
          <div style={css.percLegendItem}>
            <LineStyleIcon dash={PERC_STYLES.p10.dash} width={PERC_STYLES.p10.width} opacity={PERC_STYLES.p10.opacity} />
            <span>10-й / 90-й</span>
          </div>
          <div style={css.percLegendItem}>
            <LineStyleIcon dash={PERC_STYLES.p50.dash} width={PERC_STYLES.p50.width} opacity={PERC_STYLES.p50.opacity} />
            <span>50-й (медиана)</span>
          </div>
        </div>
        <p style={{ fontSize: 11, color: palette.textMuted, margin: "0 0 12px", textAlign: "center" }}>
          Цвет линии — норматив, стиль линии — перцентиль. Медиана — сплошная, крайние перцентили — пунктирные.
        </p>
        <AllPercentilesChart sources={group.sources} weekRange={weeks} />
      </div>

      {isPair && (
        <div style={css.card}>
          <div style={css.cardTitle}>Разница: {group.sources[0].short} - {group.sources[1].short} ({PERC_LABELS[perc]})</div>
          <p style={{ fontSize: 12, color: palette.textMuted, margin: "0 0 12px" }}>
            Положительные значения — {group.sources[0].short} больше, отрицательные — {group.sources[1].short} больше
          </p>
          <DiffChart a={group.sources[0]} b={group.sources[1]} percKey={perc} weekRange={weeks} />
        </div>
      )}

      {groupId === "all" && (
        <div style={css.card}>
          <div style={css.cardTitle}>Медианы по неделям — сравнение</div>
          <div style={css.scrollBox}>
            <table style={css.table}>
              <thead>
                <tr>
                  <th style={{ ...css.th, ...css.thFirst }}>Нед.</th>
                  <th style={{ ...css.th, color: hadlock.color }}>Hadlock</th>
                  <th style={{ ...css.th, color: ig16.color }}>IG-2017</th>
                  <th style={{ ...css.th, color: ig20.color }}>IG-2020</th>
                  <th style={{ ...css.th, color: "#f39c12" }}>Макс Δ (г)</th>
                  <th style={{ ...css.th, color: "#f39c12" }}>Макс Δ (%)</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map(w => {
                  const vh = getVal(hadlock, w, "p50");
                  const v16 = getVal(ig16, w, "p50");
                  const v20 = getVal(ig20, w, "p50");
                  const vals = [vh, v16, v20].filter(v => v !== null);
                  const maxD = vals.length >= 2 ? Math.max(...vals) - Math.min(...vals) : null;
                  const minV = Math.min(...vals);
                  const pct = maxD !== null ? ((maxD / minV) * 100).toFixed(1) : null;
                  return (
                    <tr key={w}>
                      <td style={{ ...css.td, ...css.tdFirst }}>{w}</td>
                      <td style={css.td}>{vh != null ? vh : "—"}</td>
                      <td style={css.td}>{v16 != null ? v16 : "—"}</td>
                      <td style={css.td}>{v20 != null ? v20 : "—"}</td>
                      <td style={{ ...css.td, color: "#f39c12" }}>{maxD != null ? maxD : "—"}</td>
                      <td style={{ ...css.td, color: "#f39c12" }}>{pct ? pct + "%" : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={css.card}>
        <div style={css.cardTitle}>Таблица — {PERC_LABELS[perc]} перцентиль</div>
        <CompTable sources={group.sources} percKey={perc} weekRange={weeks} />
      </div>

      {isPair && (() => {
        const diffs = buildDiffData(group.sources[0], group.sources[1], perc, weeks);
        if (!diffs.length) return null;
        const absDiffs = diffs.map(d => Math.abs(d.diff));
        const avgDiff = (diffs.reduce((s, d) => s + d.diff, 0) / diffs.length).toFixed(0);
        const maxAbsDiff = Math.max(...absDiffs);
        const maxPct = diffs.reduce((m, d) => Math.abs(d.pct) > Math.abs(m) ? d.pct : m, 0);
        return (
          <div style={css.card}>
            <div style={css.cardTitle}>Сводная статистика ({PERC_LABELS[perc]})</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
              {[
                { label: "Средняя разница", value: (avgDiff > 0 ? "+" : "") + avgDiff + " г" },
                { label: "Макс. |разница|", value: maxAbsDiff + " г" },
                { label: "Макс. Δ%", value: (maxPct > 0 ? "+" : "") + maxPct + "%" },
                { label: "Период сравнения", value: weeks[0] + "\u2013" + weeks[weeks.length-1] + " нед." },
              ].map((s, i) => (
                <div key={i} style={{ background: palette.bg, borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: palette.textMuted, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#f5c842" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div style={{ textAlign: "center", color: palette.textMuted, fontSize: 11, marginTop: 20, paddingBottom: 20 }}>
        Данные: Hadlock et al. 1991 · INTERGROWTH-21st (Stirnemann 2017) · INTERGROWTH-21st (Stirnemann 2020)
      </div>
    </div>
  );
}
