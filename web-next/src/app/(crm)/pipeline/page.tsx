"use client";
import { useState, useCallback } from "react";

const DEALS_RAW = [{"asesor":"Alvaro","proyecto":"Pinos","unidad":"1","cliente":"Amaro Casanova","monto_pen":764400,"prob":0.3,"estado":"lead","id":"D001","dias_etapa":12,"score":35},{"asesor":"Arturo","proyecto":"Ugarte y Moscoso 370","unidad":"B 1001","cliente":"Rodolfo Castillo","monto_pen":1492140,"prob":0.3,"estado":"lead","id":"D002","dias_etapa":14,"score":35},{"asesor":"Antonio","proyecto":"Machaypuito","unidad":"502","cliente":"Mitzi Rodriguez","monto_pen":1197530,"prob":0.5,"estado":"negociacion","id":"D003","dias_etapa":4,"score":45},{"asesor":"Antonio","proyecto":"Toribio Polo","unidad":"B202","cliente":"Famny Orbegozo","monto_pen":545670,"prob":0.3,"estado":"lead","id":"D004","dias_etapa":13,"score":35},{"asesor":"Arturo","proyecto":"Ugarte y Moscoso 370","unidad":"A1103","cliente":"Juan Carlos Zorrilla","monto_pen":1259454,"prob":0.3,"estado":"lead","id":"D005","dias_etapa":18,"score":35},{"asesor":"Carlos","proyecto":"Saenz Peña 212","unidad":"102","cliente":"Carla Carty","monto_pen":2221380,"prob":0.3,"estado":"lead","id":"D006","dias_etapa":3,"score":35},{"asesor":"Arturo","proyecto":"Saenz Peña 212","unidad":"101","cliente":"Janett Manchego","monto_pen":383110,"prob":0.9,"estado":"reserva","id":"D007","dias_etapa":15,"score":95},{"asesor":"Carlos","proyecto":"Libertad","unidad":"703","cliente":"Roberto Castillo","monto_pen":645450,"prob":0.5,"estado":"negociacion","id":"D008","dias_etapa":4,"score":49},{"asesor":"Carlos","proyecto":"Pasaje Laureles","unidad":"C202","cliente":"Juan Luis Herrera","monto_pen":931000,"prob":0.9,"estado":"reserva","id":"D009","dias_etapa":4,"score":95},{"asesor":"Carlos","proyecto":"Libertad","unidad":"601","cliente":"Renato Errea","monto_pen":735883,"prob":0.3,"estado":"lead","id":"D010","dias_etapa":3,"score":35},{"asesor":"Carlos","proyecto":"Libertad","unidad":"1002","cliente":"Eduardo Alvarado","monto_pen":771158,"prob":0.3,"estado":"lead","id":"D011","dias_etapa":9,"score":35},{"asesor":"Javier","proyecto":"Ugarte 330","unidad":"A 1003","cliente":"Manuel Salas Paulet","monto_pen":1242850,"prob":0.5,"estado":"negociacion","id":"D012","dias_etapa":20,"score":54},{"asesor":"Javier","proyecto":"Ugarte y Moscoso 370","unidad":"B 1003","cliente":"Fiorella Cerron","monto_pen":1688050,"prob":0.9,"estado":"reserva","id":"D013","dias_etapa":3,"score":89},{"asesor":"Antonio","proyecto":"Dos de Mayo","unidad":"D501","cliente":"Carlos Ramirez","monto_pen":1263963,"prob":0.3,"estado":"lead","id":"D014","dias_etapa":3,"score":35},{"asesor":"Manuela","proyecto":"Pasaje Laureles","unidad":"B202","cliente":"Tania Montoya","monto_pen":1263963,"prob":0.5,"estado":"negociacion","id":"D015","dias_etapa":11,"score":55},{"asesor":"Manuela","proyecto":"Pasaje Laureles","unidad":"C601","cliente":"Oscar Castilla","monto_pen":1263963,"prob":0.5,"estado":"negociacion","id":"D016","dias_etapa":6,"score":45},{"id":"P001","asesor":"Ochoa Victoria","proyecto":"Ugarte y Moscoso 370","unidad":"","cliente":"Mary Rubio","monto_pen":545000,"prob":0.1,"estado":"prospecto","dias_etapa":4,"score":61},{"id":"P002","asesor":"-","proyecto":"Toribio Polo","unidad":"","cliente":"José Humberto Vilchez","monto_pen":165000,"prob":0.1,"estado":"prospecto","dias_etapa":4,"score":58},{"id":"P003","asesor":"-","proyecto":"Ugarte 370","unidad":"","cliente":"Carlos .","monto_pen":165000,"prob":0.1,"estado":"prospecto","dias_etapa":0,"score":57},{"id":"P004","asesor":"-","proyecto":"Pasaje Laureles","unidad":"","cliente":"Celia Nuñez","monto_pen":142000,"prob":0.1,"estado":"prospecto","dias_etapa":0,"score":59},{"id":"P005","asesor":"Arturo","proyecto":"Dos de Mayo","unidad":"","cliente":"Oscar Valenzuela","monto_pen":165000,"prob":0.1,"estado":"prospecto","dias_etapa":5,"score":57},{"id":"P006","asesor":"-","proyecto":"Ugarte 370","unidad":"","cliente":"Daniela Obando","monto_pen":330000,"prob":0.1,"estado":"prospecto","dias_etapa":3,"score":58},{"id":"C001","asesor":"Carlos","proyecto":"Saenz Peña 212","unidad":"102","cliente":"Carla Carty","monto_pen":2221380,"prob":1.0,"estado":"cierre","dias_etapa":3,"score":100},{"id":"C002","asesor":"Arturo","proyecto":"Saenz Peña 212","unidad":"101","cliente":"Janett Manchego","monto_pen":383110,"prob":1.0,"estado":"cierre","dias_etapa":6,"score":100},{"id":"L001","asesor":"Antonio","proyecto":"Dos de Mayo","unidad":"D501","cliente":"Carlos Ramirez","monto_pen":1263963,"prob":0,"estado":"perdida","dias_etapa":21,"score":20}];

