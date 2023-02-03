import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded ");
  }, []);

  return (
    <div className="fixed left-5 bottom-10 rounded-md bg-gradient-to-br from-green-500 via-green-400 to-green-300 p-4 text-2xl">
      content
    </div>
  );
}
