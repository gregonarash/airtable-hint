import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded -3");
  }, []);

  return (
    <div className="content-view fixed bottom-10 left-10 bg-blue-200 p-5 text-2xl">
      content view 38
    </div>
  );
}
