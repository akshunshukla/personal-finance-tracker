const Button = ({ children, isLoading, variant = "primary", ...props }) => {
  const baseStyles =
    "w-full py-2 px-4 rounded-md font-semibold focus:outline-none transition-colors duration-200 disabled:opacity-50";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
