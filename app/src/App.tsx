import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_REQS" }, (res) => {
      console.log(res);
    });
  }, []);
  return <></>;
}

export default App;
