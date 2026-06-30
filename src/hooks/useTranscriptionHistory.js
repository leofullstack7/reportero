import { useState, useEffect, useCallback } from "react";
import {
  fetchTranscriptions,
  saveTranscription,
  updateTranscriptionSummary,
  deleteTranscription,
} from "../api/transcriptions";
import { isSupabaseConfigured } from "../lib/supabase";

export function useTranscriptionHistory(notify, user) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  const loadHistory = useCallback(async () => {
    if (!configured || !user) {
      setHistory([]);
      return;
    }
    setLoading(true);
    try {
      const rows = await fetchTranscriptions();
      setHistory(rows);
    } catch (err) {
      console.error(err);
      notify(err.message || "No se pudo cargar el historial", "error");
    }
    setLoading(false);
  }, [configured, user, notify]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const saveToHistory = useCallback(
    async (content, source = "whisper") => {
      if (!configured || !user) return null;
      try {
        const row = await saveTranscription({ content, source });
        setHistory((prev) => [row, ...prev]);
        return row;
      } catch (err) {
        console.error(err);
        notify("Transcripción lista, pero no se guardó: " + err.message, "error");
        return null;
      }
    },
    [configured, user, notify]
  );

  const saveSummaryToHistory = useCallback(
    async (id, summary) => {
      if (!configured || !user || !id) return;
      try {
        await updateTranscriptionSummary(id, summary);
        setHistory((prev) => prev.map((r) => (r.id === id ? { ...r, summary } : r)));
      } catch (err) {
        console.error(err);
      }
    },
    [configured, user]
  );

  const removeFromHistory = useCallback(
    async (id) => {
      if (!configured || !user) return;
      try {
        await deleteTranscription(id);
        setHistory((prev) => prev.filter((r) => r.id !== id));
        notify("Eliminado del historial", "success");
      } catch (err) {
        notify(err.message || "No se pudo eliminar", "error");
      }
    },
    [configured, user, notify]
  );

  return {
    history,
    historyLoading: loading,
    supabaseConfigured: configured,
    loadHistory,
    saveToHistory,
    saveSummaryToHistory,
    removeFromHistory,
  };
}