type Deal = { id:string; asesor:string; proyecto:string; unidad:string; cliente:string; monto_pen:number; prob:number; estado:string; dias_etapa:number; score:number; };
const STAGE_PROB: Record<string,number> = {prospecto:0.1,lead:0.3,negociacion:0.5,reserva:0.9,cierre:1.0,perdida:0};
const STAGES = [{id:"prospecto",name:"Prospecto"},{id:"lead",name:"Lead"},{id:"negociacion",name:"Negociación"},{id:"reserva",name:"Reserva"},{id:"cierre",name:"Cierre"},{id:"perdida",name:"Pérdida"}];
const META = 12_000_000;
const FX = 3.383;

function initials(name: string) { return name.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }
function fmtK(v: number, cur: string) {
  const val = cur==="USD" ? v/FX : v;
  const s = cur==="USD" ? "$ " : "S/ ";
  if(val>=1e6) return s+(val/1e6).toFixed(2)+"M";
  if(val>=1e3) return s+Math.round(val/1e3)+"K";
  return s+Math.round(val).toLocaleString();
}
function fmt(v: number, cur: string) {
  return cur==="PEN" ? "S/ "+Math.round(v).toLocaleString("es-PE") : "$ "+Math.round(v/FX).toLocaleString("en-US");
}

