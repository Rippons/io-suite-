import type {SimplexRequest, SimplexResponse,DualRequest, DualResponse,SensitivityRequest, SensitivityResponse,TransportRequest, TransportResponse,} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function post<TRes>(endpoint: string, body: unknown): Promise<TRes> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error ${res.status}`);
  }

  return res.json() as Promise<TRes>;
}

export const api = {
  simplex: (payload: SimplexRequest) =>
    post<SimplexResponse>("/api/simplex/solve", payload),

  dual: (payload: DualRequest) =>
    post<DualResponse>("/api/dual/solve", payload),

  sensitivity: (payload: SensitivityRequest) =>
    post<SensitivityResponse>("/api/sensitivity/solve", payload),

  transport: (payload: TransportRequest) =>
    post<TransportResponse>("/api/transport/solve", payload),
};