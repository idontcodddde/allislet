import { useAllislet } from "./context/AllisletContext";

export function App() {
  const { pageExec, eventBus } = useAllislet();

  return (
    <div style={{ color: "#fff" }}>
      <h2>My Bookmarklet App</h2>
      <p>This code runs inside the Allislet window frame</p>
      <button
        onClick={() => pageExec.runInMainWorld("alert('Executing in target page!')")}
        style={{
          padding: "8px 16px",
          backgroundColor: "#5865f2",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Run Test Script
      </button>
    </div>
  );
}