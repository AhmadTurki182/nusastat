// NusaStat — grafik kanvas yang digambar sendiri (tanpa pustaka).
// Tiga jenis: garis (lineChart), batang (barChart), donat (donutChart).
// Setiap grafik punya tooltip saat kursor menyentuh titik/batang/irisan.

const INK = '#1b2a3a';
const GRID = '#dbe3ea';
const MUTED = '#5d6f80';

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(280, Math.round(rect.width));
  const height = Math.round(canvas.dataset.height || 260);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceCeil(max, min) {
  const span = max - min || 1;
  const rawStep = span / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / magnitude;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return { step: nice * magnitude, span };
}

function yTicks(min, max, count) {
  const { step } = niceCeil(max, min);
  const ticks = [];
  let v = Math.floor(min / step) * step;
  while (v <= max + step * 0.5 && ticks.length < count + 2) {
    ticks.push(v);
    v += step;
    if (ticks.length > 40) break;
  }
  return { ticks, step };
}

function drawAxes(ctx, box, labels, values, formatTick) {
  const nums = values.filter((v) => typeof v === 'number');
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.08;
  min -= pad;
  max += pad;
  if (min > 0 && min / (max - min) < 0.35) min = 0;
  const { ticks } = yTicks(min, max, 5);
  const lo = Math.min(min, ticks[0]);
  const hi = Math.max(max, ticks[ticks.length - 1]);

  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const t of ticks) {
    const y = box.y + box.h - ((t - lo) / (hi - lo)) * box.h;
    ctx.beginPath();
    ctx.moveTo(box.x, y);
    ctx.lineTo(box.x + box.w, y);
    ctx.stroke();
    ctx.fillText(formatTick(t), box.x - 8, y);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  labels.forEach((label, i) => {
    const x = box.x + (box.w * (i + 0.5)) / labels.length;
    ctx.fillText(String(label), x, box.y + box.h + 8);
  });
  return { lo, hi };
}

function attachTooltip(canvas, hitTest, renderTip) {
  let tip = canvas.parentElement.querySelector('.chart-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'chart-tip';
    tip.hidden = true;
    canvas.parentElement.appendChild(tip);
  }
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const hit = hitTest(event.clientX - rect.left, event.clientY - rect.top);
    if (!hit) { tip.hidden = true; return; }
    tip.innerHTML = renderTip(hit);
    tip.hidden = false;
    const x = Math.min(event.clientX - rect.left + 12, rect.width - 150);
    const y = Math.max(event.clientY - rect.top - 10, 8);
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  });
  canvas.addEventListener('mouseleave', () => { tip.hidden = true; });
}

