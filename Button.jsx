export default function Button({
  children,
  type = "button",
  className = "",
  onClick,
}) {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}