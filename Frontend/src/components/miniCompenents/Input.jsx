export default function Input({ type = "text", placeholder, className = "", name, ...props }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required
      className={`input ${className}`}
      {...props} 
    />
  );
}
