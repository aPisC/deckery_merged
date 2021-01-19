# 3. meeting
Adattárolás és absztrakcióhoz szükséges jellemzők a megvalósítandó feladatok tükrében. 

## Objektumok
### Game
- Egy játék alapvető tulajdonságait leíró objektum

### Player
- Egy játékhoz tartozó játékos
- Több a egyhez kapcsoat a Game felé
- Több at egyhez kapcsolat a User felé (beépített user objektum)

### Container
- Kártyákat tároló és nyílvántartó objektum.
- Több típusát különböztethetjük meg ( Húzó-dobó paklik, Stack, Kézben tartott kártyák helye, táblázat kártyák tárolására)
- Adattagok

|Név| Típus | Leírás |
|-|-|-|
| Id | int | tároló azonosítója |
| GameId | int | Játék azonosítója (ha a játéktérhez tartozó) 
| PlayerId | int | Játékos azonosítója (ha játékoshoz tartozó)
| Type | enum | tároló típusa 
| Attributes | JSON | kiegészítő paraméter a tároló típusának megfelelően

### Card
- Kártya objektum
- Tároljuk a játék azonosítót (nyílvántarthatóság miatt)
- Tároljuk a container azonosítót amelyikben tároljuk
- A kártya megjelenését egy skeleton osztályból hivatkozza meg

|Név| Típus | Leírás |
| - | - | - |
| Id | int | Kártya azonosítója |
| GameId | int | játék azonosítója |
| ContainerId | int  | tároló azonosítója |
| CardSkeletonId | int | megjelenés és egyéb tartalmi paraméterek hivatkozása |
| Order | int | tárolóban lévő kártyák sorrendjének tárolása 
| [Attributes] | JSON | egyéb kiegészítő információ a tárolóra vonatkozóan

### Interaction
- A játék során fellépő validálást igénylő műveletek gyűjteménye
- Ötlet: amikor egy validálást / visszajelzést igénylő műveletet szeretnének végrehajtani, akkor létrejön egy bejegyzés az elvégzendő művelet adataival, amit a validálást végző félnek vissza kell igazolnia, a visszajelzéskor pedig végrehajtásra kerül a a tárolt művelet az adatainak megfelelően.
- A művelet végrehajtásához egy program modulra lesz szükség

|Név| Típus | Leírás |
| - | - | - |
| Id | int | kérés azonosítója |
| PlayerId | int | A játékos akinek validálni kell a kérést |
| Action | JSON | A végrehajtandó művelet(ek) leírása |
| Status | enum | a kérés státusza (Pl: folyamatban, elfogadott elutasított, meghiúsult)  
