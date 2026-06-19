import { NavLink } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import {
  IconAlertas,
  IconAuto,
  IconCotizador,
  IconDashboard,
  IconInventario,
  IconPipeline,
  IconProspectos,
  IconProyectos,
} from "@/components/ui/icons";

type Item = { to: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const NAV: Item[] = [
  { to: "/", label: "Dashboard", icon: IconDashboard },
  { to: "/pipeline", label: "Pipeline", icon: IconPipeline },
  { to: "/prospectos", label: "Prospectos", icon: IconProspectos },
  { to: "/proyectos", label: "Proyectos", icon: IconProyectos },
  { to: "/inventario", label: "Inventario", icon: IconInventario },
  { to: "/cotizador", label: "Cotizador IA", icon: IconCotizador },
  { to: "/alertas", label: "Alertas", icon: IconAlertas },
  { to: "/automatizaciones", label: "Automatizaciones", icon: IconAuto },
];

export function Sidebar() {
  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-border bg-bg">
      {/* Marca */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold text-bg">
          <span className="font-display text-lg font-extrabold leading-none">A</span>
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm font-bold tracking-tight">Armando Paredes</div>
          <div className="text-2xs text-ink-faint">CRM Inmobiliario</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-surface text-ink"
                  : "text-ink-muted hover:bg-surface/60 hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="shrink-0 transition-colors"
                  style={{ color: isActive ? "#E8C547" : undefined }}
                />
                <span>{label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Asesor logueado */}
      <div className="m-3 flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-blue/20 font-display text-xs font-bold text-blue">
          CR
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm font-medium">Camila Rebaza</div>
          <div className="text-2xs text-ink-faint">Asesora · San Isidro</div>
        </div>
      </div>
    </aside>
  );
}
