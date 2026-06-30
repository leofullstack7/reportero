import { icons } from "../constants/icons";

export function Icon({ d, size = 20, stroke = "currentColor", fill = "none" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export function IconByName({ name, ...props }) {
  return <Icon d={icons[name]} {...props} />;
}
