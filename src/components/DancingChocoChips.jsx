import { useEffect } from "react";
import chocoChips from "./dancing_chocochips.js";

export default function DancingChocoChips() {
  useEffect(() => {
    // DOMが確実に存在してから実行
    setTimeout(() => {
      const container = document.getElementById("choco-bg");
      if (!container) return;
      chocoChips();
    }, 0);
  }, []);
  return <div id="choco-bg"></div>;
}