import { useState } from "react";
import type { ProspectoDetalle } from "@/api/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { EtapaBadge } from "@/components/ui/EtapaBadge";
import { IconBolt, IconWhatsapp } from "@/components/ui/icons";
import { relativeTime } from "@/lib/format";
import { generarMensaje, OBJETIVOS, type ObjetivoMensaje } from "@/lib/messageGen";

type Tono = "formal" | "casual";

export function GenerarMensajeModal({
  prospecto,
  onClose,
}: {
  prospecto: ProspectoDetalle;
  onClose: () => void;
}) {
  const [objetivo, setObjetivo] = useState<ObjetivoMensaje>("SEGUIMIENTO");
  const [loading, setLoading] = useState(false);
  const [versiones, setVersiones] = useState<{ formal: string; casual: string } | null>(null);
  const [tono, setTono] = useState<Tono>("casual");
  const [texto, setTexto] = useState("");
  const [copiado, setCopiado] = useState(false);

  const ultima = prospecto.interacciones[0];

  async function generar() {
    setLoading(true);
    setVersiones(null);
    const v = await generarMensaje(objetivo, {
      nombre: prospecto.nombre,
      proyecto: prospecto.proyecto.nombre,
    });
    setVersiones(v);
    setTexto(v[tono]);
    setLoading(false);
  }

  function elegirTono(t: Tono) {
    setTono(t);
    if (versiones) setTexto(versiones[t]);
  }

  function copiar() {
    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-fade-up flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-border-strong bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gold-soft text-gold">
            <IconBolt width={15} height={15} />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold leading-tight">Generar mensaje con IA</h2>
            <p className="text-xs text-ink-faint">para {prospecto.nombre}</p>
          </div>
          <button onClick={onClose} className="ml-auto text-ink-faint hover:text-ink" aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Contexto del prospecto */}
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg/40 px-4 py-3">
            <EtapaBadge etapa={prospecto.etapa} />
            <span className="flex items-center gap-1.5 text-xs text-ink-muted">
              Score <ScoreBadge score={prospecto.score} />
            </span>
            {ultima && (
              <span className="text-xs text-ink-faint">
                Última interacción: {ultima.tipo.toLowerCase()} · {relativeTime(ultima.fecha)}
              </span>
            )}
          </div>

          {/* Objetivo */}
          <div>
            <div className="label mb-2">Objetivo del mensaje</div>
            <div className="flex flex-wrap gap-1.5">
              {OBJETIVOS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => setObjetivo(o.key)}
                  className={`rounded-pill px-3 py-1.5 text-xs font-medium transition-colors ${
                    objetivo === o.key
                      ? "bg-gold text-bg"
                      : "border border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generar}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-px disabled:opacity-60"
          >
            <IconBolt width={15} height={15} />
            {loading ? "Generando…" : versiones ? "Regenerar" : "Generar 2 versiones"}
          </button>

          {/* Resultado */}
          {loading && (
            <div className="space-y-2">
              <div className="skeleton h-4 w-1/3 rounded" />
              <div className="skeleton h-20 rounded-lg" />
            </div>
          )}

          {versiones && !loading && (
            <div className="space-y-3">
              <div className="flex gap-1.5">
                {(["casual", "formal"] as Tono[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => elegirTono(t)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                      tono === t ? "bg-raised text-ink" : "text-ink-faint hover:text-ink"
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <span className="ml-auto self-center text-2xs text-ink-faint">
                  Editable antes de enviar
                </span>
              </div>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-lg border border-border bg-bg/50 p-3 text-sm leading-relaxed text-ink focus:border-border-strong focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {versiones && (
          <div className="flex items-center gap-3 border-t border-border px-6 py-4">
            <button
              onClick={copiar}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              {copiado ? "¡Copiado!" : "Copiar"}
            </button>
            <a
              href={`https://wa.me/${prospecto.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(texto)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green px-4 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-px"
            >
              <IconWhatsapp width={16} height={16} />
              Enviar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
