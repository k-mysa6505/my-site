import gsap from "gsap";

export default function chocoChips() {
  const NUM_CHIPS = 65;
  const container = document.getElementById("choco-bg");
  for (let i = 0; i < NUM_CHIPS; i++) {
    const chip = document.createElement("img");
    chip.src = "/images/chocochip1.svg";
    chip.className = "absolute";
    chip.style.left = `${Math.random() * 100}vw`;
    chip.style.top = 0;
    chip.style.width = `${20 + Math.random() * 24}px`;
    chip.style.opacity = `${0.7 + Math.random() * 0.3}`;
    chip.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(chip);

    gsap.to(chip, {
      y: `+=650px`,
      x: `-=650px`,
      rotation: `+=${Math.random() * 360}`,
      duration: 8 + Math.random() * 4,
      repeat: -1,
      delay: Math.random() * 10,
      ease: "linear",
      onRepeat: () => {
        chip.style.left = `${Math.random() * 100}vw`;
        chip.style.top = `0`;
      }
    });
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", chocoChips);
}
