// ─── TAB IDs ─────────────────────────────────────────────────────────────────
export type TabId = "home" | "dual" | "sensitivity" | "simplex" | "transport";

// ─── SIMPLEX ──────────────────────────────────────────────────────────────────
export interface SimplexRequest {
  c: number[];
  A: number[][];
  b: number[];
}

export interface SimplexStep {
  iter: number;
  pivot_row: number;
  pivot_col: number;
  obj_val: number;
}

export interface SimplexResponse {
  status: string;
  x: number[];
  obj_val: number;
  steps: SimplexStep[];
  tableau: number[][];
  basis: number[];
}

// ─── DUAL ─────────────────────────────────────────────────────────────────────
export interface DualRequest {
  c: number[];
  A: number[][];
  b: number[];
}

export interface DualResponse extends SimplexResponse {
  dual_formula: string;
  dual_note: string;
  dual_y: number[];
}

// ─── SENSITIVITY ──────────────────────────────────────────────────────────────
export interface SensitivityRequest {
  c: number[];
  A: number[][];
  b: number[];
}

export interface SensitivityRange {
  var: string;
  current: number;
  in_basis: boolean;
  range_low: number;
  range_high: number;
  x_val: number;
}

export interface RHSRange {
  constraint: string;
  current: number;
  range_low: number;
  range_high: number;
  shadow_price: number;
}

export interface SensitivityResponse extends SimplexResponse {
  ranges: SensitivityRange[];
  rhs_ranges: RHSRange[];
}

// ─── TRANSPORT ────────────────────────────────────────────────────────────────
export interface TransportRequest {
  supply: number[];
  demand: number[];
  costs: number[][];
}

export interface TransportStep {
  i: number;
  j: number;
  amount: number;
  cost: number;
  subtotal: number;
}

export interface TransportResponse {
  alloc: number[][];
  total: number;
  steps: TransportStep[];
  method: string;
  u: (number | null)[];
  v: (number | null)[];
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
export interface NavItem {
  id: TabId;
  icon: string;
  label: string;
  badge: string;
}

export interface HomeCardData {
  id: TabId;
  icon: string;
  title: string;
  desc: string;
  tag: string;
}