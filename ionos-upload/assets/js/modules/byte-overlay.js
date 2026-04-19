const WORDS = [
  "ATHO",
  "FALCON512",
  "SHA3-384",
  "UTXO",
  "SEGWIT",
  "LMDB",
  "NODE",
  "SYNC",
  "CONSENSUS",
  "VERIFY",
  "KEY",
  "WITNESS",
  "HASH",
  "PRIVATE",
  "PAYMENT",
  "X-ADDR",
  "TX"
];

function randomBinary(bits = 16) {
  let out = "";
  for (let i = 0; i < bits; i += 1) {
    out += Math.random() > 0.5 ? "1" : "0";
  }
  return out;
}

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function buildLines(lineCount = 44) {
  const lines = [];
  for (let i = 0; i < lineCount; i += 1) {
    const chunks = [];
    const chunkCount = 5 + (i % 5);
    for (let j = 0; j < chunkCount; j += 1) {
      if (j % 3 === 2) {
        chunks.push(randomWord());
      } else {
        chunks.push(randomBinary(12 + ((i + j) % 8)));
      }
    }
    lines.push(chunks.join("  "));
  }
  return lines.join("\n");
}

export function initByteOverlay(options = {}) {
  const { liteEffects = false } = options;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (document.querySelector(".byte-overlay-layer")) return;

  const layer = document.createElement("div");
  layer.className = "byte-overlay-layer";

  const pre = document.createElement("pre");
  pre.className = "byte-overlay-text";
  pre.setAttribute("aria-hidden", "true");
  const preAlt = document.createElement("pre");
  preAlt.className = "byte-overlay-text byte-overlay-text-alt";
  preAlt.setAttribute("aria-hidden", "true");

  const refresh = () => {
    if (liteEffects) {
      pre.textContent = buildLines(28);
      preAlt.textContent = buildLines(22);
      return;
    }

    pre.textContent = buildLines(42);
    preAlt.textContent = buildLines(34);
  };

  refresh();

  layer.appendChild(pre);
  layer.appendChild(preAlt);
  document.body.prepend(layer);
}
