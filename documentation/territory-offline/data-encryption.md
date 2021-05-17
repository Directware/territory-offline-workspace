# Allgemein

Wie sieht die Architektur aus? (extrahieren)
- Es reicht ein Bild auf Papier

### Welche Daten werden verarbeitet?
Jedes, der nachfolgenden Datensätzen außer den Einstellungen besitzt zusätzlich noch folgende Eigenschaften:
- id → jede Entität besitzt eine eindeutige UUID.
- prefix → hier handelt es sich um einen Typ der jeweiligen Entität. 
- congregationId → Referenz auf eine Versammlung-Entität.
- creationTime → Datum (mit Zeitangabe) wann dieser Datensatz erstellt wurde.
- lastUpdated → Datum (mit Zeitangabe) wann zuletzt dieser Datensatz verändert wurde.
  
###### Existierende Entitäten:

- Versammlung
  - name → Bezeichnung für die Versammlung.
  - languageCode → Kurzform der Sprache.
  - language → Sprache ausgeschrieben.
  - hashedName → Bezeichnung der Versammlung in base64.

- Gebiet
  - name → Label des Gebiets.
  - key → Eine eindeutige, alphanumerische Bezeichnung.
  - populationCount → Die Anzahl der Wohnungseinheiten.
  - tags → Liste von zugewiesenen tags.
  - territoryDrawingId → Referenz auf Gebietszeichnung.
  - boundaryNames → Liste von Straßen und deren Nummern, die das Gebiet ausmachen.
  - deactivated → Flag um ein Gebiet als deaktiviert zu markieren.
  - comment → Im Kommentar ist es möglich beliebigen Text zu schreiben.
  
- Gebietszeichnung
  - featureCollection → Geologische Daten und deren Eigenschaften (GeoJSON).
  - printConfiguration → Druck-Einstellungen pro Gebietskarte (Gebiete müssen je nach Form individuell ausgerichtet werden).
    - bearing (Zahl) 
    - zoom (Zahl) 
    - pitch (Zahl) 
    - center (Zahl) 
    - bounds (Zahl) 
  
- Verkündiger
  - name → Nachname vom Verkündiger.
  - firstName → Vorname vom Verkündiger.
  - email → Email-Adresse des Verkündigers.
  - phone → Telefonnummer des Verkündigers.
  - tags → Liste von zugewiesenen tags.
  - dsgvoSignature → Unterschrift des Verkündigers für die Zustimmung der DSGVO.
  - isDeactivated → Flag um Verkündiger zu deaktivieren.
  
- Zuteilung
  - publisherId → Referenz auf einen Verkündiger (UUID).
  - territoryId → Referenz auf ein Gebiet (UUID).
  - startTime → Datum (mit Zeitangabe) wann das Gebiet dem Verkündiger zugewiesen wurde.
  - endTime → Datum (mit Zeitangabe) wann der Verkündiger das Gebiet bearbeitet bzw. abgegeben hat.
  - statusColor → Eine Farbliche untermalung, die dem Benutzer zeigen sollen, ob ein Gebiet für eine Bearbeitung infrage kommt oder z.B. schon überfällig ist.
  - removedPublisherLabel → Name und Vorname des Verkündigers, der das Gebiet eins hatte, aber mittlerweile gelöscht wurde (string).
  
- Tag
  - name → Bezeichnung des Schlagwortes.
  - color → Farbliche untermalung.
  - symbol → Icon, das neben der Bezeichnung angezeigt wird.
  - metaInfos → eine Key-Value Map (Es wird de facto nicht verwendet).
  
- Nicht-Besuchen Adresse
  - name → Text, der auf der Klingel des Wohnungsinhabers steht.
  - street → Straße in der derjenige Wohnt.
  - streetSuffix → Hausnummer
  - territoryId → Referenz auf das Gebiet in dem der Wohnungsinhaber wohnt.
  - tags → Liste von zugewiesenen tags.
  - city → Name der Stadt.
  - floor → Etage in der, der Wohnungsinhaber wohnt.
  - lastVisit → Datum (mit Zeitangabe) wann zuletzt diese Adresse besucht worden ist.
  - comment → freies Textfeld mit der Möglichkeit diese Adresse zu kommentieren.
  - gpsPosition → die GPS Position der Adresse auf einer Landkarte.
  
- Aktionen
  - action → Vordefinierte Bezeichnungen in Form einer Enumeration, die eine Aktion des Benutzers darstellen.
  - label → eine für den Benutzer lesbare Beschreibung der ausgeführten Aktion. 
  
- Einstellungen
  - id → 
  - initialConfigurationDone → Gibt an ob das onboarding schon stattgefunden hat.
  - currentCongregationId → eine UUID der Versammlung, die gerade verwaltet wird.
  - territoryOrigin → GPS Position, die der Benutzer im onboarding als Mittelpunkt seines Gebietes festlegt.
  - passwordHash → Hash des von Benutzer im onboarding festgelegten Passwortes.
  - encryptedSecretKey → mit dem Benutzerpasswort symmetrisch verschlüsselter secret key.
  - publicKey → Public Partner des secret keys.
  - isAppLocked → Angabe über den Sperr-Zustand der App.
  - processingPeriodInMonths → Zeitraum (in Monaten), in dem ein Gebiet bearbeitet werden sollte.
  - processingBreakInMonths → Zeitraum (in Monaten), während ein Gebiet nicht zugeteilt werden sollte bzw. brach liegen sollte.
  - overdueBreakInMonths → Zeitraum (in Monaten), nach dem ein Gebiet als überfällig für eine Bearbeitung gilt.
  - autoAppLockingInMinutes → Zeitangabe (in Minuten), nach dem die App bei inaktivität automatisch gesperrt werden sollte.
  - appLanguage → Sprache des User Interfaces.
    - languageCode → Kurzform der Sprache.
    - name → für den Benutzer lesbare Bezeichnung der Sprache. 
    - nativeName → nicht übersetzte Bezeichnung der Sprache (in der Sprache).

### Matrix für die Verschlüsselung. 
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

...
