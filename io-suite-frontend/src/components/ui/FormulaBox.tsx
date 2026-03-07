import type { FC, ReactNode } from "react";

interface FormulaBoxProps {
  children: ReactNode;
}

const FormulaBox: FC<FormulaBoxProps> = ({ children }) => (
  <div className="formula-box">{children}</div>
);

export default FormulaBox;