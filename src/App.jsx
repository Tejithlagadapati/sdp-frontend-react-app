import AppRoutes from "./routes/AppRoutes";
import ThemeToggle from "./components/common/ThemeToggle";

const App = () => {
  return (
    <>
      <ThemeToggle />
      <AppRoutes />
    </>
  );
};

export default App;
