import type { FC } from "react";

const LoadingState: FC = () => (
  <div className="loading-pulse">
    <div className="spinner" />
    Ejecutando Python en backend...
  </div>
);

export default LoadingState;