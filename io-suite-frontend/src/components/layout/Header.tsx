import type { FC } from "react";

const Header: FC = () => (
  <header className="header">
    <div className="header-icon">∑</div>
    <div>
      <h1>IO Suite</h1>
      <p>Investigación de Operaciones · React + TypeScript + Python</p>
    </div>
    <span className="py-badge">🐍 Python Backend</span>
  </header>
);

export default Header;