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
import { usePrefs, type Role } from "@/lib/prefs";
import { useAuth } from "@/lib/auth";

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
  const { role, setRole } = usePrefs();
  const { session, logout } = useAuth();

  const initials = session
    ? session.nombre.split(" ").slice(0, 2).map((w) => w[0]).join("")
    : "??";

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
                  style={{ color: isActive ? "rgb(var(--gold-rgb))" : undefined }}
                />
                <span>{label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Vista demo · rol (controla los permisos de backoffice en Inventario) */}
      <div className="mx-3 mt-2 rounded-lg border border-border bg-surface p-2.5">
        <div className="mb-2 px-0.5 text-2xs font-semibold uppercase tracking-normal text-ink-faint">
          Vista demo · rol
        </div>
        <div className="flex gap-0.5 rounded-md bg-bg p-0.5">
          {(
            [
              { v: "seller", label: "Vendedor" },
              { v: "admin", label: "Backoffice" },
            ] as { v: Role; label: string }[]
          ).map(({ v, label }) => (
            <button
              key={v}
              onClick={() => setRole(v)}
              className={`flex-1 rounded px-2 py-1.5 text-xs font-semibold transition-colors ${
                role === v ? "bg-gold text-bg" : "text-ink-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Asesor logueado */}
      <div className="m-3 flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue/20 font-display text-xs font-bold text-blue">
          {initials}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-medium">{session?.nombre ?? "Usuario"}</div>
          <div className="text-2xs text-ink-faint">{session?.email ?? ""}</div>
        </div>
        <button
          onClick={logout}
          title="Cerrar sesión"
          className="shrink-0 rounded-md p-1 text-ink-faint transition-colors hover:text-red hover:bg-red/10"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
