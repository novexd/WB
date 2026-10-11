/* whitebots.online — ember wave for the Ignis section. Paste at the END
   of script.js. Same math as the main wave, ember glyphs on near-black. */
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
