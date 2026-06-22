"use client";
import { useState } from "react";
import { usePrefs } from "@/presentation/providers/PrefsProvider";

const PROYECTOS = [{"nombre":"Laureles","obj_u_trim":5,"real_u_trim":2,"obj_money_trim":1679960,"real_money_trim":752400,"obj_u_total":48,"real_u_total":24,"cumpl_u":50.0,"cumpl_money":47.8,"leads_semana":47,"citas_semana":14,"visitas_semana":12},{"nombre":"Dos de Mayo","obj_u_trim":2,"real_u_trim":1,"obj_money_trim":790980,"real_money_trim":277000,"obj_u_total":39,"real_u_total":7,"cumpl_u":17.9,"cumpl_money":17.2,"leads_semana":18,"citas_semana":17,"visitas_semana":5},{"nombre":"Machaypuito","obj_u_trim":4,"real_u_trim":0,"obj_money_trim":941671,"real_money_trim":0,"obj_u_total":21,"real_u_total":17,"cumpl_u":81.0,"cumpl_money":84.2,"leads_semana":21,"citas_semana":8,"visitas_semana":3},{"nombre":"Los Pinos","obj_u_trim":5,"real_u_trim":0,"obj_money_trim":1762500,"real_money_trim":0,"obj_u_total":75,"real_u_total":9,"cumpl_u":12.0,"cumpl_money":10.6,"leads_semana":75,"citas_semana":10,"visitas_semana":8},{"nombre":"Toribio Polo","obj_u_trim":12,"real_u_trim":5,"obj_money_trim":0,"real_money_trim":0,"obj_u_total":165,"real_u_total":69,"cumpl_u":41.8,"cumpl_money":41.8,"leads_semana":28,"citas_semana":10,"visitas_semana":2},{"nombre":"Ugarte & Moscoso","obj_u_trim":6,"real_u_trim":3,"obj_money_trim":0,"real_money_trim":0,"obj_u_total":42,"real_u_total":18,"cumpl_u":42.8,"cumpl_money":38.9,"leads_semana":67,"citas_semana":11,"visitas_semana":4},{"nombre":"Saenz Peña 2","obj_u_trim":4,"real_u_trim":3,"obj_money_trim":0,"real_money_trim":0,"obj_u_total":28,"real_u_total":14,"cumpl_u":50.0,"cumpl_money":52.0,"leads_semana":35,"citas_semana":5,"visitas_semana":4},{"nombre":"Libertad","obj_u_trim":5,"real_u_trim":4,"obj_money_trim":0,"real_money_trim":0,"obj_u_total":31,"real_u_total":16,"cumpl_u":51.6,"cumpl_money":56.2,"leads_semana":71,"citas_semana":7,"visitas_semana":4}];

const KPI_OPTIONS = [
  {id:"resumen",label:"Resumen ejecutivo"},
  {id:"avance",label:"Avance vs. meta"},
  {id:"forecast",label:"Forecast ponderado"},
  {id:"asesores",label:"Rendimiento asesores"},
  {id:"marketing",label:"Leads & marketing"},
  {id:"leads",label:"Embudo de leads"},
  {id:"riesgo",label:"Deals en riesgo"},
];

function fmtK(v: number) { if(v>=1e6) return "S/ "+(v/1e6).toFixed(2)+"M"; if(v>=1e3) return "S/ "+Math.round(v/1e3)+"K"; return "S/ "+Math.round(v); }

