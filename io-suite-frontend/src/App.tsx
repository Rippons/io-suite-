import { useState } from "react";
import type { TabId } from "./types";

import Layout from "./components/layout/Layout";
import Home from "./components/modules/Home";
import DualMethod from "./components/modules/DualMethod";
import SensitivityPanel from "./components/modules/SensitivityPanel";
import SimplexRevised from "./components/modules/SimplexRevised";
import TransportProblem from "./components/modules/TransportProblem";

export default function App() {
  const [tab, setTab] = useState<TabId>("home");

  const renderPanel = () => {
    switch (tab) {
      case "dual":        return <DualMethod />;
      case "sensitivity": return <SensitivityPanel />;
      case "simplex":     return <SimplexRevised />;
      case "transport":   return <TransportProblem />;
      default:            return <Home onNavigate={setTab} />;
    }
  };

  return (
    <Layout active={tab} onSelect={setTab}>
      {renderPanel()}
    </Layout>
  );
}