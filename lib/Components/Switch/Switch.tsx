import "./Switch.css";

export default function Switch({
  checked,
  updater,
}: {
  checked: boolean;
  updater: (value: boolean) => void;
}) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => updater(e.target.checked)}
      />
      <span className="slider active round"></span>
    </label>
  );
}
