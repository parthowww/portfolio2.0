import "./style.css";
import { projects } from "./projects.js";

const stage = document.querySelector("[data-stage]");
const ghostSvg = document.getElementById("ghosts");
const trailSvg = document.getElementById("trail");
const nodeSvg = document.getElementById("nodes");
const head = document.getElementById("head");
const tip = document.getElementById("ghost-tip");
const contactEl = document.getElementById("contact");
const headT = document.querySelector("#head .head-t");

if (stage && ghostSvg && trailSvg && nodeSvg && head) {
  const NS = "http://www.w3.org/2000/svg";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const GHOSTS = 24;
  const STEPS = 40;
  const HIT = 16;
  const LINE = 0.7;

  const startEl = stage.querySelector("[data-start]");
  const endEl = stage.querySelector("[data-end]");
  const nodeEls = [...stage.querySelectorAll("[data-node]")];

  let vh = innerHeight;
  let ox = 0;
  let oy = 0;
  let stageW = 0;
  let stageH = 0;
  let main = [];
  let nodes = [];
  let ghosts = [];
  let ghostEls = [];
  let dotEls = [];
  let ready = false;
  let fontsReady = !(document.fonts && document.fonts.ready);
  let hot = -1;

  const seeded = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const gauss = (rand) => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());

  const make = (name, attrs, parent) => {
    const el = document.createElementNS(NS, name);
    for (const key in attrs) el.setAttribute(key, attrs[key]);
    if (parent) parent.appendChild(el);
    return el;
  };

  const docBox = (el) => {
    let x = 0;
    let y = 0;
    for (let e = el; e; e = e.offsetParent) {
      x += e.offsetLeft;
      y += e.offsetTop;
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };

  const sample = (anchors) => {
    const out = [];
    for (let i = 1; i < anchors.length; i++) {
      const a = anchors[i - 1];
      const b = anchors[i];
      const half = (b.y - a.y) / 2;
      for (let s = i === 1 ? 0 : 1; s <= STEPS; s++) {
        const t = s / STEPS;
        const u = 1 - t;
        out.push({
          x: u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x,
          y: u * u * u * a.y + 3 * u * u * t * (a.y + half) + 3 * u * t * t * (b.y - half) + t * t * t * b.y,
        });
      }
    }
    return out;
  };

  const pathD = (anchors) => {
    let d = `M${(anchors[0].x - ox).toFixed(1)},${(anchors[0].y - oy).toFixed(1)}`;
    for (let i = 1; i < anchors.length; i++) {
      const a = anchors[i - 1];
      const b = anchors[i];
      const half = (b.y - a.y) / 2;
      d += ` C${(a.x - ox).toFixed(1)},${(a.y + half - oy).toFixed(1)} ${(b.x - ox).toFixed(1)},${(b.y - half - oy).toFixed(1)} ${(b.x - ox).toFixed(1)},${(b.y - oy).toFixed(1)}`;
    }
    return d;
  };

  const xAt = (y) => {
    let lo = 0;
    let hi = main.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (main[mid].y < y) lo = mid + 1;
      else hi = mid;
    }
    const b = main[lo];
    const a = main[Math.max(0, lo - 1)];
    const f = (y - a.y) / (b.y - a.y || 1);
    return a.x + (b.x - a.x) * Math.min(1, Math.max(0, f));
  };

  const setOpen = (n, on, animate) => {
    n.open = on;
    n.el.classList.toggle("is-open", on);
    if (n.dot) n.dot.classList.toggle("on", on);
    if (on && animate && !reduced) {
      n.el.classList.remove("spin");
      void n.el.offsetWidth;
      n.el.classList.add("spin");
    }
  };

  const updateOpen = (y, animate) => {
    nodes.forEach((n) => {
      const trigger = n.top + n.half;
      const should = n.open ? y >= trigger - 30 : y >= trigger;
      if (should !== n.open) setOpen(n, should, animate);
    });
  };

  const update = () => {
    if (!main.length) return;
    const y = scrollY + vh * LINE;
    const rel = Math.min(stageH, Math.max(0, y - oy));
    trailSvg.style.clipPath = reduced ? "none" : `inset(0 0 ${(stageH - rel).toFixed(1)}px 0)`;

    if (!reduced && y > main[0].y && y < main[main.length - 1].y) {
      const hx = xAt(y);
      head.style.transform = `translate3d(${(hx - scrollX - 11).toFixed(1)}px, ${(vh * LINE - 11).toFixed(1)}px, 0)`;
      const flip = hx - scrollX < innerWidth / 2;
      if (flip !== head.classList.contains("flip")) head.classList.toggle("flip", flip);
      head.style.visibility = "visible";
    } else {
      head.style.visibility = "hidden";
    }
    if (headT && main.length) {
      const span = main[main.length - 1].y - main[0].y || 1;
      const t = Math.min(1, Math.max(0, (y - main[0].y) / span));
      const label = `t = ${t.toFixed(2)}`;
      if (headT.textContent !== label) headT.textContent = label;
    }
    if (contactEl && main.length) contactEl.classList.toggle("reached", y >= main[main.length - 1].y - 40);
    if (ready) updateOpen(y, true);
  };

  const layout = () => {
    vh = innerHeight;
    stage.classList.add("measuring");
    nodeEls.forEach((card) => {
      const inner = card.querySelector(".reveal > div");
      if (inner) card.style.setProperty("--extra", `${inner.scrollHeight}px`);
    });
    void stage.offsetHeight;

    const box = stage.getBoundingClientRect();
    ox = box.left + scrollX;
    oy = box.top + scrollY;
    stageW = box.width;
    stageH = box.height;
    const narrow = stageW < 820;

    const mid = (el) => {
      const b = docBox(el);
      return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    };

    const anchors = [mid(startEl)];
    nodes = nodeEls.map((el, i) => {
      const b = docBox(el);
      const reveal = el.querySelector(".reveal");
      const half = (b.h - (reveal ? reveal.offsetHeight : 0)) / 2;
      const y = b.y + half;
      let x = ox + 26;
      if (!narrow) x = el.dataset.node === "left" ? b.x - 70 : b.x + b.w + 70;
      anchors.push({ x, y });
      return { el, x, y, top: b.y, half, open: nodes[i] ? nodes[i].open : false, dot: null };
    });
    anchors.push(mid(endEl));

    main = sample(anchors);

    for (const svg of [ghostSvg, trailSvg, nodeSvg]) {
      svg.setAttribute("viewBox", `0 0 ${stageW.toFixed(0)} ${stageH.toFixed(0)}`);
      svg.replaceChildren();
    }

    const rand = seeded(7);
    const spread = narrow ? 0.5 : 1;
    ghosts = [];
    ghostEls = [];
    for (let g = 0; g < GHOSTS; g++) {
      const path = [anchors[0]];
      for (let i = 1; i < anchors.length; i++) {
        const x = anchors[i].x + gauss(rand) * (50 + 70 * i) * spread;
        path.push({ x: Math.min(ox + stageW - 8, Math.max(ox + 8, x)), y: anchors[i].y + gauss(rand) * 25 });
      }
      ghosts.push(sample(path));
      ghostEls.push(make("path", { d: pathD(path), class: "ghost" }, ghostSvg));
    }
    hot = -1;

    make("path", { d: pathD(anchors), class: "trail-path" }, trailSvg);
    make("circle", { cx: anchors[0].x - ox, cy: anchors[0].y - oy, r: 9, class: "dot-start" }, nodeSvg);
    nodes.forEach((n) => {
      n.dot = make("circle", { cx: n.x - ox, cy: n.y - oy, r: 16, class: n.open ? "dot on" : "dot" }, nodeSvg);
    });

    if (!ready && fontsReady) {
      const headY = scrollY + vh * LINE;
      nodes.forEach((n) => {
        if (headY - (n.top + n.half) > 400) setOpen(n, true, false);
      });
      ready = true;
    }
    requestAnimationFrame(() => stage.classList.remove("measuring"));
    update();
  };

  const nearest = (pts, px, py) => {
    let best = Infinity;
    for (let i = 0; i < pts.length; i++) {
      const dy = pts[i].y - py;
      if (dy > HIT || dy < -HIT) continue;
      const d = Math.hypot(pts[i].x - px, dy);
      if (d < best) best = d;
    }
    return best;
  };

  const setHot = (next) => {
    if (next === hot) return;
    if (hot >= 0 && ghostEls[hot]) ghostEls[hot].classList.remove("hot");
    hot = next;
    if (hot >= 0 && ghostEls[hot]) ghostEls[hot].classList.add("hot");
  };

  const onPointer = (e) => {
    const px = e.clientX + scrollX;
    const py = e.clientY + scrollY;
    let found = -1;
    let label = "";
    if (nearest(main, px, py) < HIT && (reduced || py <= scrollY + vh * LINE)) {
      label = "This path survived.";
      found = -2;
    } else {
      let best = HIT;
      ghosts.forEach((g, i) => {
        const d = nearest(g, px, py);
        if (d < best) {
          best = d;
          found = i;
          label = `Path ${i + 1} of ${GHOSTS}. Did not survive.`;
        }
      });
    }
    setHot(found);
    if (tip) {
      if (found === -1) tip.hidden = true;
      else {
        tip.textContent = label;
        tip.style.left = `${e.clientX + 14}px`;
        tip.style.top = `${e.clientY + 14}px`;
        tip.hidden = false;
      }
    }
  };

  addEventListener("scroll", update, { passive: true });

  if (finePointer) {
    addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", () => {
      setHot(-1);
      if (tip) tip.hidden = true;
    });
  }

  let layoutQueued = false;
  const scheduleLayout = () => {
    if (layoutQueued) return;
    layoutQueued = true;
    requestAnimationFrame(() => {
      layoutQueued = false;
      layout();
    });
  };

  let lastW = 0;
  let lastH = 0;
  new ResizeObserver(() => {
    const r = stage.getBoundingClientRect();
    if (Math.abs(r.width - lastW) > 1 || Math.abs(r.height - lastH) > 6) {
      lastW = r.width;
      lastH = r.height;
      scheduleLayout();
    }
  }).observe(stage);
  addEventListener("resize", scheduleLayout);
  if (!fontsReady) {
    document.fonts.ready.then(() => {
      fontsReady = true;
      scheduleLayout();
    });
  }
  addEventListener("load", scheduleLayout);

  nodeEls.forEach((card) => {
    const link = card.querySelector(".stretch");
    const h3 = card.querySelector("h3");
    const slug = link ? new URL(link.href).searchParams.get("p") : null;
    const info = slug ? projects[slug] : null;

    if (h3 && slug) h3.style.viewTransitionName = `p-${slug}`;

    if (info && info.brief) {
      const reveal = document.createElement("div");
      reveal.className = "reveal";
      const inner = document.createElement("div");
      const brief = document.createElement("p");
      brief.className = "brief";
      brief.textContent = info.brief;
      const chips = document.createElement("ul");
      chips.className = "chips";
      (info.chips || []).forEach((label) => {
        const li = document.createElement("li");
        li.textContent = label;
        chips.appendChild(li);
      });
      inner.append(brief, chips);
      reveal.appendChild(inner);
      const more = card.querySelector(".more");
      if (more) more.before(reveal);
      else card.appendChild(reveal);
    }

    card.addEventListener("animationend", () => card.classList.remove("spin"));

    if (!finePointer || reduced) return;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-py * 4).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
    });
  });

  layout();

  const revealEls = [...document.querySelectorAll("[data-reveal]")];
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  const copyBtn = document.querySelector("[data-copy]");
  const status = document.getElementById("copy-status");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy);
        copyBtn.textContent = "Copied";
        copyBtn.classList.add("done");
        if (status) status.textContent = "Email address copied";
        setTimeout(() => {
          copyBtn.textContent = "Copy email";
          copyBtn.classList.remove("done");
        }, 1800);
      } catch {
        window.location.href = `mailto:${copyBtn.dataset.copy}`;
      }
    });
  }
}
