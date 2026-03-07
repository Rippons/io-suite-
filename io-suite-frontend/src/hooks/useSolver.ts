import { useState, useCallback } from "react";

interface SolverState<TRes> {
  data: TRes | null;
  loading: boolean;
  error: string;
}

interface SolverReturn<TReq, TRes> extends SolverState<TRes> {
  run: (payload: TReq) => Promise<void>;
  reset: () => void;
}

export function useSolver<TReq, TRes>(
  solverFn: (payload: TReq) => Promise<TRes>
): SolverReturn<TReq, TRes> {
  const [state, setState] = useState<SolverState<TRes>>({
    data: null,
    loading: false,
    error: "",
  });

  const run = useCallback(
    async (payload: TReq): Promise<void> => {
      setState({ data: null, loading: true, error: "" });
      try {
        const data = await solverFn(payload);
        setState({ data, loading: false, error: "" });
      } catch (e) {
        setState({
          data: null,
          loading: false,
          error: e instanceof Error ? e.message : "Error desconocido",
        });
      }
    },
    [solverFn]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: "" });
  }, []);

  return { ...state, run, reset };
}