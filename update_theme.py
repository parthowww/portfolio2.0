import glob
import re

old_theme = """/* Dark Mode (Default: Pure Obsidian Noir & Crisp Hairlines) */
html[data-theme="dark"] {
  --bg-main: #09090B;
  --bg-surface: #121215;
  --bg-surface-elevated: #18181C;
  --bg-card: rgba(18, 18, 21, 0.78);
  --bg-card-hover: #1C1C22;
  --border-color: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.18);
  --text-main: #F4F4F5;
  --text-muted: #A1A1AA;
  --text-dim: #71717A;
  --nav-bg: rgba(9, 9, 11, 0.88);
  --badge-bg: rgba(255, 255, 255, 0.05);
  --badge-text: #E4E4E7;
  --icon-bg: rgba(255, 255, 255, 0.04);
  --icon-border: rgba(255, 255, 255, 0.1);
  --active-nav: #FFFFFF;
  --active-nav-bg: rgba(255, 255, 255, 0.08);
  --btn-primary-bg: #F4F4F5;
  --btn-primary-text: #09090B;
  --btn-primary-hover: #E4E4E7;
  --wireframe-color: 0x52525b;
  --wireframe-highlight: 0xa1a1aa;
  --toast-bg: #18181B;
  --toast-border: rgba(255, 255, 255, 0.15);
}"""

new_theme = """/* Dark Mode (Soft Midnight Slate - Easy on the eyes) */
html[data-theme="dark"] {
  --bg-main: #13151A;
  --bg-surface: #1B1E26;
  --bg-surface-elevated: #212530;
  --bg-card: rgba(27, 30, 38, 0.78);
  --bg-card-hover: #212530;
  --border-color: rgba(255, 255, 255, 0.12);
  --border-strong: rgba(255, 255, 255, 0.22);
  --text-main: #F4F4F5;
  --text-muted: #A1A1AA;
  --text-dim: #71717A;
  --nav-bg: rgba(19, 21, 26, 0.88);
  --badge-bg: rgba(255, 255, 255, 0.08);
  --badge-text: #E4E4E7;
  --icon-bg: rgba(255, 255, 255, 0.06);
  --icon-border: rgba(255, 255, 255, 0.15);
  --active-nav: #FFFFFF;
  --active-nav-bg: rgba(255, 255, 255, 0.1);
  --btn-primary-bg: #E4E4E7;
  --btn-primary-text: #13151A;
  --btn-primary-hover: #FFFFFF;
  --wireframe-color: 0x52525b;
  --wireframe-highlight: 0xa1a1aa;
  --toast-bg: #1B1E26;
  --toast-border: rgba(255, 255, 255, 0.18);
}"""

files = glob.glob("*.html")
for f in files:
    with open(f, "r") as file:
        content = file.read()
    if old_theme in content:
        content = content.replace(old_theme, new_theme)
        with open(f, "w") as file:
            file.write(content)
        print(f"Updated {f}")
    else:
        print(f"Could not find exact block in {f}")

