import type { FC } from "react";

interface StatBoxProps {
  label: string;
  value: string | number;
  small?: boolean;
}

const StatBox: FC<StatBoxProps> = ({ label, value, small }) => (
  <div className="stat">
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={small ? { fontSize: 15 } : {}}>
      {value}
    </div>
  </div>
);

export default StatBox;