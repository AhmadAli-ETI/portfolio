# Personal Portfolio & Tech Project Viewer

Dies ist deine personalisierte, minimalistische Portfolio-Webseite. Sie wurde speziell dafür entwickelt, deine technischen Kompetenzen in den Bereichen **Leiterplatten-Design (PCB)**, **Embedded Systems** und **Netzwerktechnik** in den Vordergrund zu stellen.

Die Webseite enthält auch einen integrierten **Code & Dokumentations-Explorer**, der echten Code live aus deinen Projektordnern im Browser anzeigen kann.

---

## 📁 Ordnerstruktur

- `index.html` - Die Hauptstruktur deines Portfolios (HTML5).
- `style.css` - Dein Design-System (Responsive, Dark & Light Mode, moderne Schriftarten & Micro-Interaktionen).
- `data.js` - Enthält all deine strukturierten Lebenslauf- und Projektdaten zum einfachen Bearbeiten.
- `app.js` - Steuert die Webseiten-Logik, Tab-Wechsel, Modal-Popups und das dynamische Laden von Code.
- `server/` - Kopiere hier deinen **Server-Code** hinein (z. B. `server.js`, `server.py`).
- `client/` - Kopiere hier deinen **Client-Code** hinein (z. B. `app.js`, `index.html`).
- `documentation/` - Kopiere hier deine **Dokumentationen** hinein (z. B. PDFs, Markdown `.md` Dokumente).

---

## 💻 Lokale Ausführung & Testen

Da der **Code Explorer** clientseitig echte Dateien über AJAX/Fetch anfordert, blockiert die Sicherheitsrichtlinie von Browsern (CORS) dies bei direktem Doppelklick auf `index.html` (über das `file://`-Protokoll). 

Um die Seite vollständig lokal zu testen, starte einen einfachen Webserver in diesem Ordner:

### Option A: Mit Python (Standardmäßig installiert)
Öffne das Terminal (cmd / PowerShell) in diesem Ordner und führe aus:
```bash
python -m http.server 8000
```
Öffne danach [http://localhost:8000](http://localhost:8000) im Browser.

### Option B: Mit Node.js (falls installiert)
```bash
npx http-server -p 8000
```
Öffne danach [http://localhost:8000](http://localhost:8000) im Browser.

---

## 🚀 Projekt auf GitHub hochladen & kostenlos hosten (GitHub Pages)

Folge diesen Schritten, um deine Portfolio-Webseite auf GitHub zu veröffentlichen und kostenlos für jedermann unter `https://dein-username.github.io/portfolio-ahmad` erreichbar zu machen:

### 1. Repository auf GitHub erstellen
1. Melde dich bei [github.com](https://github.com/) an.
2. Klicke auf **New** (Neues Repository erstellen).
3. Gib dem Repository den Namen `portfolio-ahmad`.
4. Belasse es bei **Public** und erstelle das Repository, **ohne** README, .gitignore oder Lizenz hinzuzufügen.

### 2. Lokales Git initialisieren und Code hochladen
Öffne ein Terminal in diesem Ordner (`C:\Users\kojoa\.gemini\antigravity\scratch\portfolio-ahmad`) und führe folgende Befehle aus:

```bash
# 1. Git initialisieren
git init

# 2. Alle Projektdateien hinzufügen (deine Server/Client-Ordner werden mitgesichert!)
git add .

# 3. Den ersten Commit erstellen
git commit -m "Initial commit - Portfolio und Dactylus Projektstruktur"

# 4. Den Standardbranch auf 'main' setzen
git branch -M main

# 5. Dein lokales Repo mit GitHub verknüpfen (Ersetze DEIN_USERNAME mit deinem GitHub-Nutzernamen!)
git remote add origin https://github.com/DEIN_USERNAME/portfolio-ahmad.git

# 6. Den Code auf GitHub hochladen
git push -u origin main
```

### 3. GitHub Pages aktivieren
1. Gehe in deinem GitHub-Repository auf den Reiter **Settings** (Einstellungen).
2. Klicke in der linken Navigationsleiste unter der Rubrik *Code and automation* auf **Pages**.
3. Wähle im Abschnitt *Build and deployment* unter *Source* die Option **Deploy from a branch**.
4. Wähle unter *Branch* den Branch **main** und als Ordner `/ (root)`.
5. Klicke auf **Save** (Speichern).
6. Nach ca. 1-2 Minuten wird deine Webseite unter der angezeigten URL (z.B. `https://DEIN_USERNAME.github.io/portfolio-ahmad/`) live geschaltet!
