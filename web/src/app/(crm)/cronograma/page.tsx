"use client";
import { useState } from "react";

const CRONOGRAMAS = [{"deal_id":"D007","cliente":"Janett Manchego","proyecto":"Saenz Peña 212","unidad":"101","monto_total":383110,"fecha_firma":"2025-04-15","fecha_entrega":"2027-04-05","es_financiado":false,"banco":null,"asesor":"Arturo","cuotas":[{"concepto":"Separación","fecha":"2025-04-15","monto":4980,"medio":"Transferencia","estado":"pagado","comprobante":"OP-76563"},{"concepto":"Cuota inicial","fecha":"2025-04-17","monto":71642,"medio":"Transferencia","estado":"pagado","comprobante":"OP-86989"},{"concepto":"Cuota 1","fecha":"2025-08-13","monto":30649,"medio":"Transferencia","estado":"pagado","comprobante":"OP-92559"},{"concepto":"Cuota 2","fecha":"2025-10-12","monto":30649,"medio":"Transferencia","estado":"pagado","comprobante":"OP-34402"},{"concepto":"Cuota 3","fecha":"2025-12-11","monto":30649,"medio":"Transferencia","estado":"proximo"},{"concepto":"Cuota 4","fecha":"2026-02-09","monto":30649,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 5","fecha":"2026-04-10","monto":30649,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 6","fecha":"2026-06-09","monto":30649,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 7","fecha":"2026-08-08","monto":30649,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 8","fecha":"2026-10-07","monto":30649,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 9","fecha":"2026-12-06","monto":30649,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 10","fecha":"2027-02-04","monto":30649,"medio":"Transferencia","estado":"pendiente"}]},{"deal_id":"D009","cliente":"Juan Luis Herrera","proyecto":"Pasaje Laureles","unidad":"C202 | D402","monto_total":931000,"fecha_firma":"2025-04-10","fecha_entrega":"2027-09-27","es_financiado":true,"banco":"BCP","asesor":"Carlos","cuotas":[{"concepto":"Separación","fecha":"2025-04-10","monto":12103,"medio":"Transferencia","estado":"pagado","comprobante":"OP-28585"},{"concepto":"Cuota inicial","fecha":"2025-04-12","monto":127547,"medio":"Transferencia","estado":"pagado","comprobante":"OP-21884"},{"concepto":"Cuota 1","fecha":"2025-08-08","monto":18262,"medio":"Transferencia","estado":"pagado","comprobante":"OP-15489"},{"concepto":"Cuota 2","fecha":"2025-10-07","monto":18262,"medio":"Transferencia","estado":"pagado","comprobante":"OP-61925"},{"concepto":"Cuota 3","fecha":"2025-12-06","monto":18262,"medio":"Transferencia","estado":"proximo"},{"concepto":"Cuota 4","fecha":"2026-02-04","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 5","fecha":"2026-04-05","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 6","fecha":"2026-06-04","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 7","fecha":"2026-08-03","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 8","fecha":"2026-10-02","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 9","fecha":"2026-12-01","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 10","fecha":"2027-01-30","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 11","fecha":"2027-03-31","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 12","fecha":"2027-05-30","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 13","fecha":"2027-07-29","monto":18262,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Saldo financiado (entrega)","fecha":"2027-09-27","monto":553945,"medio":"BCP","estado":"pendiente"}]},{"deal_id":"D013","cliente":"Fiorella Cerron y Luis Barrera","proyecto":"Ugarte y Moscoso 370","unidad":"B 1003","monto_total":1688050,"fecha_firma":"2025-02-20","fecha_entrega":"2027-02-10","es_financiado":false,"banco":null,"asesor":"Javier","cuotas":[{"concepto":"Separación","fecha":"2025-02-20","monto":21945,"medio":"Transferencia","estado":"pagado","comprobante":"OP-11966"},{"concepto":"Cuota inicial","fecha":"2025-02-22","monto":400067,"medio":"Transferencia","estado":"pagado","comprobante":"OP-79255"},{"concepto":"Cuota 1","fecha":"2025-06-20","monto":126604,"medio":"Transferencia","estado":"pagado","comprobante":"OP-41711"},{"concepto":"Cuota 2","fecha":"2025-08-19","monto":126604,"medio":"Transferencia","estado":"pagado","comprobante":"OP-70808"},{"concepto":"Cuota 3","fecha":"2025-10-18","monto":126604,"medio":"Transferencia","estado":"pagado","comprobante":"OP-87458"},{"concepto":"Cuota 4","fecha":"2025-12-17","monto":126604,"medio":"Transferencia","estado":"proximo"},{"concepto":"Cuota 5","fecha":"2026-02-15","monto":126604,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 6","fecha":"2026-04-16","monto":126604,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 7","fecha":"2026-06-15","monto":126604,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 8","fecha":"2026-08-14","monto":126604,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 9","fecha":"2026-10-13","monto":126604,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 10","fecha":"2026-12-12","monto":126604,"medio":"Transferencia","estado":"pendiente"}]},{"deal_id":"C001","cliente":"Carla Carty","proyecto":"Saenz Peña 212","unidad":"102 | 101","monto_total":2221380,"fecha_firma":"2025-02-21","fecha_entrega":"2027-02-11","es_financiado":true,"banco":"Interbank","asesor":"Carlos","cuotas":[{"concepto":"Separación","fecha":"2025-02-21","monto":28878,"medio":"Transferencia","estado":"vencido"},{"concepto":"Cuota inicial","fecha":"2025-02-23","monto":304329,"medio":"Transferencia","estado":"pagado","comprobante":"OP-75506"},{"concepto":"Cuota 1","fecha":"2025-06-21","monto":56645,"medio":"Transferencia","estado":"pagado","comprobante":"OP-46459"},{"concepto":"Cuota 2","fecha":"2025-08-20","monto":56645,"medio":"Transferencia","estado":"pagado","comprobante":"OP-82255"},{"concepto":"Cuota 3","fecha":"2025-10-19","monto":56645,"medio":"Transferencia","estado":"pagado","comprobante":"OP-20905"},{"concepto":"Cuota 4","fecha":"2025-12-18","monto":56645,"medio":"Transferencia","estado":"proximo"},{"concepto":"Cuota 5","fecha":"2026-02-16","monto":56645,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 6","fecha":"2026-04-17","monto":56645,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 7","fecha":"2026-06-16","monto":56645,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 8","fecha":"2026-08-15","monto":56645,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 9","fecha":"2026-10-14","monto":56645,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Cuota 10","fecha":"2026-12-13","monto":56645,"medio":"Transferencia","estado":"pendiente"},{"concepto":"Saldo financiado (entrega)","fecha":"2027-02-11","monto":1321721,"medio":"Interbank","estado":"pendiente"}]}];

type Cuota = { concepto:string; fecha:string; monto:number; medio:string; estado:string; comprobante?:string; };
type Cronograma = typeof CRONOGRAMAS[0];

const PILL: Record<string,{label:string;color:string;bg:string}> = {
  pagado: {label:"Pagado",color:"var(--accent-aqua)",bg:"rgba(111,184,168,.14)"},
  proximo: {label:"Próximo",color:"var(--accent-gold)",bg:"rgba(212,165,116,.14)"},
  pendiente: {label:"Pendiente",color:"var(--text-tertiary)",bg:"var(--bg-elevated)"},
  vencido: {label:"Vencido",color:"var(--accent-terracotta)",bg:"rgba(224,120,86,.14)"},
};

function fmtMoney(v: number) { return "S/ "+Math.round(v).toLocaleString("es-PE"); }
function initials(name: string) { return name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

export default function CronogramaPage() {
  const [selected, setSelected] = useState<Cronograma>(CRONOGRAMAS[0]);
  const [showModal, setShowModal] = useState(false);
  const [paying, setPaying] = useState<Cuota|null>(null);
  const [toast, setToast] = useState(""); const [toastOn, setToastOn] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setToastOn(true); setTimeout(()=>setToastOn(false),2800); };

  const pagadas = selected.cuotas.filter(c=>c.estado==="pagado");
  const vencidas = selected.cuotas.filter(c=>c.estado==="vencido");
  const montoPagado = pagadas.reduce((a,c)=>a+c.monto,0) + vencidas.reduce((a,c)=>a+c.monto,0);
  const montoVencido = vencidas.reduce((a,c)=>a+c.monto,0);
  const pct = Math.round((montoPagado/selected.monto_total)*100);
  const proxima = selected.cuotas.find(c=>c.estado==="proximo");

  return (
    <div style={{padding:"20px 28px 40px"}}>
      <style>{`
        .crn-layout{display:grid;grid-template-columns:300px 1fr;gap:20px;align-items:start}
        .crn-panel{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:16px}
        .crn-ptitle{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-tertiary);font-weight:700;margin-bottom:12px;padding:0 4px}
        .crn-client{padding:12px;border-radius:9px;cursor:pointer;margin-bottom:6px;border:1px solid transparent;transition:all .12s}
        .crn-client:hover{background:var(--bg-hover)}
        .crn-client.sel{background:var(--bg-elevated);border-color:var(--accent-gold)}
        .crn-cname{font-size:13.5px;font-weight:600;margin-bottom:3px}
        .crn-cmeta{font-size:11px;color:var(--text-tertiary);display:flex;justify-content:space-between}
        .crn-prog-mini{height:4px;background:var(--bg-elevated);border-radius:2px;overflow:hidden;margin-top:8px}
        .crn-prog-mini-fill{height:100%;background:var(--accent-aqua);border-radius:2px}
        .crn-detail{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:24px}
        .crn-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border-subtle)}
        .crn-title{font-size:18px;font-weight:600}
        .crn-sub{font-size:12.5px;color:var(--text-tertiary);margin-top:4px}
        .crn-actions{display:flex;gap:8px}
        .btn-gold{padding:9px 16px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;border:none;background:var(--accent-gold);color:#fff;display:flex;align-items:center;gap:6px;transition:filter .15s}
        .btn-gold:hover{filter:brightness(1.08)}
        .btn-ghost{padding:9px 16px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;border:1px solid var(--border-subtle);background:var(--bg-elevated);color:var(--text-primary);display:flex;align-items:center;gap:6px}
        .btn-ghost:hover{background:var(--bg-hover)}
        .pay-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px}
        .pay-stat{background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;padding:14px 16px}
        .pay-stat-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-tertiary);font-weight:600;margin-bottom:6px}
        .pay-stat-val{font-family:monospace;font-size:19px;font-weight:600;letter-spacing:-.3px}
        .big-prog{margin-bottom:22px}
        .big-prog-head{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:8px}
        .big-prog-bar{height:12px;background:var(--bg-elevated);border-radius:6px;overflow:hidden;display:flex}
        .ct{width:100%;border-collapse:collapse}
        .ct th{text-align:left;padding:10px 12px;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-tertiary);font-weight:600;border-bottom:1px solid var(--border-subtle)}
        .ct th:last-child{text-align:center}
        .ct td{padding:11px 12px;font-size:13px;border-bottom:1px solid var(--border-subtle)}
        .ct-concepto{font-weight:600}
        .ct-fecha{font-family:monospace;font-size:12px;color:var(--text-secondary)}
        .ct-monto{font-family:monospace;font-weight:600}
        .ct-medio{font-size:11.5px;color:var(--text-tertiary)}
        .pay-pill{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px}
        .pay-pill::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor}
        .reg-btn{padding:5px 12px;font-size:11.5px;font-weight:600;border-radius:6px;cursor:pointer;border:1px solid var(--border-subtle);background:var(--bg-elevated);color:var(--text-secondary);transition:all .12s;white-space:nowrap}
        .reg-btn:hover{border-color:var(--accent-gold);color:var(--accent-gold)}
        .modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:200;padding:24px}
        .modal-box{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;width:100%;max-width:480px;padding:24px}
        .modal-title{font-size:16px;font-weight:600;margin-bottom:4px}
        .modal-sub{font-size:12.5px;color:var(--text-tertiary);margin-bottom:20px}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
        .form-lbl{font-size:11px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.03em;margin-bottom:5px;display:block}
        .form-inp{background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:7px;padding:9px 11px;font-size:13px;color:var(--text-primary);font-family:inherit;width:100%}
        .form-inp:focus{outline:none;border-color:var(--accent-gold)}
        .crn-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--accent-aqua);color:#fff;padding:12px 22px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 12px 32px var(--shadow);z-index:300;transition:transform .3s;pointer-events:none}
        .crn-toast.on{transform:translateX(-50%) translateY(0)}
        @media(max-width:1000px){.crn-layout{grid-template-columns:1fr}.pay-summary{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      <div style={{marginBottom:"20px"}}>
        <h1 style={{fontSize:"20px",fontWeight:600,letterSpacing:"-.3px"}}>Cronograma de Pagos</h1>
        <div style={{fontSize:"12.5px",color:"var(--text-tertiary)",marginTop:"2px"}}>Seguimiento de cuotas y registro de pagos</div>
      </div>

      <div className="crn-layout">
        {/* Panel izquierdo: lista de clientes */}
        <div className="crn-panel">
          <div className="crn-ptitle">Clientes con cronograma</div>
          {CRONOGRAMAS.map(c=>{
            const pct2 = Math.round((c.cuotas.filter(x=>x.estado==="pagado").reduce((a,x)=>a+x.monto,0)/c.monto_total)*100);
            const hasVenc = c.cuotas.some(x=>x.estado==="vencido");
            return (
              <div key={c.deal_id} className={`crn-client${selected.deal_id===c.deal_id?" sel":""}`} onClick={()=>setSelected(c)}>
                <div className="crn-cname">{c.cliente}{hasVenc&&<span style={{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",background:"var(--accent-terracotta)",marginLeft:"6px",verticalAlign:"middle"}}/>}</div>
                <div className="crn-cmeta"><span>{c.proyecto}</span><span style={{fontFamily:"monospace"}}>{pct2}%</span></div>
                <div className="crn-prog-mini"><div className="crn-prog-mini-fill" style={{width:`${pct2}%`}}/></div>
              </div>
            );
          })}
        </div>

        {/* Panel derecho: detalle */}
        <div className="crn-detail">
          <div className="crn-hdr">
            <div>
              <div className="crn-title">{selected.cliente}</div>
              <div className="crn-sub">{selected.proyecto} · Unidad {selected.unidad}</div>
              {selected.es_financiado&&<span style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"11px",color:"var(--accent-aqua)",background:"rgba(111,184,168,.1)",padding:"4px 10px",borderRadius:"6px",marginTop:"8px"}}>
                Hipotecario · {selected.banco}
              </span>}
            </div>
            <div className="crn-actions">
              {proxima&&<button className="btn-gold" onClick={()=>{setPaying(proxima);setShowModal(true)}}>
                Registrar pago
              </button>}
              <button className="btn-ghost" onClick={()=>showToast("En producción: descarga el cronograma como PDF")}>
                Descargar PDF
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="pay-summary">
            <div className="pay-stat">
              <div className="pay-stat-lbl">Precio total</div>
              <div className="pay-stat-val">{fmtMoney(selected.monto_total)}</div>
            </div>
            <div className="pay-stat">
              <div className="pay-stat-lbl">Pagado</div>
              <div className="pay-stat-val" style={{color:"var(--accent-aqua)"}}>{fmtMoney(montoPagado)}</div>
            </div>
            <div className="pay-stat">
              <div className="pay-stat-lbl">Pendiente</div>
              <div className="pay-stat-val">{fmtMoney(selected.monto_total-montoPagado)}</div>
            </div>
            {montoVencido>0&&<div className="pay-stat">
              <div className="pay-stat-lbl">Vencido</div>
              <div className="pay-stat-val" style={{color:"var(--accent-terracotta)"}}>{fmtMoney(montoVencido)}</div>
            </div>}
            {montoVencido===0&&<div className="pay-stat">
              <div className="pay-stat-lbl">Entrega</div>
              <div className="pay-stat-val" style={{fontSize:"14px",paddingTop:"4px"}}>{selected.fecha_entrega}</div>
            </div>}
          </div>

          {/* Barra de progreso */}
          <div className="big-prog">
            <div className="big-prog-head">
              <span style={{fontWeight:600}}>{pct}% completado</span>
              <span style={{color:"var(--text-tertiary)"}}>{pagadas.length} de {selected.cuotas.length} cuotas</span>
            </div>
            <div className="big-prog-bar">
              <div style={{height:"100%",background:"var(--accent-aqua)",width:`${pct}%`}}/>
              {montoVencido>0&&<div style={{height:"100%",background:"var(--accent-terracotta)",width:`${Math.round((montoVencido/selected.monto_total)*100)}%`}}/>}
            </div>
          </div>

          {/* Tabla de cuotas */}
          <table className="ct">
            <thead><tr><th>Concepto</th><th>Fecha</th><th>Monto</th><th>Medio</th><th style={{textAlign:"center"}}>Estado</th><th/></tr></thead>
            <tbody>
              {selected.cuotas.map((c,i)=>{
                const pill = PILL[c.estado] ?? PILL.pendiente;
                return (
                  <tr key={i}>
                    <td><div className="ct-concepto">{c.concepto}</div>{c.comprobante&&<div style={{fontSize:"11px",color:"var(--accent-aqua)",fontFamily:"monospace"}}>{c.comprobante}</div>}</td>
                    <td><span className="ct-fecha">{c.fecha}</span></td>
                    <td><span className="ct-monto">{fmtMoney(c.monto)}</span></td>
                    <td><span className="ct-medio">{c.medio}</span></td>
                    <td style={{textAlign:"center"}}>
                      <span className="pay-pill" style={{color:pill.color,background:pill.bg}}>{pill.label}</span>
                    </td>
                    <td>
                      {(c.estado==="proximo"||c.estado==="vencido")&&
                        <button className="reg-btn" onClick={()=>{setPaying(c);setShowModal(true)}}>Registrar</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de pago */}
      {showModal&&paying&&(
        <div className="modal-ov" onClick={e=>{if(e.target===e.currentTarget)setShowModal(false)}}>
          <div className="modal-box">
            <div className="modal-title">Registrar pago · {paying.concepto}</div>
            <div className="modal-sub">{selected.cliente} · {fmtMoney(paying.monto)}</div>
            <div className="form-row">
              <div><label className="form-lbl">Fecha de pago</label><input className="form-inp" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></div>
              <div><label className="form-lbl">Monto pagado</label><input className="form-inp" type="number" defaultValue={paying.monto}/></div>
            </div>
            <div style={{marginBottom:"12px"}}>
              <label className="form-lbl">Número de operación</label>
              <input className="form-inp" placeholder="OP-XXXXX"/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label className="form-lbl">Banco / Entidad</label>
              <input className="form-inp" placeholder="BCP, Interbank, efectivo…" defaultValue={paying.medio}/>
            </div>
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
              <button className="btn-ghost" onClick={()=>setShowModal(false)}>Cancelar</button>
              <button className="btn-gold" onClick={()=>{setShowModal(false);showToast("Pago registrado correctamente")}}>Confirmar pago</button>
            </div>
          </div>
        </div>
      )}

      <div className={`crn-toast${toastOn?" on":""}`}>{toast}</div>
    </div>
  );
}
