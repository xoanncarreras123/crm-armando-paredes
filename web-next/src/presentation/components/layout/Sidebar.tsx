"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import {
  IconAlertas, IconAuto, IconCotizador, IconDashboard,
  IconInventario, IconPipeline, IconProspectos, IconProyectos,
  IconContratos, IconCronograma, IconReporteria, IconPricing,
} from "@/presentation/components/ui/icons";
import { usePrefs, type Role } from "@/presentation/providers/PrefsProvider";
import { useAuth } from "@/presentation/providers/AuthProvider";

type Item = { to: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const NAV: Item[] = [
  { to: "/dashboard",        label: "Dashboard",       icon: IconDashboard  },
  { to: "/pipeline",         label: "Pipeline",        icon: IconPipeline   },
  { to: "/prospectos",       label: "Prospectos",      icon: IconProspectos },
  { to: "/proyectos",        label: "Proyectos",       icon: IconProyectos  },
  { to: "/inventario",       label: "Inventario",      icon: IconInventario },
  { to: "/cotizador",        label: "Cotizador IA",    icon: IconCotizador  },
  { to: "/contratos",        label: "Contratos",       icon: IconContratos  },
  { to: "/cronograma",       label: "Cronograma",      icon: IconCronograma },
  { to: "/alertas",          label: "Alertas",         icon: IconAlertas    },
  { to: "/automatizaciones", label: "Automatizaciones",icon: IconAuto       },
  { to: "/reporteria",       label: "Reportería",      icon: IconReporteria },
  { to: "/pricing",          label: "Pricing",         icon: IconPricing    },
];

export function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { role, setRole } = usePrefs();
  const { session, logout } = useAuth();

  const initials = session
    ? session.nombre.split(" ").slice(0, 2).map((w) => w[0]).join("")
    : "??";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r bg-bg" style={{ borderColor:"var(--border)" }}>
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background:"rgb(var(--gold-rgb))", color:"rgb(var(--bg-rgb))" }}>
          <span className="text-lg font-extrabold leading-none" style={{ fontFamily:"var(--font-syne, Syne)" }}>A</span>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight" style={{ fontFamily:"var(--font-syne, Syne)", color:"rgb(var(--ink-rgb))" }}>Armando Paredes</div>
          <div className="text-[11px]" style={{ color:"rgb(var(--ink-faint-rgb))" }}>CRM Inmobiliario</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
        {NAV.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
          return (
            <Link key={to} href={to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-surface text-ink" : "text-ink-muted hover:text-ink"
              }`}
              style={isActive ? { backgroundColor:"rgb(var(--surface-rgb))", color:"rgb(var(--ink-rgb))" } : { color:"rgb(var(--ink-muted-rgb))" }}
            >
              <Icon className="shrink-0" style={{ color: isActive ? "rgb(var(--gold-rgb))" : undefined }} />
              <span>{label}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background:"rgb(var(--gold-rgb))" }} />}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mt-2 rounded-lg p-2.5" style={{ border:"1px solid var(--border)", background:"rgb(var(--surface-rgb))" }}>
        <div className="mb-2 px-0.5 text-[11px] font-semibold uppercase" style={{ color:"rgb(var(--ink-faint-rgb))" }}>Vista demo · rol</div>
        <div className="flex gap-0.5 rounded-md p-0.5" style={{ background:"rgb(var(--bg-rgb))" }}>
          {([{ v:"seller", label:"Vendedor" },{ v:"admin", label:"Backoffice" }] as { v:Role; label:string }[]).map(({ v, label }) => (
            <button key={v} onClick={() => setRole(v)}
              className="flex-1 rounded px-2 py-1.5 text-xs font-semibold transition-colors"
              style={role===v ? { background:"rgb(var(--gold-rgb))", color:"rgb(var(--bg-rgb))" } : { color:"rgb(var(--ink-muted-rgb))" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ border:"1px solid var(--border)", background:"rgb(var(--surface-rgb))" }}>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold" style={{ background:"rgb(var(--blue-rgb)/0.2)", color:"rgb(var(--blue-rgb))" }}>
          {initials}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-medium" style={{ color:"rgb(var(--ink-rgb))" }}>{session?.nombre ?? "Usuario"}</div>
          <div className="text-[11px]" style={{ color:"rgb(var(--ink-faint-rgb))" }}>{session?.email ?? ""}</div>
        </div>
        <button onClick={handleLogout} title="Cerrar sesión" className="shrink-0 rounded-md p-1 transition-colors" style={{ color:"rgb(var(--ink-faint-rgb))" }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}
