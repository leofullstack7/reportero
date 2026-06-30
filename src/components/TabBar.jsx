import { TABS } from "../constants/tabs";
import { icons } from "../constants/icons";
import { Icon } from "./Icon";
import { styles as s } from "../styles/styles";

export function TabBar({ tab, setTab }) {
  return (
    <div style={s.tabBar}>
      {TABS.map((t) => (
        <button key={t.id} style={s.tab(tab === t.id)} onClick={() => setTab(t.id)}>
          <Icon d={icons[t.icon]} size={15} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
