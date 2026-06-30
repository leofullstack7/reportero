import { isSupabaseConfigured, supabase, getCurrentUser } from "../lib/supabase";

function requireSupabase() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error(
      "Supabase no configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env"
    );
  }
  return supabase;
}

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Debes iniciar sesión para guardar transcripciones.");
  }
  return user;
}

export function buildTranscriptionTitle(content) {
  const preview = content.replace(/\s+/g, " ").trim().slice(0, 55);
  const date = new Date().toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return preview ? `${preview}${content.length > 55 ? "…" : ""}` : `Reunión ${date}`;
}

export async function fetchTranscriptions() {
  const client = requireSupabase();
  await requireUser();

  const { data, error } = await client
    .from("transcriptions")
    .select("id, title, content, source, summary, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveTranscription({ content, source = "whisper", summary = null }) {
  const client = requireSupabase();
  const user = await requireUser();

  const { data, error } = await client
    .from("transcriptions")
    .insert({
      user_id: user.id,
      title: buildTranscriptionTitle(content),
      content,
      source,
      summary,
    })
    .select("id, title, content, source, summary, created_at")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTranscriptionSummary(id, summary) {
  const client = requireSupabase();
  await requireUser();

  const { error } = await client.from("transcriptions").update({ summary }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteTranscription(id) {
  const client = requireSupabase();
  await requireUser();

  const { error } = await client.from("transcriptions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
