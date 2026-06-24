"use client";
import { useState } from "react";

const CLIENTES = [
  {id:"D007",nombre:"Janett Manchego",proyecto:"Saenz Peña 212",unidad:"101",asesor:"Arturo"},
  {id:"D009",nombre:"Juan Luis Herrera",proyecto:"Pasaje Laureles",unidad:"C202 | D402",asesor:"Carlos"},
  {id:"D013",nombre:"Fiorella Cerron y Luis Barrera",proyecto:"Ugarte y Moscoso 370",unidad:"B 1003",asesor:"Javier"},
  {id:"C001",nombre:"Carla Carty",proyecto:"Saenz Peña 212",unidad:"102 | 101",asesor:"Carlos"},
];
const UNIDADES: Record<string,{id:string;tipo:string;area:string;precio:string}[]> = {
  "Toribio Polo":[{id:"A101",tipo:"2 dorm",area:"68 m²",precio:"S/ 427,000"},{id:"B202",tipo:"3 dorm",area:"85 m²",precio:"S/ 545,670"},{id:"C301",tipo:"2 dorm",area:"70 m²",precio:"S/ 439,000"}],
  "Libertad":[{id:"601",tipo:"2 dorm",area:"72 m²",precio:"S/ 735,883"},{id:"703",tipo:"3 dorm",area:"88 m²",precio:"S/ 645,450"},{id:"1002",tipo:"2 dorm",area:"75 m²",precio:"S/ 771,158"}],
  "Ugarte y Moscoso 370":[{id:"A1103",tipo:"3 dorm+e",area:"120 m²",precio:"S/ 1,259,454"},{id:"B 1001",tipo:"2 dorm",area:"90 m²",precio:"S/ 1,492,140"},{id:"B 1003",tipo:"3 dorm+e",area:"125 m²",precio:"S/ 1,688,050"}],
};
const PLANTILLAS = [
  {id:"cv",nombre:"Contrato de Venta",desc:"Compraventa estándar con modalidad de pago y cronograma",clausulas:"22 cláusulas"},
  {id:"sep",nombre:"Contrato de Separación",desc:"Reserva de unidad con fecha de vencimiento y condiciones",clausulas:"12 cláusulas"},
  {id:"mc",nombre:"Minuta de Compraventa",desc:"Para trámite notarial · incluye datos registrales",clausulas:"18 cláusulas"},
];

