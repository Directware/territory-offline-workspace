# Allgemein
Die Verschlüsselung ist Plattformabhängig.

 Platform | Password | NACL Encryption | DB encryption | Device Auth code | Biometric Auth
--- | --- | --- | --- |--- |---
WEB | ✅ | ✅ | ❌ | ❌ | ❌
Electron | ❌ | ❌ | ❌ | ❌ | ❌
iOS + Bio-Auth | ❌ | ❌ | ✅ | ❌ | ✅
iOS | ❌ | ❌ | ✅ | ✅ | ❌
Android + Bio-Auth | ❌ | ❌ | ✅ | ❌ | ✅
Android | ❌ | ❌ | ✅ | ✅ | ❌


## Web

Hier wird diese lib verwendet https://www.npmjs.com/package/tweetnacl.

###### Der Schlüsselbund
Initial wird ein Schlüsselbund erstellt (siehe initial-configuration.component.ts / crypto.service.ts).

In den App-Einstellungen werden folgende properties gespeichert:
- passwordHash (String - eingabe des Benutzers)
- encryptedSecretKey (String - generierter sec-key wird symmetrisch mit dem Password des Benutzers verschlüsselt)
- publicKey (Uint8Array)

###### Encryption
Jedes Mal, wenn ein Benutzer neue Datensätze hinzufügt, werden diese verschlüsselt und in der indexedDB gespeichert.

###### Decryption
Daten werden beim Start bzw. entsperren der App komplett aus der DB geladen und entschlüsselt.

## Mobile

TODO

Use cases beschreiben
- z.B. Backup exportieren, Verkündiger anlegen, Gebiet zuweisen, etc

Wie sieht die Architektur aus?
- Es reicht ein Bild auf Papier 

Welche Daten werden verarbeitet?
- Feingranular

