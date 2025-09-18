import "./NiceCheckbox.css";

export function NiceCheckbox({
  value,
  onClick,
}: {
  value: boolean;

  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      className="nice-checkbox"
      type="checkbox"
      defaultChecked={value}
      onClick={onClick}
      name="status-checkbox"
    />
  );
}
