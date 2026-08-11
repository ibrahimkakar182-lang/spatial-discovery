import * as THREE from "three";

const PAPER = "#F7F5EF";
const INK = "#1b2624";
const TEAL = "#006666";
const CHAMP = "#B99555";
const TERRA = "#C9684E";

function base(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = PAPER;
  x.fillRect(0, 0, w, h);
  // paper grain
  const grain = x.createLinearGradient(0, 0, w, h);
  grain.addColorStop(0, "rgba(199,193,180,0.18)");
  grain.addColorStop(0.5, "rgba(255,255,255,0)");
  grain.addColorStop(1, "rgba(199,193,180,0.22)");
  x.fillStyle = grain;
  x.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) {
    x.fillStyle = `rgba(29,63,62,${Math.random() * 0.035})`;
    x.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
  }
  return { c, x };
}

function lines(
  x: CanvasRenderingContext2D,
  left: number,
  top: number,
  width: number,
  count: number,
  gap = 26,
  color = "rgba(27,38,36,0.62)",
  h = 6,
) {
  for (let i = 0; i < count; i++) {
    const w = width * (0.72 + Math.random() * 0.28);
    x.fillStyle = color;
    x.fillRect(left, top + i * gap, w, h);
  }
  return top + count * gap;
}

function serif(x: CanvasRenderingContext2D, size: number, weight = 400) {
  x.font = `${weight} ${size}px Fraunces, Georgia, serif`;
}
function sans(x: CanvasRenderingContext2D, size: number, weight = 500) {
  x.font = `${weight} ${size}px Archivo, Helvetica, sans-serif`;
}

