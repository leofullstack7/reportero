import { LANGUAGES } from "../../constants/languages";
import { icons } from "../../constants/icons";
import { Icon } from "../Icon";
import { styles as s } from "../../styles/styles";

export function TranslateTab({
  transInput,
  setTransInput,
  transOutput,
  setTransOutput,
  transLangFrom,
  setTransLangFrom,
  transLangTo,
  setTransLangTo,
  transcript,
  loading,
  copied,
  copyText,
  translate,
}) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
          Traductor de Idiomas
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
          Traduce cualquier texto o la transcripción completa
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={s.label}>Idioma origen</div>
          <select style={s.select} value={transLangFrom} onChange={(e) => setTransLangFrom(e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 20, color: "rgba(255,255,255,0.4)", fontSize: 20 }}>⇄</div>
        <div>
          <div style={s.label}>Idioma destino</div>
          <select style={s.select} value={transLangTo} onChange={(e) => setTransLangTo(e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        {transcript && (
          <div style={{ marginTop: 20 }}>
            <button style={s.btn("ghost")} onClick={() => setTransInput(transcript)}>
              <Icon d={icons.fileText} size={14} /> Usar transcripción
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div>
          <div style={s.label}>Texto original</div>
          <textarea
            style={{ ...s.textarea, minHeight: 220 }}
            value={transInput}
            onChange={(e) => setTransInput(e.target.value)}
            placeholder={`Escribe en ${transLangFrom}…`}
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div style={s.label}>Traducción</div>
            {transOutput && (
              <button
                style={{ ...s.btn("ghost"), padding: "4px 10px", fontSize: 11 }}
                onClick={() => copyText(transOutput)}
              >
                <Icon d={copied ? icons.check : icons.copy} size={12} />
                {copied ? "Copiado" : "Copiar"}
              </button>
            )}
          </div>
          {loading.translate ? (
            <div
              style={{
                ...s.resultBox,
                minHeight: 220,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid #6366f1",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Traduciendo…</span>
            </div>
          ) : (
            <div style={{ ...s.resultBox, minHeight: 220, whiteSpace: "pre-wrap" }}>
              {transOutput || (
                <span style={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
                  La traducción aparecerá aquí…
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button
          style={s.btn("orange")}
          onClick={translate}
          disabled={loading.translate || !transInput.trim()}
        >
          <Icon d={icons.globe} size={15} stroke="#fff" />
          {loading.translate ? "Traduciendo…" : `Traducir a ${transLangTo}`}
        </button>
        {transInput && (
          <button
            style={s.btn("ghost")}
            onClick={() => {
              setTransInput("");
              setTransOutput("");
            }}
          >
            <Icon d={icons.trash} size={14} /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
