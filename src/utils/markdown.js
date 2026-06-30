export function renderMd(text) {
  return text
    .replace(
      /^### (.+)$/gm,
      '<h3 style="font-size:14px;font-weight:700;color:#6366f1;margin:16px 0 6px">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="font-size:16px;font-weight:700;color:#4f46e5;margin:20px 0 8px">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 style="font-size:18px;font-weight:800;color:#312e81;margin:0 0 12px">$1</h1>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#1e1b4b">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /^- (.+)$/gm,
      '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:#6366f1;margin-top:2px">▸</span><span>$1</span></div>'
    )
    .replace(
      /^\d+\. (.+)$/gm,
      '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:#6366f1;min-width:20px;font-weight:600">•</span><span>$1</span></div>'
    )
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
