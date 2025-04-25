# Micro:bit Bluetooth Web App

Mit dieser Webanwendung kannst du dich über Bluetooth mit einem BBC micro:bit verbinden, Nachrichten senden und empfangene Daten anzeigen lassen.

## Features
- Verbindung mit micro:bit über Web Bluetooth API
- Buttons zum Senden von Nachrichten (A, B, C)
- Anzeige empfangener Nachrichten
- Moderne, responsive Oberfläche

## Nutzung
1. Öffne die `index.html` Datei in einem Chromium-basierten Browser (z.B. Chrome, Edge).
2. Klicke auf "Mit Micro:bit verbinden" und wähle deinen micro:bit aus.
3. Sende Nachrichten mit den Buttons oder empfange Daten, die vom micro:bit gesendet werden.

> **Hinweis:** Die Web Bluetooth API funktioniert nur über HTTPS oder `localhost`.

## micro:bit Firmware
Auf deinem micro:bit muss ein Programm laufen, das die UART Bluetooth Service UUIDs nutzt und Nachrichten sendet/empfängt. Beispiele findest du in der micro:bit-Dokumentation (z.B. MakeCode oder MicroPython).

## Kontakt
Fragen oder Feature-Wünsche? Melde dich gerne!