function initials(name: string) { return name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

export default function ContratosPage() {
  const [step, setStep] = useState(1);
  const [clienteSel, setClienteSel] = useState<typeof CLIENTES[0]|null>(null);
  const [proyecto, setProyecto] = useState("Toribio Polo");
  const [unidadSel, setUnidadSel] = useState<string|null>(null);
  const [plantillaSel, setPlantillaSel] = useState<string|null>(null);
  const [titulares, setTitulares] = useState([{nombre:"",dni:"",civil:"",ocupacion:""}]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(""); const [toastOn, setToastOn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setToastOn(true); setTimeout(()=>setToastOn(false),2800); };

  const canNext = [clienteSel!==null, titulares.every(t=>t.nombre&&t.dni), unidadSel!==null, plantillaSel!==null, false][step-1] !== false || step===5;
  const canNextStep = step===1?clienteSel!==null:step===2?titulares.every(t=>t.nombre.length>0&&t.dni.length>0):step===3?unidadSel!==null:step===4?plantillaSel!==null:false;

  const filteredClientes = CLIENTES.filter(c=>c.nombre.toLowerCase().includes(search.toLowerCase())||c.proyecto.toLowerCase().includes(search.toLowerCase()));
  const unidades = UNIDADES[proyecto] ?? [];

  const STEPS = ["Cliente","Titulares","Unidades","Plantilla","Generar"];

  return (
    <div style={{padding:"20px 28px 40px"}}>
      <style>{`
        .ct-stepper{display:flex;align-items:center;margin:24px 0 28px;max-width:760px}
        .ct-step{display:flex;align-items:center;flex:1}
        .ct-step-dot{width:32px;height:32px;border-radius:50%;background:var(--bg-elevated);border:2px solid var(--border-strong);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--text-tertiary);flex-shrink:0;transition:all .2s}
        .ct-step.done .ct-step-dot,.ct-step.active .ct-step-dot{background:var(--accent-gold);border-color:var(--accent-gold);color:#fff}
        .ct-step.done .ct-step-dot{background:var(--accent-aqua);border-color:var(--accent-aqua)}
        .ct-step-label{font-size:12.5px;font-weight:600;margin-left:10px;color:var(--text-tertiary);white-space:nowrap}
        .ct-step.active .ct-step-label,.ct-step.done .ct-step-label{color:var(--text-primary)}
        .ct-step-line{flex:1;height:2px;background:var(--border-strong);margin:0 12px;border-radius:1px}
        .ct-step.done .ct-step-line{background:var(--accent-aqua)}
        .ct-layout{display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start}
        .ct-panel{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:24px}
        .ct-ptitle{font-size:16px;font-weight:600;margin-bottom:4px}
        .ct-pdesc{font-size:13px;color:var(--text-tertiary);margin-bottom:20px}
        .ct-search{display:flex;align-items:center;gap:10px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:9px;padding:12px 14px;margin-bottom:12px}
        .ct-search input{flex:1;background:none;border:none;color:var(--text-primary);font-size:14px;font-family:inherit;outline:none}
        .ct-client-card{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:9px;cursor:pointer;transition:all .12s;margin-bottom:6px}
        .ct-client-card:hover{border-color:var(--accent-gold);transform:translateX(2px)}
        .ct-client-card.sel{border-color:var(--accent-gold);box-shadow:inset 0 0 0 1px var(--accent-gold);background:rgba(212,165,116,.06)}
        .ct-cav{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--accent-aqua),var(--accent-blue));display:flex;align-items:center;justify-content:center;font-weight:600;color:#fff;font-size:13px;flex-shrink:0}
        .ct-cname{font-size:13.5px;font-weight:600}.ct-cmeta{font-size:11.5px;color:var(--text-tertiary)}
        .ct-tit-card{background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;padding:18px;margin-bottom:14px;position:relative}
        .ct-tit-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
        .ct-tit-num{font-size:12px;font-weight:700;color:var(--accent-gold);text-transform:uppercase;letter-spacing:.05em}
        .ct-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .ct-flbl{font-size:11px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.03em;display:block;margin-bottom:5px}
        .ct-finp,.ct-fsel{background:var(--bg-base);border:1px solid var(--border-strong);border-radius:7px;padding:9px 11px;font-size:13px;color:var(--text-primary);font-family:inherit;width:100%}
        .ct-finp:focus,.ct-fsel:focus{outline:none;border-color:var(--accent-gold)}
        .ct-add-tit{width:100%;padding:12px;border:1.5px dashed var(--accent-gold-dim);background:rgba(212,165,116,.04);color:var(--accent-gold);border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}
        .ct-add-tit:hover{background:rgba(212,165,116,.08)}
        .ct-unit-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;max-height:280px;overflow-y:auto;padding:2px}
        .ct-unit-opt{padding:12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:9px;cursor:pointer;transition:all .12s}
        .ct-unit-opt:hover{border-color:var(--accent-gold)}
        .ct-unit-opt.sel{border-color:var(--accent-gold);box-shadow:inset 0 0 0 1px var(--accent-gold);background:rgba(212,165,116,.06)}
        .ct-uid{font-family:monospace;font-size:15px;font-weight:600}
        .ct-umeta{font-size:11px;color:var(--text-tertiary);margin:3px 0 6px}
        .ct-uprice{font-family:monospace;font-size:13px;font-weight:600;color:var(--accent-gold)}
        .ct-tmpl-card{display:flex;align-items:center;gap:14px;padding:16px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;transition:all .12s;margin-bottom:10px}
        .ct-tmpl-card:hover{border-color:var(--accent-gold)}
        .ct-tmpl-card.sel{border-color:var(--accent-gold);box-shadow:inset 0 0 0 1px var(--accent-gold);background:rgba(212,165,116,.06)}
        .ct-tmpl-icon{width:42px;height:42px;border-radius:8px;background:var(--bg-base);display:flex;align-items:center;justify-content:center;color:var(--accent-gold);flex-shrink:0}
        .ct-tmpl-name{font-size:13.5px;font-weight:600}.ct-tmpl-desc{font-size:11.5px;color:var(--text-tertiary)}
        .ct-tmpl-badge{margin-left:auto;font-size:10px;font-family:monospace;color:var(--text-tertiary);background:var(--bg-base);padding:2px 7px;border-radius:4px;flex-shrink:0}
        .ct-actions{display:flex;gap:10px;margin-top:24px;justify-content:space-between}
        .btn-gold{padding:11px 22px;border-radius:8px;font-size:13.5px;font-weight:600;cursor:pointer;border:none;background:var(--accent-gold);color:#fff;display:flex;align-items:center;gap:8px;transition:filter .15s}
        .btn-gold:hover:not(:disabled){filter:brightness(1.08)}
        .btn-gold:disabled{opacity:.4;cursor:not-allowed}
        .btn-ghost{padding:11px 22px;border-radius:8px;font-size:13.5px;font-weight:600;cursor:pointer;border:1px solid var(--border-subtle);background:var(--bg-elevated);color:var(--text-primary);display:flex;align-items:center;gap:8px}
        .btn-ghost:hover{background:var(--bg-hover)}
        .ct-preview{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:20px;position:sticky;top:20px}
        .ct-prev-lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--accent-gold);font-weight:700;margin-bottom:14px}
        .pv-sec{padding:10px 0;border-bottom:1px solid var(--border-subtle)}
        .pv-sec:last-child{border-bottom:none}
        .pv-sec-title{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-tertiary);font-weight:600;margin-bottom:6px}
        .pv-item{font-size:12.5px;margin-bottom:3px;display:flex;justify-content:space-between;gap:8px}
        .pv-k{color:var(--text-tertiary)}.pv-v{font-weight:600;text-align:right}
        .pv-empty{text-align:center;padding:40px 16px;color:var(--text-tertiary);font-size:13px}
        .ct-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--accent-aqua);color:#fff;padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 12px 32px var(--shadow);z-index:300;transition:transform .3s;pointer-events:none}
        .ct-toast.on{transform:translateX(-50%) translateY(0)}
        @media(max-width:1100px){.ct-layout{grid-template-columns:1fr}}
      `}</style>

      <div style={{marginBottom:"0"}}>
        <h1 style={{fontSize:"20px",fontWeight:600,letterSpacing:"-.3px"}}>Fichas de datos &amp; Contratos</h1>
        <div style={{fontSize:"12.5px",color:"var(--text-tertiary)",marginTop:"2px"}}>Completa la ficha una vez · el contrato se genera solo</div>
      </div>

      {/* Stepper */}
      <div className="ct-stepper">
        {STEPS.map((label,i)=>{
          const n=i+1;
          const isDone=step>n; const isActive=step===n;
          return (
            <div key={n} className={`ct-step${isActive?" active":""}${isDone?" done":""}`}>
              <div className="ct-step-dot">{isDone?"✓":n}</div>
              <div className="ct-step-label">{label}</div>
              {n<STEPS.length&&<div className="ct-step-line"/>}
            </div>
          );
        })}
      </div>

      <div className="ct-layout">
        <div>
          {/* Step 1: Cliente */}
          {step===1&&<div className="ct-panel">
            <div className="ct-ptitle">Selecciona el cliente</div>
            <div className="ct-pdesc">Trae los datos base del prospecto. Luego completarás los titulares legales.</div>
            <div className="ct-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:"var(--text-tertiary)",flexShrink:0}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Buscar cliente…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            {filteredClientes.map(c=>(
              <div key={c.id} className={`ct-client-card${clienteSel?.id===c.id?" sel":""}`} onClick={()=>setClienteSel(c)}>
                <div className="ct-cav">{initials(c.nombre)}</div>
                <div><div className="ct-cname">{c.nombre}</div><div className="ct-cmeta">{c.proyecto} · {c.unidad}</div></div>
              </div>
            ))}
          </div>}

          {/* Step 2: Titulares */}
          {step===2&&<div className="ct-panel">
            <div className="ct-ptitle">Datos de los titulares</div>
            <div className="ct-pdesc">Agrega todos los compradores. Soporta sociedad conyugal, copropiedad y separación de bienes.</div>
            {titulares.map((t,i)=>(
              <div key={i} className="ct-tit-card">
                <div className="ct-tit-head">
                  <span className="ct-tit-num">Titular {i+1}</span>
                  {i>0&&<button style={{background:"none",border:"none",color:"var(--text-tertiary)",cursor:"pointer",fontSize:"13px",padding:"4px 8px",borderRadius:"5px"}} onClick={()=>setTitulares(prev=>prev.filter((_,j)=>j!==i))}>Eliminar</button>}
                </div>
                <div className="ct-form-grid">
                  <div><label className="ct-flbl">Nombre completo</label><input className="ct-finp" value={t.nombre} onChange={e=>{const a=[...titulares];a[i]={...a[i],nombre:e.target.value};setTitulares(a)}} placeholder="Nombres y apellidos"/></div>
                  <div><label className="ct-flbl">DNI / CE</label><input className="ct-finp" value={t.dni} onChange={e=>{const a=[...titulares];a[i]={...a[i],dni:e.target.value};setTitulares(a)}} placeholder="00000000"/></div>
                  <div><label className="ct-flbl">Estado civil</label>
                    <select className="ct-fsel" value={t.civil} onChange={e=>{const a=[...titulares];a[i]={...a[i],civil:e.target.value};setTitulares(a)}}>
                      <option value="">Seleccionar…</option>
                      <option>Soltero/a</option><option>Casado/a</option><option>Divorciado/a</option><option>Viudo/a</option>
                    </select>
                  </div>
                  <div><label className="ct-flbl">Ocupación</label><input className="ct-finp" value={t.ocupacion} onChange={e=>{const a=[...titulares];a[i]={...a[i],ocupacion:e.target.value};setTitulares(a)}} placeholder="Profesión u oficio"/></div>
                </div>
              </div>
            ))}
            <button className="ct-add-tit" onClick={()=>setTitulares(prev=>[...prev,{nombre:"",dni:"",civil:"",ocupacion:""}])}>＋ Agregar otro titular</button>
          </div>}

          {/* Step 3: Unidades */}
          {step===3&&<div className="ct-panel">
            <div className="ct-ptitle">Unidades a transferir</div>
            <div className="ct-pdesc">Selecciona el departamento. Sus datos se vuelcan al Anexo A automáticamente.</div>
            <div style={{marginBottom:"6px",fontSize:"11px",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:"var(--text-tertiary)"}}>Proyecto</div>
            <select className="ct-fsel" style={{marginBottom:"16px"}} value={proyecto} onChange={e=>{setProyecto(e.target.value);setUnidadSel(null)}}>
              <option>Toribio Polo</option><option>Libertad</option><option>Ugarte y Moscoso 370</option>
            </select>
            <div style={{marginBottom:"6px",fontSize:"11px",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:"var(--text-tertiary)"}}>Departamento</div>
            <div className="ct-unit-grid">
              {unidades.map(u=>(
                <div key={u.id} className={`ct-unit-opt${unidadSel===u.id?" sel":""}`} onClick={()=>setUnidadSel(u.id)}>
                  <div className="ct-uid">{u.id}</div>
                  <div className="ct-umeta">{u.tipo} · {u.area}</div>
                  <div className="ct-uprice">{u.precio}</div>
                </div>
              ))}
            </div>
          </div>}

          {/* Step 4: Plantilla */}
          {step===4&&<div className="ct-panel">
            <div className="ct-ptitle">Plantilla de contrato</div>
            <div className="ct-pdesc">Elige el tipo de documento. Los campos variables se completan automáticamente.</div>
            {PLANTILLAS.map(p=>(
              <div key={p.id} className={`ct-tmpl-card${plantillaSel===p.id?" sel":""}`} onClick={()=>setPlantillaSel(p.id)}>
                <div className="ct-tmpl-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div><div className="ct-tmpl-name">{p.nombre}</div><div className="ct-tmpl-desc">{p.desc}</div></div>
                <span className="ct-tmpl-badge">{p.clausulas}</span>
              </div>
            ))}
          </div>}

          {/* Step 5: Generar */}
          {step===5&&<div className="ct-panel">
            <div className="ct-ptitle">Todo listo ✓</div>
            <div className="ct-pdesc">Revisa el resumen y genera el contrato con el Anexo A completo.</div>
            <div style={{background:"var(--bg-elevated)",borderRadius:"10px",padding:"20px",marginBottom:"20px"}}>
              <div style={{fontSize:"13px",marginBottom:"8px"}}><b>Cliente:</b> {clienteSel?.nombre}</div>
              <div style={{fontSize:"13px",marginBottom:"8px"}}><b>Titulares:</b> {titulares.filter(t=>t.nombre).map(t=>t.nombre).join(", ")}</div>
              <div style={{fontSize:"13px",marginBottom:"8px"}}><b>Proyecto:</b> {clienteSel?.proyecto}</div>
              <div style={{fontSize:"13px",marginBottom:"8px"}}><b>Unidad:</b> {unidadSel ?? "—"}</div>
              <div style={{fontSize:"13px"}}><b>Plantilla:</b> {PLANTILLAS.find(p=>p.id===plantillaSel)?.nombre ?? "—"}</div>
            </div>
            <button className="btn-gold" style={{width:"100%"}} onClick={()=>showToast("En producción: genera el contrato con el Anexo A completo en PDF")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Generar contrato y Anexo A
            </button>
          </div>}

          <div className="ct-actions">
            <button className="btn-ghost" style={{visibility:step===1?"hidden":"visible"}} onClick={()=>setStep(s=>s-1)}>← Atrás</button>
            {step<5&&<button className="btn-gold" disabled={!canNextStep} onClick={()=>setStep(s=>s+1)}>Continuar →</button>}
          </div>
        </div>

        {/* Preview */}
        <div className="ct-preview">
          <div className="ct-prev-lbl">⚡ Ficha en construcción</div>
          {!clienteSel?<div className="pv-empty">La ficha se irá completando aquí</div>:(
            <>
              <div className="pv-sec">
                <div className="pv-sec-title">Cliente</div>
                <div className="pv-item"><span className="pv-k">Nombre</span><span className="pv-v">{clienteSel.nombre}</span></div>
                <div className="pv-item"><span className="pv-k">Proyecto</span><span className="pv-v">{clienteSel.proyecto}</span></div>
                <div className="pv-item"><span className="pv-k">Asesor</span><span className="pv-v">{clienteSel.asesor}</span></div>
              </div>
              {titulares.some(t=>t.nombre)&&<div className="pv-sec">
                <div className="pv-sec-title">Titulares</div>
                {titulares.filter(t=>t.nombre).map((t,i)=>(
                  <div key={i} className="pv-item"><span className="pv-k">Titular {i+1}</span><span className="pv-v">{t.nombre}{t.dni?` · ${t.dni}`:""}</span></div>
                ))}
              </div>}
              {unidadSel&&<div className="pv-sec">
                <div className="pv-sec-title">Unidad</div>
                <div className="pv-item"><span className="pv-k">Proyecto</span><span className="pv-v">{proyecto}</span></div>
                <div className="pv-item"><span className="pv-k">Unidad</span><span className="pv-v">{unidadSel}</span></div>
                {unidades.find(u=>u.id===unidadSel)&&<>
                  <div className="pv-item"><span className="pv-k">Área</span><span className="pv-v">{unidades.find(u=>u.id===unidadSel)!.area}</span></div>
                  <div className="pv-item"><span className="pv-k">Precio</span><span className="pv-v" style={{color:"var(--accent-gold)"}}>{unidades.find(u=>u.id===unidadSel)!.precio}</span></div>
                </>}
              </div>}
              {plantillaSel&&<div className="pv-sec">
                <div className="pv-sec-title">Documento</div>
                <div className="pv-item"><span className="pv-k">Plantilla</span><span className="pv-v">{PLANTILLAS.find(p=>p.id===plantillaSel)?.nombre}</span></div>
              </div>}
            </>
          )}
        </div>
      </div>

      <div className={`ct-toast${toastOn?" on":""}`}>{toast}</div>
    </div>
  );
}
