import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;
