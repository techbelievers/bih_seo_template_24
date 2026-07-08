import { useEffect, useState } from "react";
import { fetchApi, peekApi, subscribeApi } from "../lib/api";

/**
 * Subscribe a component to a cached API endpoint.
 * Identical calls across components resolve from one network request,
 * and background revalidation (after a prerendered load) pushes fresh
 * data into mounted components automatically. Already-settled payloads
 * (inlined by the prerender) resolve synchronously — no skeleton flash.
 */
export default function useApi(path) {
  const [state, setState] = useState(() => {
    const data = peekApi(path);
    return data
      ? { data, loading: false, error: null }
      : { data: null, loading: true, error: null };
  });

  useEffect(() => {
    let active = true;
    setState((s) => (s.loading ? s : { ...s, loading: true }));
    fetchApi(path)
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((err) =>
        active && setState({ data: null, loading: false, error: err.message })
      );
    const unsubscribe = subscribeApi(path, (data) =>
      active && setState({ data, loading: false, error: null })
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, [path]);

  return state;
}
