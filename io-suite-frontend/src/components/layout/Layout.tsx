import type { FC, ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import type { TabId } from "../../types";

interface LayoutProps {
  active: TabId;
  onSelect: (id: TabId) => void;
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ active, onSelect, children }) => (
  <div>
    <Header />
    <div className="layout">
      <Sidebar active={active} onSelect={onSelect} />
      <main className="main">{children}</main>
    </div>
  </div>
);

export default Layout;