export default function PipelinePage() {
  const [tab, setTab] = useState<"kanban"|"forecast"|"comite">("kanban");
  const [deals, setDeals] = useState<Deal[]>(DEALS_RAW.map(d=>({...d})));
  const [currency, setCurrency] = useState<"PEN"|"USD">("PEN");
  const [dragId, setDragId] = useState<string|null>(null);
  const [toast, setToast] = useState("");
  const [toastOn, setToastOn] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg); setToastOn(true);
    setTimeout(()=>setToastOn(false), 2800);
  }, []);

  const handleDrop = useCallback((stageId: string) => {
    if (!dragId) return;
    setDeals(prev => prev.map(d => {
      if (d.id !== dragId) return d;
      const stageName = STAGES.find(s=>s.id===stageId)?.name ?? stageId;
      showToast(`${d.cliente}: ${d.estado} → ${stageName}`);
      return {...d, estado:stageId, prob:STAGE_PROB[stageId], dias_etapa:0};
    }));
    setDragId(null);
  }, [dragId, showToast]);

  const scoreClass = (s: number) => s>=75?"sc-high":s>=50?"sc-mid":"sc-low";

  return (
    <div style={{padding:"20px 28px 40px"}}>
      <style>{`
        .pp-tab-bar{display:flex;gap:4px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:9px;padding:3px;margin-bottom:20px;width:fit-content}
        .pp-tab{padding:9px 20px;font-size:13px;font-weight:600;border-radius:6px;cursor:pointer;color:var(--text-secondary);display:flex;align-items:center;gap:8px;transition:all .15s;border:none;background:none}
        .pp-tab.on{background:var(--accent-gold);color:#fff}
        .pp-toggle{display:flex;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:8px;padding:3px;gap:2px}
        .pp-tbtn{padding:7px 12px;font-size:12px;font-weight:600;border-radius:5px;cursor:pointer;color:var(--text-secondary);border:none;background:none;transition:all .15s}
        .pp-tbtn.on{background:var(--accent-gold);color:#fff}
        .fx-bdg{display:flex;align-items:center;gap:8px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:8px;padding:8px 12px;font-size:12px}
        .fx-dot{width:6px;height:6px;border-radius:50%;background:var(--accent-aqua);animation:ppulse 2s infinite}
        @keyframes ppulse{0%,100%{opacity:1}50%{opacity:.4}}
        .pp-kanban{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}
        .pp-col{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:10px;padding:12px 10px;min-height:380px;transition:background .15s}
        .pp-col.over{background:var(--bg-hover);border-color:var(--accent-gold);border-style:dashed}
        .pp-chead{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
        .pp-cname{font-size:11.5px;font-weight:700;display:flex;align-items:center;gap:6px}
        .pp-cname::before{content:'';width:8px;height:8px;border-radius:50%}
        .col-prospecto .pp-cname::before{background:var(--st-prospecto)}
        .col-lead .pp-cname::before{background:var(--st-lead)}
        .col-negociacion .pp-cname::before{background:var(--st-negociacion)}
        .col-reserva .pp-cname::before{background:var(--st-reserva)}
        .col-cierre .pp-cname::before{background:var(--st-cierre)}
        .col-perdida .pp-cname::before{background:var(--st-perdida)}
        .pp-ccnt{font-family:monospace;font-size:11px;color:var(--text-tertiary);background:var(--bg-elevated);padding:1px 6px;border-radius:4px}
        .pp-csum{font-family:monospace;font-size:11px;color:var(--text-secondary);padding:0 2px 10px;border-bottom:1px dashed var(--border-subtle);margin-bottom:10px}
        .pp-deal{background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:8px;padding:11px;margin-bottom:8px;cursor:grab;transition:transform .12s,border-color .12s,box-shadow .12s}
        .pp-deal:hover{border-color:var(--border-strong);box-shadow:0 4px 12px var(--shadow)}
        .pp-dtop{display:flex;align-items:flex-start;gap:6px;margin-bottom:6px}
        .pp-dname{font-size:12.5px;font-weight:600;line-height:1.3;flex:1}
        .sc-high{color:var(--accent-aqua);background:rgba(111,184,168,.14);font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;font-family:monospace;flex-shrink:0}
        .sc-mid{color:var(--accent-gold);background:rgba(212,165,116,.14);font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;font-family:monospace;flex-shrink:0}
        .sc-low{color:var(--text-tertiary);background:var(--bg-hover);font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;font-family:monospace;flex-shrink:0}
        .pp-dproj{font-size:11px;color:var(--text-secondary);margin-bottom:7px}
        .pp-damt{font-family:monospace;font-size:13.5px;font-weight:600;margin-bottom:7px}
        .pp-dfoot{display:flex;align-items:center;justify-content:space-between;font-size:10.5px;color:var(--text-tertiary);padding-top:7px;border-top:1px solid var(--border-subtle)}
        .pp-av{width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,var(--accent-aqua),var(--accent-blue));display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#fff;flex-shrink:0}
        .d-warn{color:var(--accent-terracotta);font-weight:600}
        .fc-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
        .fc-card{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:10px;padding:18px 20px}
        .fc-card.acc{border-left:2px solid var(--accent-gold)}
        .fc-lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-tertiary);font-weight:600;margin-bottom:10px}
        .fc-val{font-family:monospace;font-size:26px;font-weight:500;letter-spacing:-.5px}
        .fc-sub{font-size:11.5px;color:var(--text-tertiary);margin-top:6px}
        .fc-bar{height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden;margin-top:12px}
        .fc-barf{height:100%;border-radius:3px;background:var(--accent-gold)}
        .fc-sec{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:22px;margin-bottom:20px}
        .fc-st{font-size:15px;font-weight:600;margin-bottom:4px}
        .fc-ss{font-size:12.5px;color:var(--text-tertiary);margin-bottom:18px}
        .prob-row{display:grid;grid-template-columns:130px 1fr 120px;gap:14px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-subtle)}
        .prob-row:last-child{border-bottom:none}
        .prob-stage{font-size:12.5px;font-weight:600;display:flex;align-items:center;gap:8px}
        .prob-stage::before{content:'';width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .ps-prospecto::before{background:var(--st-prospecto)}.ps-lead::before{background:var(--st-lead)}
        .ps-negociacion::before{background:var(--st-negociacion)}.ps-reserva::before{background:var(--st-reserva)}.ps-cierre::before{background:var(--st-cierre)}
        .prob-track{height:24px;background:var(--bg-elevated);border-radius:5px;overflow:hidden}
        .prob-fill{height:100%;border-radius:5px;display:flex;align-items:center;padding-left:10px;font-size:11px;font-weight:600;color:#fff}
        .prob-amt{text-align:right;font-family:monospace;font-size:13px;font-weight:600}
        .at{width:100%;border-collapse:collapse}
        .at th{text-align:left;padding:10px 12px;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-tertiary);font-weight:600;border-bottom:1px solid var(--border-subtle)}
        .at th:not(:first-child){text-align:right}
        .at td{padding:11px 12px;font-size:13px;border-bottom:1px solid var(--border-subtle)}
        .at td:not(:first-child){text-align:right;font-family:monospace}
        .at-nm{display:flex;align-items:center;gap:8px;font-weight:600}
        .at-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--accent-aqua),var(--accent-blue));display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff}
        .mb{display:inline-block;width:60px;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden;vertical-align:middle;margin-left:8px}
        .mbf{height:100%;background:var(--accent-gold)}
        .cm-banner{background:linear-gradient(135deg,var(--bg-surface),var(--bg-elevated));border:1px solid var(--border-subtle);border-left:2px solid var(--accent-gold);border-radius:12px;padding:24px 28px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .rd{display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-elevated);border-radius:8px;margin-bottom:8px;border-left:2px solid var(--accent-terracotta)}
        .rd.hot{border-left-color:var(--accent-aqua)}
        .rd-info{flex:1}.rd-name{font-size:13px;font-weight:600}.rd-meta{font-size:11.5px;color:var(--text-tertiary)}
        .rd-amt{font-family:monospace;font-weight:600;font-size:13px}
        .pp-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--accent-aqua);color:#fff;padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 12px 32px var(--shadow);z-index:300;transition:transform .3s;pointer-events:none}
        .pp-toast.on{transform:translateX(-50%) translateY(0)}
        @media(max-width:1300px){.pp-kanban{grid-template-columns:repeat(3,1fr)}.fc-cards{grid-template-columns:repeat(2,1fr)}.g2{grid-template-columns:1fr}}
      `}</style>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
        <div>
          <h1 style={{fontSize:"20px",fontWeight:600,letterSpacing:"-.3px"}}>Pipeline &amp; Forecast</h1>
          <div style={{fontSize:"12.5px",color:"var(--text-tertiary)",marginTop:"2px"}}>Gestión comercial · Inversiones GP7</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div className="fx-bdg">
            <span className="fx-dot"/><span style={{color:"var(--text-tertiary)",fontSize:"11px"}}>USD/PEN</span>
            <span style={{fontFamily:"monospace",fontWeight:600}}>{FX.toFixed(3)}</span>
          </div>
          <div className="pp-toggle">
            <button className={`pp-tbtn${currency==="PEN"?" on":""}`} onClick={()=>setCurrency("PEN")}>S/ Soles</button>
            <button className={`pp-tbtn${currency==="USD"?" on":""}`} onClick={()=>setCurrency("USD")}>$ Dólares</button>
          </div>
        </div>
      </div>

      <div className="pp-tab-bar">
        {(["kanban","forecast","comite"] as const).map((id,i)=>(
          <button key={id} className={`pp-tab${tab===id?" on":""}`} onClick={()=>setTab(id)}>
            {["Pipeline Kanban","Forecast","Vista Comité"][i]}
          </button>
        ))}
      </div>

      {/* KANBAN */}
      {tab==="kanban" && (
        <>
          <div style={{fontSize:"12.5px",color:"var(--text-tertiary)",marginBottom:"14px"}}>
            Arrastra los deals entre columnas para cambiar su etapa.
          </div>
          <div className="pp-kanban">
            {STAGES.map(st=>{
              const ds = deals.filter(d=>d.estado===st.id);
              const sum = ds.reduce((a,d)=>a+d.monto_pen,0);
              return (
                <div key={st.id} className={`pp-col col-${st.id}`}
                  onDragOver={e=>{e.preventDefault();(e.currentTarget as HTMLElement).classList.add("over")}}
                  onDragLeave={e=>(e.currentTarget as HTMLElement).classList.remove("over")}
                  onDrop={e=>{(e.currentTarget as HTMLElement).classList.remove("over");handleDrop(st.id)}}>
                  <div className="pp-chead">
                    <div className="pp-cname">{st.name}</div>
                    <span className="pp-ccnt">{ds.length}</span>
                  </div>
                  <div className="pp-csum"><b>{fmtK(sum,currency)}</b> total</div>
                  {ds.map(d=>{
                    const warn = d.dias_etapa>=14 && !["cierre","perdida"].includes(st.id);
                    return (
                      <div key={d.id} className="pp-deal" draggable
                        onDragStart={()=>setDragId(d.id)}
                        onDragEnd={()=>setDragId(null)}>
                        <div className="pp-dtop">
                          <span className="pp-dname">{d.cliente}</span>
                          <span className={scoreClass(d.score)}>{d.score}</span>
                        </div>
                        <div className="pp-dproj">{d.proyecto}{d.unidad?` · ${d.unidad}`:""}</div>
                        <div className="pp-damt">{fmt(d.monto_pen,currency)}</div>
                        <div className="pp-dfoot">
                          <span style={{display:"flex",alignItems:"center",gap:"5px"}}>
                            <span className="pp-av">{initials(d.asesor)}</span>{d.asesor}
                          </span>
                          <span className={warn?"d-warn":""}>{warn?"⚠ ":""}{d.dias_etapa}d</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* FORECAST */}
      {tab==="forecast" && (()=>{
        const activos = deals.filter(d=>!["cierre","perdida"].includes(d.estado));
        const bruto = activos.reduce((a,d)=>a+d.monto_pen,0);
        const ponderado = activos.reduce((a,d)=>a+d.monto_pen*STAGE_PROB[d.estado],0);
        const cerrado = deals.filter(d=>d.estado==="cierre").reduce((a,d)=>a+d.monto_pen,0);
        const sActivos = STAGES.filter(s=>s.id!=="perdida");
        const maxAmt = Math.max(...sActivos.map(s=>deals.filter(d=>d.estado===s.id).reduce((a,d)=>a+d.monto_pen*STAGE_PROB[s.id],0)));
        const asesores: Record<string,{bruto:number;pond:number;count:number;cerrado:number}> = {};
        deals.filter(d=>d.estado!=="perdida").forEach(d=>{
          if(!asesores[d.asesor]) asesores[d.asesor]={bruto:0,pond:0,count:0,cerrado:0};
          if(d.estado==="cierre") asesores[d.asesor].cerrado+=d.monto_pen;
          else { asesores[d.asesor].bruto+=d.monto_pen; asesores[d.asesor].pond+=d.monto_pen*STAGE_PROB[d.estado]; }
          asesores[d.asesor].count++;
        });
        const maxPond = Math.max(...Object.values(asesores).map(a=>a.pond));
        const sorted = Object.entries(asesores).sort((a,b)=>b[1].pond-a[1].pond);
        const stColors: Record<string,string> = {prospecto:"var(--st-prospecto)",lead:"var(--st-lead)",negociacion:"var(--st-negociacion)",reserva:"var(--st-reserva)",cierre:"var(--st-cierre)"};
        return (<>
          <div className="fc-cards">
            <div className="fc-card acc"><div className="fc-lbl">Pipeline bruto</div><div className="fc-val">{fmtK(bruto,currency)}</div><div className="fc-sub">{activos.length} deals activos</div></div>
            <div className="fc-card acc"><div className="fc-lbl">Forecast ponderado</div><div className="fc-val">{fmtK(ponderado,currency)}</div><div className="fc-sub">Valor esperado real</div></div>
            <div className="fc-card"><div className="fc-lbl">Cerrado este mes</div><div className="fc-val" style={{color:"var(--accent-aqua)"}}>{fmtK(cerrado,currency)}</div><div className="fc-sub">{deals.filter(d=>d.estado==="cierre").length} ventas</div></div>
            <div className="fc-card"><div className="fc-lbl">Avance vs. meta</div><div className="fc-val">{Math.round((cerrado/META)*100)}%</div><div className="fc-sub">Meta: {fmtK(META,currency)}</div><div className="fc-bar"><div className="fc-barf" style={{width:`${Math.min(100,(cerrado/META)*100)}%`}}/></div></div>
          </div>
          <div className="fc-sec">
            <div className="fc-st">Forecast ponderado por etapa</div>
            <div className="fc-ss">Monto bruto × probabilidad de cierre.</div>
            {sActivos.map(s=>{
              const ds=deals.filter(d=>d.estado===s.id);
              const pond=ds.reduce((a,d)=>a+d.monto_pen*STAGE_PROB[s.id],0);
              const w=maxAmt>0?(pond/maxAmt)*100:0;
              return (<div key={s.id} className="prob-row">
                <div className={`prob-stage ps-${s.id}`}>{s.name} <span style={{fontSize:"11px",color:"var(--text-tertiary)"}}>{Math.round(STAGE_PROB[s.id]*100)}%</span></div>
                <div className="prob-track"><div className="prob-fill" style={{width:`${Math.max(w,3)}%`,background:stColors[s.id]}}>{ds.length} deals</div></div>
                <div className="prob-amt">{fmtK(pond,currency)}</div>
              </div>);
            })}
          </div>
          <div className="fc-sec">
            <div className="fc-st">Desempeño por asesor</div>
            <div className="fc-ss">Pipeline activo y forecast ponderado por cada vendedor.</div>
            <table className="at">
              <thead><tr><th>Asesor</th><th>Deals</th><th>Pipeline bruto</th><th>Forecast pond.</th><th>Cerrado</th></tr></thead>
              <tbody>{sorted.map(([name,a])=>(
                <tr key={name}>
                  <td><div className="at-nm"><span className="at-av">{initials(name)}</span>{name}</div></td>
                  <td>{a.count}</td><td>{fmtK(a.bruto,currency)}</td>
                  <td>{fmtK(a.pond,currency)}<span className="mb"><span className="mbf" style={{width:`${maxPond>0?(a.pond/maxPond)*100:0}%`}}/></span></td>
                  <td style={{color:"var(--accent-aqua)"}}>{a.cerrado>0?fmtK(a.cerrado,currency):"—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>);
      })()}

      {/* COMITÉ */}
      {tab==="comite" && (()=>{
        const activos=deals.filter(d=>!["cierre","perdida"].includes(d.estado));
        const ponderado=activos.reduce((a,d)=>a+d.monto_pen*STAGE_PROB[d.estado],0);
        const cerrado=deals.filter(d=>d.estado==="cierre").reduce((a,d)=>a+d.monto_pen,0);
        const enRiesgo=deals.filter(d=>d.dias_etapa>=14&&!["cierre","perdida"].includes(d.estado));
        const hot=deals.filter(d=>["negociacion","reserva"].includes(d.estado)).sort((a,b)=>(b.monto_pen*STAGE_PROB[b.estado])-(a.monto_pen*STAGE_PROB[a.estado])).slice(0,5);
        const risk=enRiesgo.sort((a,b)=>b.dias_etapa-a.dias_etapa);
        const projects: Record<string,{count:number;pond:number}>={};
        deals.filter(d=>d.estado!=="perdida").forEach(d=>{
          if(!projects[d.proyecto]) projects[d.proyecto]={count:0,pond:0};
          projects[d.proyecto].count++;
          projects[d.proyecto].pond+=d.monto_pen*STAGE_PROB[d.estado];
        });
        const maxP=Math.max(...Object.values(projects).map(p=>p.pond));
        const sortedP=Object.entries(projects).sort((a,b)=>b[1].pond-a[1].pond);
        return (<>
          <div className="cm-banner">
            <div>
              <div style={{fontSize:"18px",fontWeight:600}}>Comité Comercial Semanal</div>
              <div style={{fontSize:"12.5px",color:"var(--text-tertiary)",marginTop:"4px"}}>Generado automáticamente · Inversiones GP7</div>
            </div>
          </div>
          <div className="fc-cards">
            <div className="fc-card acc"><div className="fc-lbl">Forecast del mes</div><div className="fc-val">{fmtK(ponderado,currency)}</div><div className="fc-sub">{activos.length} negociaciones vivas</div></div>
            <div className="fc-card"><div className="fc-lbl">Ventas cerradas</div><div className="fc-val" style={{color:"var(--accent-aqua)"}}>{fmtK(cerrado,currency)}</div><div className="fc-sub">{deals.filter(d=>d.estado==="cierre").length} unidades</div></div>
            <div className="fc-card"><div className="fc-lbl">En riesgo</div><div className="fc-val" style={{color:"var(--accent-terracotta)"}}>{fmtK(enRiesgo.reduce((a,d)=>a+d.monto_pen,0),currency)}</div><div className="fc-sub">{enRiesgo.length} deals estancados</div></div>
            <div className="fc-card"><div className="fc-lbl">Reservas activas</div><div className="fc-val">{deals.filter(d=>d.estado==="reserva").length}</div><div className="fc-sub">Por cerrar próx. días</div></div>
          </div>
          <div className="g2">
            <div className="fc-sec">
              <div className="fc-st">🔥 Negociaciones vivas de alto valor</div>
              <div className="fc-ss">Deals en negociación/reserva con mayor monto ponderado</div>
              {hot.length===0?<div style={{color:"var(--text-tertiary)",fontSize:"13px"}}>Sin negociaciones activas</div>:
                hot.map(d=><div key={d.id} className="rd hot">
                  <div className="rd-info"><div className="rd-name">{d.cliente}</div><div className="rd-meta">{d.proyecto} · {d.asesor} · {Math.round(STAGE_PROB[d.estado]*100)}% prob</div></div>
                  <div className="rd-amt">{fmtK(d.monto_pen,currency)}</div>
                </div>)}
            </div>
            <div className="fc-sec">
              <div className="fc-st">⚠ Negociaciones en riesgo</div>
              <div className="fc-ss">Deals estancados o con caída de probabilidad</div>
              {risk.length===0?<div style={{color:"var(--text-tertiary)",fontSize:"13px"}}>Sin deals en riesgo 🎉</div>:
                risk.map(d=><div key={d.id} className="rd">
                  <div className="rd-info"><div className="rd-name">{d.cliente}</div><div className="rd-meta">{d.proyecto} · {d.dias_etapa}d sin avanzar</div></div>
                  <div className="rd-amt">{fmtK(d.monto_pen,currency)}</div>
                </div>)}
            </div>
          </div>
          <div className="fc-sec">
            <div className="fc-st">Avance de venta por proyecto</div>
            <div className="fc-ss">Unidades en pipeline y monto ponderado</div>
            {sortedP.map(([name,p])=>(
              <div key={name} className="prob-row">
                <div className="prob-stage" style={{fontSize:"12.5px"}}>{name}</div>
                <div className="prob-track"><div className="prob-fill" style={{width:`${maxP>0?Math.max((p.pond/maxP)*100,3):3}%`,background:"var(--accent-gold)"}}>{p.count} und</div></div>
                <div className="prob-amt">{fmtK(p.pond,currency)}</div>
              </div>
            ))}
          </div>
        </>);
      })()}

      <div className={`pp-toast${toastOn?" on":""}`}>{toast}</div>
    </div>
  );
}
