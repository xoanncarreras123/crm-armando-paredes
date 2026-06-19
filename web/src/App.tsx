import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Dashboard } from "@/pages/Dashboard";
import { Pipeline } from "@/pages/Pipeline";
import { Prospectos } from "@/pages/Prospectos";
import { ProspectoDetalle } from "@/pages/ProspectoDetalle";
import { Proyectos } from "@/pages/Proyectos";
import { Inventario } from "@/pages/Inventario";
import { Cotizador } from "@/pages/Cotizador";
import { Alertas } from "@/pages/Alertas";
import { Automatizaciones } from "@/pages/Automatizaciones";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
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
  return <RouterProvider router={router} />;
}