function finish(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function readingPageTexture(variant = 0) {
  const w = 1024;
  const h = 1448;
  const { c, x } = base(w, h);
  const pad = 92;

  sans(x, 22, 600);
  x.fillStyle = TEAL;
  x.fillText("READING  ·  PASSAGE 0" + (variant + 1), pad, pad + 10);
  x.fillStyle = "rgba(27,38,36,0.35)";
  x.fillText("ACADEMIC  ·  700 WORDS", w - pad - 300, pad + 10);

  x.fillStyle = "rgba(29,63,62,0.35)";
  x.fillRect(pad, pad + 34, w - pad * 2, 1);

  serif(x, 78, 500);
  x.fillStyle = INK;
  const titles = [
    ["The Cartography", "of Shallow Seas"],
    ["Glass, Kiln", "and Memory"],
    ["Migration and", "the Coastal Line"],
  ];
  const t = titles[variant % titles.length]!;
  x.fillText(t[0]!, pad, pad + 160);
  x.fillText(t[1]!, pad, pad + 244);

  let y = pad + 320;
  y = lines(x, pad, y, (w - pad * 2) * 0.92, 7);
  y += 26;

  // embedded photographic plate (drawn, not stock)
  const ih = 300;
  const g = x.createLinearGradient(pad, y, w - pad, y + ih);
  g.addColorStop(0, "#1D3F3E");
  g.addColorStop(0.45, "#006666");
  g.addColorStop(1, "#C7C1B4");
  x.fillStyle = g;
  x.fillRect(pad, y, w - pad * 2, ih);
  x.globalAlpha = 0.5;
  for (let i = 0; i < 46; i++) {
    x.strokeStyle = "rgba(247,245,239,0.35)";
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(pad, y + ih - i * 7 - Math.random() * 6);
    x.bezierCurveTo(
      pad + 260,
      y + ih - i * 9,
      w - pad - 240,
      y + ih - i * 5,
      w - pad,
      y + ih - i * 8,
    );
    x.stroke();
  }
  x.globalAlpha = 1;
  y += ih + 26;
  sans(x, 20, 500);
  x.fillStyle = "rgba(27,38,36,0.5)";
  x.fillText("FIG. 1  Bathymetric survey, revised edition", pad, y);
  y += 46;

  y = lines(x, pad, y, (w - pad * 2) * 0.92, 6);
  y += 30;

  // marked sentence
  x.fillStyle = "rgba(185,149,85,0.28)";
  x.fillRect(pad - 8, y - 20, (w - pad * 2) * 0.86, 34);
  x.fillStyle = INK;
  x.fillRect(pad, y - 6, (w - pad * 2) * 0.8, 7);
  y += 52;
  y = lines(x, pad, y, (w - pad * 2) * 0.92, 5);

  // question block
  y += 44;
  x.strokeStyle = "rgba(0,102,102,0.45)";
  x.lineWidth = 2;
  x.strokeRect(pad, y, w - pad * 2, 210);
  sans(x, 22, 600);
  x.fillStyle = TEAL;
  x.fillText("QUESTION 4  ·  INFERENCE", pad + 28, y + 46);
  serif(x, 34, 400);
  x.fillStyle = INK;
  x.fillText("What can be inferred about the", pad + 28, y + 104);
  x.fillText("author's view of early surveys?", pad + 28, y + 150);

  return finish(c);
}

export function writingPageTexture(kind: "essay" | "outline" | "revision" | "feedback" | "evidence") {
  const w = 900;
  const h = 1240;
  const { c, x } = base(w, h);
  const pad = 78;
  sans(x, 20, 600);
  x.fillStyle = TEAL;
  x.fillText(kind.toUpperCase(), pad, pad);
  x.fillStyle = "rgba(29,63,62,0.3)";
  x.fillRect(pad, pad + 18, w - pad * 2, 1);

  if (kind === "essay") {
    serif(x, 56, 500);
    x.fillStyle = INK;
    x.fillText("Independent Task", pad, pad + 110);
    let y = pad + 170;
    for (let b = 0; b < 4; b++) y = lines(x, pad, y, w - pad * 2, 5) + 34;
  } else if (kind === "outline") {
    let y = pad + 90;
    const rows = ["CLAIM", "REASON", "EVIDENCE", "EXPLANATION"];
    rows.forEach((r, i) => {
      sans(x, 26, 600);
      x.fillStyle = i % 2 ? CHAMP : TEAL;
      x.fillText(r, pad + i * 26, y);
      x.fillStyle = "rgba(27,38,36,0.5)";
      x.fillRect(pad + i * 26, y + 20, (w - pad * 2) * (0.8 - i * 0.1), 5);
      x.strokeStyle = "rgba(27,38,36,0.3)";
      x.beginPath();
      x.moveTo(pad + i * 26 + 6, y + 34);
      x.lineTo(pad + (i + 1) * 26 - 6, y + 96);
      x.stroke();
      y += 130;
    });
  } else if (kind === "revision") {
    let y = pad + 90;
    for (let i = 0; i < 16; i++) {
      const strike = i % 5 === 2;
      x.fillStyle = strike ? "rgba(201,104,78,0.45)" : "rgba(27,38,36,0.6)";
      const lw = (w - pad * 2) * (0.6 + Math.random() * 0.4);
      x.fillRect(pad, y, lw, 6);
      if (strike) {
        x.strokeStyle = TERRA;
        x.lineWidth = 2;
        x.beginPath();
        x.moveTo(pad, y + 3);
        x.lineTo(pad + lw, y + 3);
        x.stroke();
        x.fillStyle = TEAL;
        x.fillRect(pad + 20, y + 16, lw * 0.7, 6);
        y += 24;
      }
      y += 40;
    }
  } else if (kind === "feedback") {
    let y = pad + 100;
    const notes = ["COHESION", "DEVELOPMENT", "RANGE", "ACCURACY"];
    notes.forEach((n) => {
      sans(x, 24, 600);
      x.fillStyle = INK;
      x.fillText(n, pad, y);
      x.fillStyle = "rgba(0,102,102,0.85)";
      x.fillRect(pad, y + 18, (w - pad * 2) * (0.35 + Math.random() * 0.6), 10);
      x.fillStyle = "rgba(27,38,36,0.4)";
      y = lines(x, pad, y + 52, w - pad * 2, 3, 24) + 40;
    });
  } else {
    let y = pad + 100;
    for (let i = 0; i < 5; i++) {
      x.fillStyle = "rgba(199,193,180,0.55)";
      x.fillRect(pad, y, w - pad * 2, 120);
      x.fillStyle = TEAL;
      x.fillRect(pad, y, 6, 120);
      x.fillStyle = "rgba(27,38,36,0.55)";
      lines(x, pad + 28, y + 34, w - pad * 2 - 70, 2, 26);
      y += 150;
    }
  }
  return finish(c);
}

export function transcriptTexture() {
  const w = 1024;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = "rgba(0,0,0,0)";
  x.clearRect(0, 0, w, h);
  sans(x, 30, 600);
  x.fillStyle = "#F7F5EF";
  x.fillText("LECTURE 04  ·  GEOLOGY", 40, 60);
  serif(x, 46, 400);
  const rows = [
    "…and that is precisely why the",
    "second survey contradicts the first.",
  ];
  rows.forEach((r, i) => x.fillText(r!, 40, 150 + i * 62));
  sans(x, 26, 500);
  x.fillStyle = CHAMP;
  x.fillText("CONTRAST  ·  0:42", 40, 300);
  x.strokeStyle = "rgba(247,245,239,0.35)";
  x.strokeRect(20, 20, w - 40, h - 60);
  return finish(c);
}
