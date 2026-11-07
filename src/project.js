import "./style.css";
import { projects } from "./projects.js";

const slug = new URLSearchParams(location.search).get("p");
const project = projects[slug];
const $ = (id) => document.getElementById(id);
const SVG_NS = "http://www.w3.org/2000/svg";

const renderUml = (container, diagram) => {
  if (!container || !diagram) return;
  const svg = document.createElementNS(SVG_NS, "svg");
  const titleId = `uml-title-${slug}`;
  const descId = `uml-desc-${slug}`;
  const title = document.createElementNS(SVG_NS, "title");
  title.id = titleId;
  title.textContent = diagram.title || `${project.name} component diagram`;
  const desc = document.createElementNS(SVG_NS, "desc");
  desc.id = descId;
  desc.textContent = `UML component diagram. Components: ${diagram.nodes.map((node) => node.title).join(", ")}. Relationships: ${diagram.edges.map((edge) => edge.label).join(", ")}.`;
  svg.append(title, desc);
  svg.setAttribute("viewBox", `0 0 ${diagram.width} ${diagram.height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-labelledby", `${titleId} ${descId}`);

  const defs = document.createElementNS(SVG_NS, "defs");
  const marker = document.createElementNS(SVG_NS, "marker");
  marker.id = `uml-arrow-${slug}`;
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "9");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "7");
  marker.setAttribute("markerHeight", "7");
  marker.setAttribute("orient", "auto-start-reverse");
  const arrow = document.createElementNS(SVG_NS, "path");
  arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
  arrow.setAttribute("fill", "#111");
  marker.appendChild(arrow);
  defs.appendChild(marker);
  svg.appendChild(defs);

  const byId = new Map(diagram.nodes.map((node) => [node.id, node]));
  diagram.edges.forEach((edge) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) return;
    const points = edge.points || (() => {
      const fx = from.x + from.w / 2;
      const fy = from.y + from.h / 2;
      const tx = to.x + to.w / 2;
      const ty = to.y + to.h / 2;
      if (Math.abs(tx - fx) >= Math.abs(ty - fy)) {
        const sx = tx >= fx ? from.x + from.w : from.x;
        const ex = tx >= fx ? to.x : to.x + to.w;
        return [[sx, fy], [ex, ty]];
      }
      const sy = ty >= fy ? from.y + from.h : from.y;
      const ey = ty >= fy ? to.y : to.y + to.h;
      return [[fx, sy], [tx, ey]];
    })();
    const path = document.createElementNS(SVG_NS, "polyline");
    path.setAttribute("class", "uml-edge");
    path.setAttribute("points", points.map((point) => point.join(",")).join(" "));
    path.setAttribute("marker-end", `url(#uml-arrow-${slug})`);
    svg.appendChild(path);
    if (edge.label) {
      const segment = Math.max(0, Math.floor((points.length - 1) / 2));
      const a = points[segment];
      const b = points[segment + 1];
      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("class", "uml-edge-label");
      label.setAttribute("x", edge.labelX ?? ((a[0] + b[0]) / 2));
      label.setAttribute("y", edge.labelY ?? ((a[1] + b[1]) / 2 - 7));
      label.setAttribute("text-anchor", "middle");
      label.textContent = edge.label;
      svg.appendChild(label);
    }
  });

  diagram.nodes.forEach((node) => {
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", `uml-node${node.kind === "actor" ? " is-actor" : ""}`);
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", node.x);
    rect.setAttribute("y", node.y);
    rect.setAttribute("width", node.w);
    rect.setAttribute("height", node.h);
    group.appendChild(rect);
    const stereotype = document.createElementNS(SVG_NS, "text");
    stereotype.setAttribute("class", "uml-stereotype");
    stereotype.setAttribute("x", node.x + 12);
    stereotype.setAttribute("y", node.y + 20);
    stereotype.textContent = node.kind === "actor" ? "«actor»" : "«component»";
    group.appendChild(stereotype);
    const heading = document.createElementNS(SVG_NS, "text");
    heading.setAttribute("class", "uml-title");
    heading.setAttribute("x", node.x + 12);
    heading.setAttribute("y", node.y + 43);
    heading.textContent = node.title;
    group.appendChild(heading);
    (node.body || []).forEach((line, index) => {
      const body = document.createElementNS(SVG_NS, "text");
      body.setAttribute("class", "uml-body");
      body.setAttribute("x", node.x + 12);
      body.setAttribute("y", node.y + 63 + index * 16);
      body.textContent = line;
      group.appendChild(body);
    });
    svg.appendChild(group);
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
