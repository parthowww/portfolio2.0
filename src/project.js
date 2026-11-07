import "./style.css";
import { projects } from "./projects.js";

const slug = new URLSearchParams(location.search).get("p");
const project = projects[slug];
const $ = (id) => document.getElementById(id);
const SVG_NS = "http://www.w3.org/2000/svg";

const renderUml = (container, diagram) => {
  if (!container || !diagram?.participants || !diagram?.messages) return;
  const width = 1200, top = 132, row = 52, height = top + diagram.messages.length * row + 36;
  const centers = new Map(diagram.participants.map((p, i) => [p.id, 100 + i * (1000 / Math.max(1, diagram.participants.length - 1))]));
  const svg = document.createElementNS(SVG_NS, "svg");
  const titleId = `uml-title-${slug}`, descId = `uml-desc-${slug}`;
  const make = (tag, attrs = {}, content = null) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    if (content !== null) el.textContent = content;
    return el;
  };
  svg.append(make("title", { id: titleId }, `${project.name} sequence diagram`),
    make("desc", { id: descId }, `Interactions between ${diagram.participants.map((p) => p.name).join(", ")}.`));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-labelledby", `${titleId} ${descId}`);
  const defs = make("defs");
  for (const [kind, d, fill] of [["call", "M 0 0 L 10 5 L 0 10 z", "#111"], ["return", "M 1 1 L 9 5 L 1 9", "none"]]) {
    const marker = make("marker", { id: `uml-${kind}-${slug}`, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto" });
    marker.append(make("path", { d, fill, stroke: "#111", "stroke-width": 1.5 }));
    defs.append(marker);
  }
  svg.append(defs);
  const add = (tag, attrs, content) => svg.append(make(tag, attrs, content));
  if (diagram.fragment) {
    const f = diagram.fragment, y = top + f.from * row - 20, h = (f.to - f.from + 1) * row + 26;
    add("rect", { x: 18, y, width: width - 36, height: h, class: "uml-fragment" });
    add("rect", { x: 18, y, width: 230, height: 25, class: "uml-fragment-label-bg" });
    add("text", { x: 28, y: y + 17, class: "uml-fragment-label" }, `loop [${f.label}]`);
  }
  diagram.participants.forEach((p) => {
    const x = centers.get(p.id);
    add("line", { x1: x, y1: 108, x2: x, y2: height - 18, class: "uml-lifeline" });
    if (p.type === "actor") {
      add("circle", { cx: x, cy: 39, r: 9, class: "uml-actor" });
      add("line", { x1: x, y1: 48, x2: x, y2: 71, class: "uml-actor" });
      add("line", { x1: x - 13, y1: 56, x2: x + 13, y2: 56, class: "uml-actor" });
      add("line", { x1: x, y1: 71, x2: x - 11, y2: 84, class: "uml-actor" });
      add("line", { x1: x, y1: 71, x2: x + 11, y2: 84, class: "uml-actor" });
      add("text", { x, y: 103, class: "uml-participant-name", "text-anchor": "middle" }, p.name);
    } else {
      add("rect", { x: x - 84, y: 18, width: 168, height: 78, rx: 2, class: "uml-participant" });
      add("text", { x, y: 43, class: "uml-participant-role", "text-anchor": "middle" }, p.role || "component");
      add("text", { x, y: 69, class: "uml-participant-name", "text-anchor": "middle" }, p.name);
    }
  });
  diagram.messages.forEach((m, i) => {
    const y = top + i * row, x1 = centers.get(m.from), x2 = centers.get(m.to);
    if (x1 == null || x2 == null) return;
    const isReturn = m.type === "return";
    add("line", { x1: x1 + (x2 > x1 ? 3 : -3), y1: y, x2: x2 - (x2 > x1 ? 3 : -3), y2: y,
      class: isReturn ? "uml-return" : "uml-call", "marker-end": `url(#uml-${isReturn ? "return" : "call"}-${slug})` });
    const label = `${i + 1}. ${m.label}${m.guard ? ` [${m.guard}]` : ""}`;
    const labelWidth = Math.min(440, Math.max(92, label.length * 7.2 + 16)), mid = (x1 + x2) / 2;
    add("rect", { x: mid - labelWidth / 2, y: y - 17, width: labelWidth, height: 19, class: "uml-message-label-bg" });
    add("text", { x: mid, y: y - 4, class: "uml-message-label", "text-anchor": "middle" }, label);
  });
  container.replaceChildren(svg);
};

if (!project) {
  document.title = "Project not found | Parthasarathi Adhikary";
  $("p-name").textContent = "Not found";
  $("p-summary").textContent = "That project does not exist. Go back to the list and pick one.";
  $("p-business-wrap").hidden = true;
  $("p-uml-wrap").hidden = true;
  $("p-stack-wrap").hidden = true;
  $("p-shots-wrap").hidden = true;
  $("p-repo").hidden = true;
  $("p-next").hidden = true;
} else {
  document.title = `${project.name} | Parthasarathi Adhikary`;
  $("p-name").textContent = project.name;
  $("p-name").style.viewTransitionName = `p-${slug}`;
  $("p-summary").textContent = project.summary;
  $("p-customer").textContent = project.customer;
  $("p-opportunity").textContent = project.opportunity;
  renderUml($("p-uml"), project.uml);
  $("p-repo").href = project.repo;
  const keys = Object.keys(projects);
  const nextSlug = keys[(keys.indexOf(slug) + 1) % keys.length];
  $("p-next").href = `/project.html?p=${nextSlug}`;
  $("p-next").textContent = `Next: ${projects[nextSlug].name}`;

  const list = $("p-stack");
  for (const [label, value] of project.stack) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    row.append(dt, dd);
    list.appendChild(row);
  }

  if (!project.shots.length) {
    $("p-shots-wrap").hidden = true;
  } else {
    const box = $("lightbox");
    const big = $("lightbox-img");
    for (const shot of project.shots) {
      const fig = document.createElement("figure");
      fig.className = "shot-fig";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shot";
      btn.setAttribute("aria-label", `Enlarge: ${shot.alt}`);
      const img = document.createElement("img");
      img.src = shot.src;
      img.alt = shot.alt;
      img.width = shot.width;
      img.height = shot.height;
      img.loading = "lazy";
      btn.appendChild(img);
      btn.addEventListener("click", () => {
        big.src = shot.src;
        big.alt = shot.alt;
        box.showModal();
      });
      const cap = document.createElement("figcaption");
      cap.textContent = shot.caption;
      fig.append(btn, cap);
      $("p-shots").appendChild(fig);
    }
    box.addEventListener("click", (e) => {
      if (e.target === box || e.target === big) box.close();
    });
    $("lightbox-close").addEventListener("click", () => box.close());
  }
}
