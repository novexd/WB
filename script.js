const canvas = document.getElementById('wave');
const context = canvas.getContext('2d');
const chars = ' .:-=+*#%@';
const colors = ['#000000', '#222222', '#000000', '#444444'];
const cellWidth = 9;
const cellHeight = 17;
let width = 0;
let height = 0;
let columns = 0;
let rows = 0;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  columns = Math.ceil(width / cellWidth);
  rows = Math.ceil(height / cellHeight);
}

function lerp(first, second, amount) { return first + (second - first) * amount; }
function lerpColor(first, second, amount) {
  const a = first.slice(1);
  const b = second.slice(1);
  const channels = [0, 2, 4].map((index) => lerp(parseInt(a.slice(index, index + 2), 16), parseInt(b.slice(index, index + 2), 16), amount));
  return `rgb(${channels.map(Math.round).join(',')})`;
}
function paletteColor(value) {
  const normalized = ((value % 1) + 1) % 1;
  const scaled = normalized * (colors.length - 1);
  const index = Math.min(Math.floor(scaled), colors.length - 2);
  return lerpColor(colors[index], colors[index + 1], scaled - index);
}
function waveValue(x, y, time) {
  return Math.sin(x * .055 + time * 1.1) * .55 + Math.sin(y * .09 - time * .8 + x * .018) * .3 + Math.sin(Math.sqrt(x * x + y * y) * .025 - time * .65) * .35 + Math.sin(x * .025 + y * .04 + time * 1.5) * .15;
}
function draw(timestamp) {
  const time = timestamp * .001;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.font = '14px "DM Mono", monospace';
  context.textBaseline = 'top';
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      let value = Math.min(Math.abs(waveValue(x, y, time)) * 1.7, 1);
      if (value < .1) continue;
      const character = chars[Math.min(chars.length - 1, Math.floor(value * chars.length))];
      if (character === ' ') continue;
      context.fillStyle = paletteColor(value * .65 + time * .025);
      context.fillText(character, x * cellWidth, y * cellHeight);
    }
  }
  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(draw);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const prowlCanvas = document.getElementById('prowl-wave');
const prowlContext = prowlCanvas.getContext('2d');
function resizeProwlWave() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const section = prowlCanvas.parentElement;
  prowlCanvas.width = section.clientWidth * dpr;
  prowlCanvas.height = section.clientHeight * dpr;
  prowlContext.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawProwlWave(timestamp) {
  const section = prowlCanvas.parentElement;
  const time = timestamp * 0.00008;
  const drift = (time % 2) * section.clientWidth;
  prowlContext.fillStyle = '#E5CC99';
  prowlContext.fillRect(0, 0, section.clientWidth, section.clientHeight);
  prowlContext.font = '14px "DM Mono", monospace';
  prowlContext.fillStyle = '#4C463A';
  for (let y = section.clientHeight; y > -20; y -= 17) {
    for (let x = 0; x < section.clientWidth; x += 9) {
      const value = Math.abs(Math.sin((x - drift) * .03 + y * .015)) * .9;
      if (value > .42) prowlContext.fillText(chars[Math.min(chars.length - 1, Math.floor(value * chars.length))], x, y);
    }
  }
}
window.addEventListener('resize', resizeProwlWave);
resizeProwlWave();
drawProwlWave(0);
setInterval(() => drawProwlWave(performance.now()), 100);

document.querySelector('.back-to-top').addEventListener('click', (event) => {
  event.preventDefault();
  document.scrollingElement.scrollTop = 0;
});

/* Ember wave for the Ignis section. Same math as the main wave, ember glyphs on near-black. */
(function ignisWave() {
  const canvas = document.getElementById('ignis-wave');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const chars = ' .:-=+*#%@';
  const colors = ['#ff6b35', '#a33d1c', '#ff6b35', '#5c2312'];
  const cellWidth = 9, cellHeight = 17;
  let width = 0, height = 0, columns = 0, rows = 0, last = 0;
  function resize() {
    const section = canvas.parentElement;
    width = section.clientWidth; height = section.clientHeight;
    canvas.width = width; canvas.height = height;
    columns = Math.ceil(width / cellWidth); rows = Math.ceil(height / cellHeight);
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpColor(a, b, t) {
    const pa = a.slice(1), pb = b.slice(1);
    const ch = [0, 2, 4].map(i => lerp(parseInt(pa.slice(i, i + 2), 16), parseInt(pb.slice(i, i + 2), 16), t));
    return 'rgb(' + ch.map(Math.round).join(',') + ')';
  }
  function paletteColor(v) {
    const n = ((v % 1) + 1) % 1, s = n * (colors.length - 1);
    const i = Math.min(Math.floor(s), colors.length - 2);
    return lerpColor(colors[i], colors[i + 1], s - i);
  }
  function waveValue(x, y, t) {
    return Math.sin(x * .055 + t * 1.1) * .55 + Math.sin(y * .09 - t * .8 + x * .018) * .3
      + Math.sin(Math.sqrt(x * x + y * y) * .025 - t * .65) * .35
      + Math.sin(x * .025 + y * .04 + t * 1.5) * .15;
  }
  function draw(ts) {
    if (ts - last < 66) { requestAnimationFrame(draw); return; }
    last = ts;
    const t = ts * .00035;
    context.fillStyle = '#06060e'; context.fillRect(0, 0, width, height);
    context.font = '14px "DM Mono", monospace'; context.textBaseline = 'top';
    for (let y = 0; y < rows; y += 1) for (let x = 0; x < columns; x += 1) {
      const v = Math.min(Math.abs(waveValue(x, y, t)) * 1.7, 1);
      if (v < .1) continue;
      const c = chars[Math.min(chars.length - 1, Math.floor(v * chars.length))];
      if (c === ' ') continue;
      context.fillStyle = paletteColor(v * .65 + t * .025);
      context.fillText(c, x * cellWidth, y * cellHeight);
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize(); requestAnimationFrame(draw);
})();
