const portfolioData = {
  profile: {
    name: "Ahmad Ali",
    title: "Elektronik & Technische Informatik",
    location: "Kottingbrunn, Österreich",
    email: "AhmadAlibusiness@icloud.com",
    phone: "+43 651 10474771",
    github: "github.com/AhmadAli", // Placeholder - to be updated by user
    linkedin: "#",
    about: "Leidenschaftlicher Entwickler im Bereich der Elektronik und technischen Informatik. Mein Fokus liegt auf Embedded Systems, Leiterplattendesign (PCB) und Netzwerktechnik. Ich liebe es, Hardware und Software nahtlos miteinander zu verbinden, um präzise Messgeräte und optimierte Netzwerke zu schaffen.",
    avatar: "profile.jpg" // Can be filled with a profile image path
  },
  education: [
    {
      period: "2026 – 2028",
      degree: "Bachelorstudium an der FH",
      field: "Elektronik und Technische Informatik",
      description: "Vertiefung in Systemdesign, Mikrocontroller-Architekturen, Signalverarbeitung und fortgeschrittene Softwareentwicklung."
    },
    {
      period: "2024 – 2026",
      degree: "Aufbaulehrgang an der HTL WIEN 10",
      field: "Elektronik und Technische Informatik",
      description: "Fokus auf angewandte Elektrotechnik, Schaltungsentwicklung und technische Informatik-Projekte."
    },
    {
      period: "2019 – 2024",
      degree: "Fachschule an der HTL WIEN 10",
      field: "Elektronik und Technische Informatik",
      description: "Praktische Ausbildung in Elektronikwerkstätten, Platinenfertigung, Grundlagen der Informatik und Netzwerktechnik."
    },
    {
      period: "2015 – 2019",
      degree: "NMS Sechshauserstraße",
      field: "Schwerpunkt: Informatik",
      description: "Frühe Einführung in informationstechnische Grundlagen, Algorithmen und Medienkompetenz."
    }
  ],
  projects: [
    {
      id: "dactylus",
      title: "Diplomarbeit: Dactylus",
      subtitle: "Hochpräzises 10-Fingerkraftmessgerät für Reha-Zwecke",
      category: "Embedded & Hardware",
      status: "Abgeschlossen",
      description: "Entwicklung und Programmierung eines hochpräzisen Messsystems zur gleichzeitigen Erfassung der Kraft aller 10 Finger beider Hände für Rehabilitationszwecke. Über FSR-Sensoren am ESP32-Mikrocontroller erfasste Daten werden per UDP an eine Node.js-Server-Bridge und per WebSockets an ein React-Frontend übertragen, wo sie visualisiert und lokal in einer IndexedDB (Dexie) gespeichert werden.",
      tags: ["C++", "ESP32", "UDP / WebSocket", "Node.js", "React", "Dexie DB", "Sensorik", "Rehabilitation"],
      details: {
        problem: "In der Rehabilitation nach Schlaganfällen oder Handverletzungen fehlt es an präzisen, erschwinglichen Geräten zur kontinuierlichen Messung des Therapiefortschritts der einzelnen Finger beider Hände.",
        solution: "Dactylus bietet eine hochfrequente, simultane Erfassung aller 10 Fingerkraftkanäle. Über eine UDP-Verbindung sendet der ESP32 Daten an eine Node.js-Bridge, die sie per WebSockets an einen React-Client weiterleitet. Der Client bietet eine grafische Live-Visualisierung und einen integrierten Reaktionstest.",
        hardware: [
          "10 präzise FSR-Drucksensoren (Force Sensitive Resistor)",
          "ESP32 Dev Module (Mikrocontroller) für analoge Wandlung (ADC) und WiFi-Übertragung",
          "Maßgeschneidertes, im 3D-Druck gefertigtes Gehäusedesign für ergonomische Handhaltung"
        ],
        software: [
          "ESP32 Firmware in Embedded C++ (WiFiUDP-Datenübertragung)",
          "Node.js Backend (Express & Socket.io) als UDP-zu-WebSocket-Bridge (Port 3001 & 41234)",
          "React-Frontend (Vite, Recharts für Live-Charts, Dexie DB für lokale Patientenberichte)"
        ],
        codeSnippet: `// UDP Server & Socket.io Bridge (aus server/index.js)
const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
    try {
        const data = JSON.parse(msg.toString());
        if (data && data.values) {
            latestData = data;
            io.emit('data', latestData); // Echtzeit-Broadcast an React-App
        }
    } catch (e) {}
});

udpServer.bind(41234, () => {
    console.log('UDP aktiv auf Port 41234');
});`
      }
    },
    {
      id: "netzwerk",
      title: "Netzwerkinstallation & Switch-Konfiguration",
      subtitle: "Planung, Optimierung & Fehlerdiagnose von Infrastrukturen",
      category: "Netzwerktechnik",
      status: "Praxisprojekt",
      description: "Planung und professionelle Installation von Netzwerkswitches, VLAN-Segmentierung, Behebung von Durchsatzproblemen und Optimierung der gesamten lokalen Netzwerkinfrastruktur.",
      tags: ["Cisco", "Switching", "VLAN", "Fehlerdiagnose", "Infrastruktur", "Netzwerksicherheit"],
      details: {
        problem: "Instabile Netzwerkverbindungen und mangelnde Segmentierung in Testumgebungen führten zu Sicherheitsrisiken und Paketverlusten.",
        solution: "Strukturierte Neuverkabelung, Einführung von Managed Switches mit VLAN-Konfiguration zur logischen Trennung von Entwicklungs- und Produktivnetzwerken.",
        hardware: [
          "Managed Netzwerk-Switches (z. B. Cisco Catalyst / HP ProCurve)",
          "Patchpanels und strukturierte Cat.6a/7 Verkabelung"
        ],
        software: [
          "Cisco IOS zur Konfiguration von Spanning Tree (STP), VLANs und Trunking",
          "Wireshark zur Analyse des Netzwerkverkehrs und Fehlersuche"
        ],
        codeSnippet: `! Cisco IOS Switch Configuration
interface GigabitEthernet0/1
 description Trunk to Router
 switchport trunk encapsulation dot1q
 switchport mode trunk
!
interface GigabitEthernet0/2
 description Access Port for Client Network (VLAN 10)
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast`
      }
    },
    {
      id: "leiterplatten",
      title: "Leiterplattenfertigung (PCB Design)",
      subtitle: "Entwurf, Lötung und Qualitätsprüfung",
      category: "Elektronik",
      status: "Hardwareentwicklung",
      description: "Professionelles Design von Leiterplatten mithilfe von CAD-Software (Eagle). Löten von THT- und SMD-Bauteilen sowie anschließende Prüfung mittels Oszilloskop und Multimeter.",
      tags: ["Eagle CAD", "PCB Design", "SMD Lötung", "Hardware-Debugging", "Messtechnik"],
      details: {
        problem: "Manuelle fliegende Verdrahtungen in Prototypen führten zu Signalrauschen und Wackelkontakten bei hochfrequenten Signalen.",
        solution: "Erstellung eines professionellen 2-Layer PCB-Layouts in Eagle CAD mit optimierten Masseflächen zur Rauschunterdrückung.",
        hardware: [
          "SMD- und THT-Bauteile (Widerstände, Kondensatoren, ICs)",
          "Eagle CAD Software zur Schaltplan- und Layout-Erstellung",
          "Lötstation und Heißluft-Reworkstation",
          "Digitales Oszilloskop zur Signalverifizierung"
        ],
        software: [
          "Eagle CAD (Schaltplan-Editor & Layout-Editor)",
          "Gerber-Datei-Exporte für die industrielle Fertigung"
        ],
        codeSnippet: `[PCB Design Rules - Eagle CAD]
- Minimum Trace Width: 8 mil (0.203 mm)
- Minimum Clearance: 8 mil (0.203 mm)
- Power Lines (5V/GND): 24 mil (0.609 mm) for low resistance
- Solid Ground Plane on Bottom Layer for EM Shielding`
      }
    }
  ],
  skills: {
    programming: [
      { name: "C++ (Embedded)", level: 80 },
      { name: "Arduino / ESP32 SDK", level: 85 },
      { name: "HTML / CSS / JavaScript", level: 60 }
    ],
    hardware: [
      { name: "Eagle CAD (PCB Design)", level: 90 },
      { name: "SMD/THT Löten & Rework", level: 85 },
      { name: "Oszilloskop & Signal-Messtechnik", level: 80 }
    ],
    infrastructure: [
      { name: "Cisco IOS Switch-Konfiguration", level: 75 },
      { name: "Netzwerk-Diagnose (Wireshark)", level: 75 },
      { name: "Netzwerk-Planung & Verkabelung", level: 80 }
    ],
    general: [
      { name: "Microsoft Office (Word, Excel, PPT)", level: 90 },
      { name: "LibreOffice", level: 85 },
      { name: "123d Design (3D CAD)", level: 70 }
    ]
  },
  languages: [
    { name: "Kurdisch", level: "Muttersprache" },
    { name: "Deutsch", level: "Fließend" },
    { name: "Arabisch", level: "Fließend" },
    { name: "Englisch", level: "Sehr gut" }
  ],
  interests: [
    { name: "Schach", icon: "♟️" },
    { name: "Krafttraining", icon: "🏋️‍♂️" },
    { name: "Musik hören", icon: "🎧" },
    { name: "Bowling", icon: "🎳" },
    { name: "Physik", icon: "⚛️" }
  ]
};
