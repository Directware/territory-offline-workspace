#Territory Offline Features

### Cross-Cutting

#### Daten
###### Speicherung

###### Sicherheit
Die Anwendung ist durch ein am Anfang vom Benutzer festgelegtes Passwort gesperrt. Mit diesem werden sämtliche Daten zur Laufzeit asymmetrisch verschlüsselt.
Die Verschlüsselung ist Platform abhängig. Auf mobilen Geräten wird die native Variante der SQLite DB verwendet. Auf Desktop/Mac werden die Daten
manuel verschlüsselt.

#### Layout
Der Benutzer kann mithilfe einer Drei-Spalten-Ansicht in der App navigieren. Sie besteht aus der Hauptnavigationsleiste, Grobübersicht und Detailansicht.
In der Hauptnavigationsleiste befinden sich folgende Navigationselemente:
- Versammlung
- Dashboard
- Gebiete
- Verkündiger
- Tags
- Nicht-Besuchen Adressen
- Daten-Transfer
- Einstellungen
- Full-Screen toggle

Je nach größe des Bildschirms wird die Detailansicht die Grobansicht überdecken.

### Versammlungen

###### Allgemein
Es können mehrere Versammlungen angelegt werden. Eine Versammlung setzt einen Geltungsbereich für sämtliche Daten, die man in die Anwendung eingibt.
Diese Daten sind voneinander logisch getrennt und können anhand der Versammlung komplett entfernt werden. Eine Versammlung besteht aus einer Bezeichnung und Sprache.

###### Grobansicht
Die Grobansicht der Versammlung zeigt eine Liste von Kacheln, auf denen jeweils der Name und eine Anzahl von diesen Infos zu sehen sind: 
- Gebiete
- Wohnungseinheiten
- Verkündiger 
- Nicht-Besuchen 
- Adressen

Durch einen grünen Haken neben dem Versammlungsnamen auf der Kachel sieht man, welche Versammlung gerade aktiv ist (verwaltet wird). 
Im Header dieser Ansicht befindet sich ein Suchfeld, mit dem man die Liste der Versammlung filtern kann und ein Button 
zum Anlegen einer neuen Versammlung.

###### Detailansicht
In der Detailansicht der Versammlung können der Name der Versammlung und ihre Sprache (readonly) eingesehen werden. Diese Sprache wirkt sich jedoch nicht 
auf das User Interface aus (Dies kann in den Einstellungen entsprechend gesetzt werden). Außerdem hat man hier die Möglichkeit die aktuell verwaltete
Versammlung zu wechseln, ggf. zu duplizieren oder zu löschen. Auch die letzten Aktionen, die der Benutzer innerhalb der Versammlung durchgeführt hat, 
werden in Form einer Liste angezeigt (es werden fünf letzte Aktionen angezeigt).

Im header der Detailansicht kann man entweder zurück zu Grobansicht wechseln oder den aktuell ausgewählten Datensatz zu bearbeiten.

### Gebiete

#### Zeichnungen
#### Zuteilungen
#### Drucken

### Verkündiger
### Nicht Besuchen Adressen
### Tags
### Export
### Import