export function lineChart(canvas, opts) {
  const { labels, series, formatTick, formatValue, highlightIndex } = opts;
  const { ctx, width, height } = setupCanvas(canvas);
  const box = { x: 56, y: 14, w: width - 66, h: height - 44 };
  const allValues = series.flatMap((s) => s.data).filter((v) => typeof v === 'number');
  const scale = drawAxes(ctx, box, labels, allValues, formatTick);
  const points = [];

  series.forEach((s, si) => {
    ctx.strokeStyle = s.color;
    ctx.fillStyle = s.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    s.data.forEach((v, i) => {
      if (typeof v !== 'number') { started = false; return; }
      const x = box.x + (box.w * (i + 0.5)) / labels.length;
      const y = box.y + box.h - ((v - scale.lo) / (scale.hi - scale.lo)) * box.h;
      points.push({ x, y, label: labels[i], series: s.label, value: v, index: si });
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    s.data.forEach((v, i) => {
      if (typeof v !== 'number') return;
      const x = box.x + (box.w * (i + 0.5)) / labels.length;
      const y = box.y + box.h - ((v - scale.lo) / (scale.hi - scale.lo)) * box.h;
      ctx.beginPath();
      ctx.arc(x, y, i === highlightIndex ? 6 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = i === highlightIndex ? '#c9a227' : '#ffffff';
      ctx.lineWidth = i === highlightIndex ? 3 : 1.5;
      ctx.stroke();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.5;
    });
  });

  attachTooltip(canvas, (mx, my) => {
    let best = null;
    let bestD = 1e9;
    for (const p of points) {
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < bestD) { bestD = d; best = p; }
    }
    return bestD < 28 ? best : null;
  }, (p) => `<strong>${p.label}</strong><br>${p.series}: ${formatValue(p.value)}`);
}

export function barChart(canvas, opts) {
  const { labels, values, color, formatTick, formatValue, highlightIndex } = opts;
  const { ctx, width, height } = setupCanvas(canvas);
  const box = { x: 56, y: 14, w: width - 66, h: height - 44 };
  const scale = drawAxes(ctx, box, labels, values, formatTick);
  const bars = [];
  const slot = box.w / labels.length;
  const barW = Math.min(46, slot * 0.62);

  values.forEach((v, i) => {
    if (typeof v !== 'number') return;
    const x = box.x + slot * (i + 0.5) - barW / 2;
    const zeroY = box.y + box.h - ((0 - scale.lo) / (scale.hi - scale.lo)) * box.h;
    const y = box.y + box.h - ((v - scale.lo) / (scale.hi - scale.lo)) * box.h;
    const top = Math.min(y, zeroY);
    const h = Math.abs(zeroY - y);
    const isHi = i === highlightIndex;
    ctx.fillStyle = isHi ? '#c9a227' : color;
    const r = 4;
    ctx.beginPath();
    ctx.moveTo(x, top + h);
    ctx.lineTo(x, top + r);
    ctx.arcTo(x, top, x + r, top, r);
    ctx.lineTo(x + barW - r, top);
    ctx.arcTo(x + barW, top, x + barW, top + r, r);
    ctx.lineTo(x + barW, top + h);
    ctx.closePath();
    ctx.fill();
    bars.push({ x, y: top, w: barW, h, label: labels[i], value: v });
    if (v < 0) {
      ctx.fillStyle = INK;
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(formatValue(v), x + barW / 2, top + h + 14);
    }
  });

  attachTooltip(canvas, (mx, my) => {
    for (const b of bars) {
      if (mx >= b.x && mx <= b.x + b.w && my >= b.y - 6 && my <= b.y + b.h + 6) return b;
    }
    return null;
  }, (b) => `<strong>${b.label}</strong><br>${formatValue(b.value)}`);
}

export function donutChart(canvas, opts) {
  const { segments, formatValue } = opts;
  const { ctx, width, height } = setupCanvas(canvas);
  const cx = width / 2;
  const cy = height / 2;
  const outer = Math.min(width, height) / 2 - 16;
  const inner = outer * 0.58;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let angle = -Math.PI / 2;
  const arcs = [];
  for (const s of segments) {
    const sweep = (s.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.arc(cx, cy, inner, angle + sweep, angle, true);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    arcs.push({ start: angle, end: angle + sweep, label: s.label, value: s.value });
    angle += sweep;
  }
  ctx.fillStyle = INK;
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100%', cx, cy - 8);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText('penduduk', cx, cy + 10);

  const legend = canvas.closest('.chart-card').querySelector('.chart-legend');
  if (legend) {
    legend.innerHTML = segments.map((s) =>
      `<span class="legend-item"><i style="background:${s.color}"></i>${s.label} — ${formatValue(s.value)}</span>`).join('');
  }

  attachTooltip(canvas, (mx, my) => {
    const dx = mx - cx;
    const dy = my - cy;
    const r = Math.hypot(dx, dy);
    if (r < inner || r > outer) return null;
    let a = Math.atan2(dy, dx);
    if (a < -Math.PI / 2) a += Math.PI * 2;
    for (const arc of arcs) {
      if (a >= arc.start && a <= arc.end) return arc;
    }
    return null;
  }, (arc) => `<strong>${arc.label}</strong><br>${formatValue(arc.value)}`);
}