export default function ReporteriaPage() {
  const { role } = usePrefs();
  const [kpis, setKpis] = useState<string[]>(["resumen","avance","forecast"]);
  const [toast, setToast] = useState(""); const [toastOn, setToastOn] = useState(false);

  if (role !== "admin") {
    return (
      <div style={{padding:"20px 28px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
        <div style={{textAlign:"center",maxWidth:"400px"}}>
          <div style={{width:"64px",height:"64px",borderRadius:"50%",background:"rgba(224,120,86,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:"28px"}}>🔒</div>
          <div style={{fontSize:"18px",fontWeight:600,marginBottom:"8px"}}>Acceso restringido</div>
          <div style={{fontSize:"13px",color:"var(--text-tertiary)"}}>Esta sección es exclusiva para el rol Backoffice. Cambia el rol en el panel lateral para acceder.</div>
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => { setToast(msg); setToastOn(true); setTimeout(()=>setToastOn(false),2800); };
  const toggleKpi = (id: string) => setKpis(prev=>prev.includes(id)?prev.filter(k=>k!==id):[...prev,id]);

  const totalLead = PROYECTOS.reduce((a,p)=>a+p.leads_semana,0);
  const totalCitas = PROYECTOS.reduce((a,p)=>a+p.citas_semana,0);
  const totalVisitas = PROYECTOS.reduce((a,p)=>a+p.visitas_semana,0);
  const totalUnidades = PROYECTOS.reduce((a,p)=>a+p.real_u_total,0);
  const totalObj = PROYECTOS.reduce((a,p)=>a+p.obj_u_total,0);

  return (
    <div style={{padding:"20px 28px 40px"}}>
      <style>{`
        .rp-layout{display:grid;grid-template-columns:240px 1fr;gap:24px;align-items:start}
        .rp-panel{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:20px;position:sticky;top:20px}
        .rp-ptitle{font-size:14px;font-weight:600;margin-bottom:4px}
        .rp-pdesc{font-size:12.5px;color:var(--text-tertiary);margin-bottom:16px}
        .rp-kpi-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;margin-bottom:4px;transition:background .12s}
        .rp-kpi-item:hover{background:var(--bg-hover)}
        .rp-kpi-item label{font-size:13px;font-weight:500;cursor:pointer;flex:1}
        .rp-cb{width:16px;height:16px;border-radius:4px;border:1.5px solid var(--border-strong);background:var(--bg-base);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .12s}
        .rp-cb.on{background:var(--accent-gold);border-color:var(--accent-gold)}
        .rp-export-btns{margin-top:20px;display:flex;flex-direction:column;gap:8px}
        .rp-ebtn{padding:10px 14px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;border:none;background:var(--accent-gold);color:#fff;display:flex;align-items:center;justify-content:center;gap:6px;transition:filter .15s}
        .rp-ebtn:hover{filter:brightness(1.08)}
        .rp-ebtn.ghost{background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border-subtle)}
        .rp-ebtn.ghost:hover{background:var(--bg-hover);filter:none}
        .rp-canvas{display:flex;flex-direction:column;gap:20px}
        .rp-section{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:22px}
        .rp-sec-title{font-size:16px;font-weight:600;margin-bottom:4px}
        .rp-sec-sub{font-size:12.5px;color:var(--text-tertiary);margin-bottom:18px}
        .rp-kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .rp-kpi-card{background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;padding:16px}
        .rp-kpi-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-tertiary);font-weight:600;margin-bottom:8px}
        .rp-kpi-val{font-family:monospace;font-size:24px;font-weight:500}
        .rp-kpi-sub{font-size:11.5px;color:var(--text-tertiary);margin-top:4px}
        .rp-pt{width:100%;border-collapse:collapse}
        .rp-pt th{text-align:left;padding:10px 12px;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-tertiary);font-weight:600;border-bottom:1px solid var(--border-subtle)}
        .rp-pt td{padding:11px 12px;font-size:13px;border-bottom:1px solid var(--border-subtle)}
        .rp-pt td:not(:first-child){text-align:right;font-family:monospace}
        .rp-bar-row{display:grid;grid-template-columns:140px 1fr 60px;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-subtle)}
        .rp-bar-row:last-child{border-bottom:none}
        .rp-bar-label{font-size:12.5px;font-weight:600}
        .rp-bar-track{height:20px;background:var(--bg-elevated);border-radius:4px;overflow:hidden}
        .rp-bar-fill{height:100%;border-radius:4px;display:flex;align-items:center;padding-left:8px;font-size:11px;font-weight:600;color:#fff}
        .rp-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--accent-aqua);color:#fff;padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 12px 32px var(--shadow);z-index:300;transition:transform .3s;pointer-events:none}
        .rp-toast.on{transform:translateX(-50%) translateY(0)}
        @media(max-width:1000px){.rp-layout{grid-template-columns:1fr}.rp-kpi-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      <div style={{marginBottom:"24px"}}>
        <h1 style={{fontSize:"20px",fontWeight:600,letterSpacing:"-.3px"}}>Reportería &amp; Comité</h1>
        <div style={{fontSize:"12.5px",color:"var(--text-tertiary)",marginTop:"2px"}}>Construye el informe del comité seleccionando los KPIs a incluir</div>
      </div>

      <div className="rp-layout">
        {/* Panel de selección de KPIs */}
        <div className="rp-panel">
          <div className="rp-ptitle">KPIs del informe</div>
          <div className="rp-pdesc">Selecciona las secciones a incluir en el comité</div>
          {KPI_OPTIONS.map(k=>(
            <div key={k.id} className="rp-kpi-item" onClick={()=>toggleKpi(k.id)}>
              <div className={`rp-cb${kpis.includes(k.id)?" on":""}`}>
                {kpis.includes(k.id)&&<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2"><polyline points="1 6 5 10 11 2"/></svg>}
              </div>
              <label>{k.label}</label>
            </div>
          ))}
          <div className="rp-export-btns">
            <button className="rp-ebtn" onClick={()=>showToast("En producción: genera HTML del comité con los KPIs seleccionados")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar HTML
            </button>
            <button className="rp-ebtn ghost" onClick={()=>showToast("En producción: genera PDF del comité")}>Exportar PDF</button>
          </div>
        </div>

        {/* Canvas del informe */}
        <div className="rp-canvas">
          {kpis.length===0&&(
            <div style={{background:"var(--bg-surface)",border:"1px dashed var(--border-subtle)",borderRadius:"12px",padding:"60px 24px",textAlign:"center",color:"var(--text-tertiary)"}}>
              Selecciona al menos un KPI para ver el informe
            </div>
          )}

          {kpis.includes("resumen")&&(
            <div className="rp-section">
              <div className="rp-sec-title">Resumen Ejecutivo</div>
              <div className="rp-sec-sub">Indicadores clave del período · semana {new Date().toLocaleDateString("es-PE",{day:"numeric",month:"short"})}</div>
              <div className="rp-kpi-grid">
                <div className="rp-kpi-card"><div className="rp-kpi-lbl">Leads semana</div><div className="rp-kpi-val">{totalLead}</div><div className="rp-kpi-sub">+12% vs semana ant.</div></div>
                <div className="rp-kpi-card"><div className="rp-kpi-lbl">Citas agendadas</div><div className="rp-kpi-val">{totalCitas}</div><div className="rp-kpi-sub">Conv. {Math.round((totalCitas/totalLead)*100)}%</div></div>
                <div className="rp-kpi-card"><div className="rp-kpi-lbl">Visitas realizadas</div><div className="rp-kpi-val">{totalVisitas}</div><div className="rp-kpi-sub">Conv. {Math.round((totalVisitas/totalCitas)*100)}%</div></div>
                <div className="rp-kpi-card"><div className="rp-kpi-lbl">Unidades vendidas</div><div className="rp-kpi-val" style={{color:"var(--accent-aqua)"}}>{totalUnidades}</div><div className="rp-kpi-sub">de {totalObj} objetivo total</div></div>
              </div>
            </div>
          )}

          {kpis.includes("avance")&&(
            <div className="rp-section">
              <div className="rp-sec-title">Avance vs. Meta por Proyecto</div>
              <div className="rp-sec-sub">Unidades vendidas vs. objetivo total del proyecto</div>
              {PROYECTOS.map(p=>(
                <div key={p.nombre} className="rp-bar-row">
                  <div className="rp-bar-label">{p.nombre}</div>
                  <div className="rp-bar-track">
                    <div className="rp-bar-fill" style={{width:`${p.cumpl_u}%`,background:`hsl(${p.cumpl_u>60?150:p.cumpl_u>30?45:0},60%,50%)`}}>
                      {Math.round(p.cumpl_u)}%
                    </div>
                  </div>
                  <div style={{textAlign:"right",fontFamily:"monospace",fontSize:"12px",color:"var(--text-secondary)"}}>{p.real_u_total}/{p.obj_u_total}</div>
                </div>
              ))}
            </div>
          )}

          {kpis.includes("marketing")&&(
            <div className="rp-section">
              <div className="rp-sec-title">Leads &amp; Marketing por Proyecto</div>
              <div className="rp-sec-sub">Volumen de leads, citas y visitas esta semana</div>
              <table className="rp-pt">
                <thead><tr><th>Proyecto</th><th>Leads</th><th>Citas</th><th>Visitas</th><th>Conv. Leads→Citas</th></tr></thead>
                <tbody>{PROYECTOS.map(p=>(
                  <tr key={p.nombre}>
                    <td style={{fontWeight:600}}>{p.nombre}</td>
                    <td>{p.leads_semana}</td>
                    <td>{p.citas_semana}</td>
                    <td>{p.visitas_semana}</td>
                    <td style={{color:"var(--accent-aqua)"}}>{Math.round((p.citas_semana/Math.max(p.leads_semana,1))*100)}%</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          {kpis.includes("forecast")&&(
            <div className="rp-section">
              <div className="rp-sec-title">Forecast Ponderado</div>
              <div className="rp-sec-sub">Montos del trimestre por proyecto</div>
              <div className="rp-kpi-grid" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
                {PROYECTOS.filter(p=>p.obj_money_trim>0).map(p=>(
                  <div key={p.nombre} className="rp-kpi-card">
                    <div className="rp-kpi-lbl">{p.nombre}</div>
                    <div className="rp-kpi-val" style={{fontSize:"18px"}}>{fmtK(p.real_money_trim)}</div>
                    <div className="rp-kpi-sub">Meta: {fmtK(p.obj_money_trim)} · {Math.round(p.cumpl_money)}%</div>
                    <div style={{height:"4px",background:"var(--bg-elevated)",borderRadius:"2px",overflow:"hidden",marginTop:"10px"}}>
                      <div style={{height:"100%",background:p.cumpl_money>60?"var(--accent-aqua)":p.cumpl_money>30?"var(--accent-gold)":"var(--accent-terracotta)",width:`${Math.min(p.cumpl_money,100)}%`}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {kpis.includes("leads")&&(
            <div className="rp-section">
              <div className="rp-sec-title">Embudo de Leads</div>
              <div className="rp-sec-sub">Conversión acumulada semana actual</div>
              {[["Leads totales",totalLead,"var(--accent-blue)"],[`Citas (${Math.round((totalCitas/totalLead)*100)}%)`,totalCitas,"var(--accent-violet)"],[`Visitas (${Math.round((totalVisitas/totalCitas)*100)}%)`,totalVisitas,"var(--accent-gold)"]].map(([label,val,color])=>(
                <div key={String(label)} className="rp-bar-row">
                  <div className="rp-bar-label">{String(label)}</div>
                  <div className="rp-bar-track"><div className="rp-bar-fill" style={{width:`${(Number(val)/totalLead)*100}%`,background:String(color)}}>{String(val)}</div></div>
                  <div style={{textAlign:"right",fontFamily:"monospace",fontSize:"13px",fontWeight:600}}>{String(val)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`rp-toast${toastOn?" on":""}`}>{toast}</div>
    </div>
  );
}
