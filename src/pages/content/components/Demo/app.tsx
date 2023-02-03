import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded -3");
  }, []);

  return (
    <div className="content-view fixed top-64 left-32 hidden bg-green-500">
      content view 37
    </div>
  );
}
