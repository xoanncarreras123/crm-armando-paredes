"use client";
import { useState } from "react";
import { usePrefs } from "@/presentation/providers/PrefsProvider";

const PRICING = {"torre":"TB1","tipologias":[{"id":"6","nombre":"Dúplex","precio_base_m2":2250.0,"precio_prom_m2":2331.43,"precios_por_hito":[2092,2250,2362,2475,2588]},{"id":"5","nombre":"TP Interior 60-70","precio_base_m2":2050.0,"precio_prom_m2":2084.8,"precios_por_hito":[1906,2050,2152,2255,2358]},{"id":"4","nombre":"EJ Exterior 60-70","precio_base_m2":2250.0,"precio_prom_m2":2298.9,"precios_por_hito":[2092,2250,2362,2475,2588]},{"id":"3","nombre":"TP Exterior 70","precio_base_m2":2325.0,"precio_prom_m2":2357.76,"precios_por_hito":[2162,2325,2441,2558,2674]},{"id":"2","nombre":"TP Exterior + Terraza","precio_base_m2":2325.0,"precio_prom_m2":2367.07,"precios_por_hito":[2162,2325,2441,2558,2674]},{"id":"1","nombre":"TP Interior + Terraza","precio_base_m2":2050.0,"precio_prom_m2":2060.4,"precios_por_hito":[1906,2050,2152,2255,2358]}],"hitos":["F&F","Preventa","Cota Cero","Casco Terminado","Entrega"],"distribucion":[{"tipologia":"6","cantidad":6,"por_hito":[1,1,2,1,1]},{"tipologia":"5","cantidad":17,"por_hito":[4,3,3,3,4]},{"tipologia":"4","cantidad":28,"por_hito":[5,6,6,6,5]},{"tipologia":"3","cantidad":32,"por_hito":[7,6,6,6,7]},{"tipologia":"2","cantidad":12,"por_hito":[2,2,3,3,2]},{"tipologia":"1","cantidad":4,"por_hito":[1,0,2,0,1]}],"historial":[{"fecha":"2023-04-01","tipologia":"Dúplex","precio_anterior":2100,"precio_nuevo":2150,"motivo":"Lanzamiento preventa","autor":"Gerencia Comercial"},{"fecha":"2023-07-15","tipologia":"TP Exterior 70","precio_anterior":2250,"precio_nuevo":2325,"motivo":"Hito Cota Cero alcanzado","autor":"Gerencia Comercial"},{"fecha":"2023-09-01","tipologia":"Dúplex","precio_anterior":2150,"precio_nuevo":2250,"motivo":"Ajuste por demanda alta","autor":"Sandra M."},{"fecha":"2024-01-10","tipologia":"TP Interior 60-70","precio_anterior":2000,"precio_nuevo":2050,"motivo":"Inflación + avance obra","autor":"Gerencia Comercial"},{"fecha":"2024-08-23","tipologia":"TP Exterior + Terraza","precio_anterior":2280,"precio_nuevo":2325,"motivo":"Casco terminado","autor":"Gonzalo R."}]};

