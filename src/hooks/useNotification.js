import { useState, useCallback } from "react";

export function useNotification() {
  const [notification, setNotification] = useState(null);

  const notify = useCallback((msg, type = "info") => {
    setNotification({ msg, type });
    const duration = type === "error" ? 8000 : 3000;
    setTimeout(() => setNotification(null), duration);
  }, []);

  return { notification, notify };
}
