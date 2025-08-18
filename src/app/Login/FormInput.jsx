export default function FormInput({
  type,
  label,
  name,
  error,
  matchError,
  handleChange,
  ref,
}) {
  let errorMessage = error ? `Please input your ${name}!` : "";

  if (name === "confirm-password") {
    errorMessage = matchError
      ? "The passwords didnot match."
      : error
      ? `Please input your password!`
      : "";
  }

  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}:<span className="text-[#ff6365]"> *</span>
      </label>
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-2 mb-1"
        ref={ref}
        type={type}
        id={name}
        name={name}
        placeholder={label}
        onChange={handleChange}
      />
      <div className="text-[#ff6365] h-3 text-sm mb-2">{errorMessage}</div>
    </div>
  );
}
