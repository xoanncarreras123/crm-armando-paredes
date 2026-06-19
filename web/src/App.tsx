import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Pipeline } from "@/pages/Pipeline";
import { Prospectos } from "@/pages/Prospectos";
import { ProspectoDetalle } from "@/pages/ProspectoDetalle";
import { Proyectos } from "@/pages/Proyectos";
import { Inventario } from "@/pages/Inventario";
import { Cotizador } from "@/pages/Cotizador";
import { Alertas } from "@/pages/Alertas";
import { Automatizaciones } from "@/pages/Automatizaciones";

// Wrapper: redirige al login si no hay sesión activa.
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const router = createHashRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "pipeline", element: <Pipeline /> },
      { path: "prospectos", element: <Prospectos /> },
      { path: "prospectos/:id", element: <ProspectoDetalle /> },
      { path: "proyectos", element: <Proyectos /> },
      { path: "inventario", element: <Inventario /> },
      { path: "cotizador", element: <Cotizador /> },
      { path: "alertas", element: <Alertas /> },
      { path: "automatizaciones", element: <Automatizaciones /> },
    ],
  },
]);

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