export default function PricingPage() {
  const { role } = usePrefs();
  const [tab, setTab] = useState<"estrategia"|"hitos"|"simulador"|"historial">("estrategia");
  const [precios, setPrecios] = useState(PRICING.tipologias.map(t=>({...t,precio_base_m2:t.precio_base_m2})));
  const [simPct, setSimPct] = useState(0);
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

  const TABS = [["estrategia","Estrategia"],["hitos","Hitos"],["simulador","Simulador"],["historial","Historial"]] as const;
  const maxPrecio = Math.max(...precios.map(t=>t.precio_base_m2));
  const minPrecio = Math.min(...precios.map(t=>t.precio_base_m2));

  return (
    <div style={{padding:"20px 28px 40px"}}>
      <style>{`
        .px-tab-bar{display:flex;gap:4px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:9px;padding:3px;margin-bottom:24px;width:fit-content}
        .px-tab{padding:9px 20px;font-size:13px;font-weight:600;border-radius:6px;cursor:pointer;color:var(--text-secondary);transition:all .15s;border:none;background:none}
        .px-tab.on{background:var(--accent-gold);color:#fff}
        .px-sec{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:22px;margin-bottom:20px}
        .px-sec-title{font-size:16px;font-weight:600;margin-bottom:4px}
        .px-sec-sub{font-size:12.5px;color:var(--text-tertiary);margin-bottom:20px}
        .px-table{width:100%;border-collapse:collapse}
        .px-table th{text-align:left;padding:10px 14px;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-tertiary);font-weight:600;border-bottom:1px solid var(--border-subtle)}
        .px-table th:not(:first-child){text-align:right}
        .px-table td{padding:12px 14px;font-size:13px;border-bottom:1px solid var(--border-subtle)}
        .px-table td:not(:first-child){text-align:right;font-family:monospace}
        .px-inp{background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:6px;padding:6px 10px;font-size:13px;font-family:monospace;color:var(--text-primary);text-align:right;width:100px}
        .px-inp:focus{outline:none;border-color:var(--accent-gold)}
        .px-hito-table{width:100%;border-collapse:collapse}
        .px-hito-table th{text-align:center;padding:10px 14px;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-tertiary);font-weight:600;border-bottom:1px solid var(--border-subtle)}
        .px-hito-table th:first-child{text-align:left}
        .px-hito-table td{padding:11px 14px;font-size:13px;border-bottom:1px solid var(--border-subtle);text-align:center;font-family:monospace}
        .px-hito-table td:first-child{text-align:left;font-weight:600}
        .px-hito-diff{font-size:11px;padding:1px 6px;border-radius:4px;margin-left:4px}
        .sim-wrap{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        .sim-ctrl{background:var(--bg-elevated);border-radius:10px;padding:20px}
        .sim-ctrl-title{font-size:14px;font-weight:600;margin-bottom:16px}
        .sim-slider{width:100%;accent-color:var(--accent-gold);margin:16px 0}
        .sim-pct{font-family:monospace;font-size:28px;font-weight:600;color:var(--accent-gold)}
        .sim-result{background:var(--bg-elevated);border-radius:10px;padding:20px}
        .sim-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-subtle)}
        .sim-row:last-child{border-bottom:none}
        .sim-rname{font-size:13px;font-weight:600}
        .sim-rval{font-family:monospace;font-size:13px}
        .sim-rdiff{font-size:11px;font-weight:600;padding:2px 7px;border-radius:4px}
        .hist-table{width:100%;border-collapse:collapse}
        .hist-table th{text-align:left;padding:10px 14px;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-tertiary);font-weight:600;border-bottom:1px solid var(--border-subtle)}
        .hist-table td{padding:12px 14px;font-size:13px;border-bottom:1px solid var(--border-subtle)}
        .hist-autor{display:inline-flex;align-items:center;gap:6px}
        .hist-av{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--accent-aqua),var(--accent-blue));display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#fff}
        .btn-gold{padding:9px 16px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;border:none;background:var(--accent-gold);color:#fff;transition:filter .15s}
        .btn-gold:hover{filter:brightness(1.08)}
        .px-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--accent-aqua);color:#fff;padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 12px 32px var(--shadow);z-index:300;transition:transform .3s;pointer-events:none}
        .px-toast.on{transform:translateX(-50%) translateY(0)}
        @media(max-width:900px){.sim-wrap{grid-template-columns:1fr}}
      `}</style>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
        <div>
          <h1 style={{fontSize:"20px",fontWeight:600,letterSpacing:"-.3px"}}>Pricing Estratégico</h1>
          <div style={{fontSize:"12.5px",color:"var(--text-tertiary)",marginTop:"2px"}}>Torre {PRICING.torre} · Gestión de precios por tipología e hito</div>
        </div>
        <button className="btn-gold" onClick={()=>showToast("Cambios de precio guardados")}>Guardar cambios</button>
      </div>

      <div className="px-tab-bar">
        {TABS.map(([id,label])=>(
          <button key={id} className={`px-tab${tab===id?" on":""}`} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      {/* ESTRATEGIA */}
      {tab==="estrategia"&&(
        <div className="px-sec">
          <div className="px-sec-title">Precio base por tipología</div>
          <div className="px-sec-sub">Edita el precio base en S/m². Los cambios se propagan al simulador.</div>
          <table className="px-table">
            <thead><tr><th>Tipología</th><th>Precio base m²</th><th>Precio prom. m²</th><th>Diferencia</th><th>Posición</th></tr></thead>
            <tbody>
              {precios.map((t,i)=>{
                const diff = t.precio_prom_m2 - t.precio_base_m2;
                const pct = ((t.precio_base_m2-minPrecio)/(maxPrecio-minPrecio))*100;
                return (
                  <tr key={t.id}>
                    <td style={{fontWeight:600}}>{t.nombre}</td>
                    <td>
                      <input className="px-inp" type="number" value={t.precio_base_m2}
                        onChange={e=>{const v=Number(e.target.value);setPrecios(prev=>prev.map((p,j)=>j===i?{...p,precio_base_m2:v}:p));}}/>
                    </td>
                    <td>S/ {t.precio_prom_m2.toLocaleString()}</td>
                    <td style={{color:diff>0?"var(--accent-aqua)":"var(--accent-terracotta)"}}>{diff>0?"+":""}{Math.round(diff)}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        <div style={{width:"80px",height:"6px",background:"var(--bg-elevated)",borderRadius:"3px",overflow:"hidden"}}>
                          <div style={{height:"100%",background:"var(--accent-gold)",width:`${pct}%`}}/>
                        </div>
                        <span style={{fontSize:"11px",color:"var(--text-tertiary)"}}>{Math.round(pct)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* HITOS */}
      {tab==="hitos"&&(
        <div className="px-sec">
          <div className="px-sec-title">Precio por hito constructivo</div>
          <div className="px-sec-sub">Escalera de precios conforme avanza la obra. Verde = incremento vs. etapa anterior.</div>
          <table className="px-hito-table">
            <thead>
              <tr>
                <th>Tipología</th>
                {PRICING.hitos.map(h=><th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {PRICING.tipologias.map(t=>(
                <tr key={t.id}>
                  <td>{t.nombre}</td>
                  {t.precios_por_hito.map((p,i)=>{
                    const prev = i>0?t.precios_por_hito[i-1]:p;
                    const diff = p-prev;
                    return (
                      <td key={i}>
                        S/ {p.toLocaleString()}
                        {i>0&&<span className="px-hito-diff" style={{color:diff>0?"var(--accent-aqua)":"var(--text-tertiary)",background:diff>0?"rgba(111,184,168,.12)":"var(--bg-elevated)"}}>
                          {diff>0?"+":""}{diff}
                        </span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SIMULADOR */}
      {tab==="simulador"&&(
        <div className="px-sec">
          <div className="px-sec-title">Simulador de impacto de precios</div>
          <div className="px-sec-sub">Ajusta el porcentaje de variación y ve el impacto en ingresos proyectados.</div>
          <div className="sim-wrap">
            <div className="sim-ctrl">
              <div className="sim-ctrl-title">Variación de precio</div>
              <div className="sim-pct">{simPct>0?"+":""}{simPct}%</div>
              <div style={{fontSize:"12px",color:"var(--text-tertiary)",margin:"4px 0 8px"}}>sobre precio base actual</div>
              <input type="range" className="sim-slider" min={-15} max={20} step={0.5} value={simPct} onChange={e=>setSimPct(Number(e.target.value))}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",color:"var(--text-tertiary)"}}>
                <span>-15%</span><span>0%</span><span>+20%</span>
              </div>
            </div>
            <div className="sim-result">
              <div style={{fontSize:"14px",fontWeight:600,marginBottom:"16px"}}>Impacto por tipología</div>
              {precios.map(t=>{
                const nuevo = Math.round(t.precio_base_m2*(1+simPct/100));
                const dif = nuevo-t.precio_base_m2;
                return (
                  <div key={t.id} className="sim-row">
                    <div className="sim-rname">{t.nombre}</div>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <span className="sim-rval">S/ {nuevo.toLocaleString()}</span>
                      {simPct!==0&&<span className="sim-rdiff" style={{color:dif>0?"var(--accent-aqua)":"var(--accent-terracotta)",background:dif>0?"rgba(111,184,168,.12)":"rgba(224,120,86,.12)"}}>
                        {dif>0?"+":""}{dif}
                      </span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HISTORIAL */}
      {tab==="historial"&&(
        <div className="px-sec">
          <div className="px-sec-title">Historial de cambios de precio</div>
          <div className="px-sec-sub">Auditoría de todos los ajustes de precio realizados.</div>
          <table className="hist-table">
            <thead><tr><th>Fecha</th><th>Tipología</th><th>Precio anterior</th><th>Precio nuevo</th><th>Variación</th><th>Motivo</th><th>Autor</th></tr></thead>
            <tbody>
              {[...PRICING.historial].reverse().map((h,i)=>{
                const dif = h.precio_nuevo-h.precio_anterior;
                return (
                  <tr key={i}>
                    <td style={{fontFamily:"monospace",fontSize:"12px",color:"var(--text-secondary)"}}>{h.fecha}</td>
                    <td style={{fontWeight:600}}>{h.tipologia}</td>
                    <td style={{fontFamily:"monospace"}}>S/ {h.precio_anterior.toLocaleString()}</td>
                    <td style={{fontFamily:"monospace"}}>S/ {h.precio_nuevo.toLocaleString()}</td>
                    <td>
                      <span style={{fontFamily:"monospace",fontSize:"12px",fontWeight:600,color:dif>0?"var(--accent-aqua)":"var(--accent-terracotta)",background:dif>0?"rgba(111,184,168,.12)":"rgba(224,120,86,.12)",padding:"2px 8px",borderRadius:"4px"}}>
                        {dif>0?"+":""}{dif}
                      </span>
                    </td>
                    <td style={{fontSize:"12.5px",color:"var(--text-secondary)"}}>{h.motivo}</td>
                    <td>
                      <div className="hist-autor">
                        <span className="hist-av">{h.autor.split(" ").slice(0,2).map(w=>w[0]).join("")}</span>
                        <span style={{fontSize:"12.5px"}}>{h.autor}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className={`px-toast${toastOn?" on":""}`}>{toast}</div>
    </div>
  );
}
