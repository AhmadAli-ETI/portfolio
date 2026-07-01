# Dactylus – Schnellstart-Anleitung

## Voraussetzungen

| Was | Wo installieren |
|---|---|
| Arduino IDE | [arduino.cc](https://www.arduino.cc/en/software) |
| Node.js (v18+) | [nodejs.org](https://nodejs.org) |
| ESP32-Board-Package | Arduino IDE → Boardverwalter → „esp32" |

---

## Schritt 1 – Arduino-Sketch hochladen

> [!IMPORTANT]
> Dies muss **zuerst** gemacht werden, bevor Server oder Client gestartet werden.

1. Arduino IDE öffnen und die Datei `Dactylus.ino` laden.
2. **WLAN-Zugangsdaten** prüfen (Zeile 8–9 in `Dactylus.ino`):
   ```cpp
   const char *ssid     = "MeinWLAN";
   const char *password = "MeinPasswort";
   ```
3. **Server-IP prüfen** (Zeile 12) – muss der PC sein, auf dem der Server läuft:
   ```cpp
   const char *serverIP = "192.168.x.x";
   ```
4. ESP32 per USB anschließen.
5. In der Arduino IDE: **Board** → `ESP32 Dev Module` auswählen, richtigen **COM-Port** wählen.
6. Auf **Hochladen** (→) klicken und warten bis „Hochladen abgeschlossen" erscheint.
7. Seriellen Monitor öffnen (115200 Baud) – der ESP32 zeigt seine IP-Adresse und „UDP bereit." an.

---

## Schritt 2 – Server installieren & starten

Ein **neues Terminal** öffnen und folgendes eingeben:

```powershell
cd "Pfad\zum\Projekt\DactylusServer\server"
npm install
npm start
```

> [!NOTE]
> `npm install` nur beim **ersten Mal** nötig – danach reicht `npm start`.

✅ Der Server läuft, wenn folgendes erscheint:
```
Server läuft auf Port 3000
UDP hört auf Port 41234
```

---

## Schritt 3 – Client (Weboberfläche) installieren & starten

Ein **weiteres Terminal** öffnen und folgendes eingeben:

```powershell
cd "Pfad\zum\Projekt\DactylusServer\client"
npm install
npm run dev
```

> [!NOTE]
> `npm install` nur beim **ersten Mal** nötig – danach reicht `npm run dev`.

✅ Der Client ist bereit, wenn folgendes erscheint:
```
VITE v5.x.x  ready in ...ms
➜  Local:   http://localhost:5173/
```

Dann im Browser **`http://localhost:5173`** öffnen.

---

## Startreihenfolge auf einen Blick

```
1. Arduino-Sketch hochladen  →  ESP32 neu starten
2. npm install + npm start      (im Ordner /server)   ← nur beim 1. Mal
3. npm install + npm run dev    (im Ordner /client)   ← nur beim 1. Mal
4. Browser: http://localhost:5173
```

> [!NOTE]
> Server und Client müssen **gleichzeitig laufen**, damit die Live-Daten vom ESP32 in der Weboberfläche sichtbar sind.

> [!WARNING]
> Falls keine Daten ankommen: Sicherstellen dass PC und ESP32 **im selben WLAN** sind und die `serverIP` im Sketch mit der IP des PCs übereinstimmt.
