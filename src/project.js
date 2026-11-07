import "./style.css";
import { projects } from "./projects.js";

const slug = new URLSearchParams(location.search).get("p");
const project = projects[slug];
const $ = (id) => document.getElementById(id);

if (!project) {
  document.title = "Project not found | Parthasarathi Adhikary";
  $("p-name").textContent = "Not found";
  $("p-summary").textContent = "That project does not exist. Go back to the list and pick one.";
  $("p-business-wrap").hidden = true;
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
