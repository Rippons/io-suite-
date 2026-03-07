import type { FC } from "react";
import type { NavItem, TabId } from "../../types";

interface SidebarProps {
  active: TabId;
  onSelect: (id: TabId) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home",        icon: "⌂", label: "Inicio",       badge: ""   },
  { id: "dual",        icon: "⟺", label: "Dualidad",     badge: "LP" },
  { id: "sensitivity", icon: "◈", label: "Sensibilidad", badge: "SA" },
  { id: "simplex",     icon: "∇", label: "Simplex Rev.", badge: "RS" },
  { id: "transport",   icon: "⬡", label: "Transporte",   badge: "TP" },
];

const Sidebar: FC<SidebarProps> = ({ active, onSelect }) => (
  <nav className="sidebar">
    <div className="sidebar-label">Módulos</div>
    {NAV_ITEMS.map((item) => (
      <button
        key={item.id}
        className={`nav-btn ${active === item.id ? "active" : ""}`}
        onClick={() => onSelect(item.id)}
      >
        <span className="nav-icon">{item.icon}</span>
        {item.label}
        {item.badge && <span className="nav-badge">{item.badge}</span>}
      </button>
    ))}
  </nav>
);

export default Sidebar;