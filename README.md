Előkészítés:

Lokális fejlesztőkörnyezet telepítése
- https://angular.io/guide/setup-local
- Node 16 Active LTS
ng new clean-architecture-0614
? Would you like to add Angular routing? No
? Which stylesheet format would you like to use? CSS
cd clean-architecture-0614
ng serve --open

Postman letöltése: https://www.postman.com/downloads/

------------------------------------------------------
Story:

- HTML-t és az általa hívott függvényeket a UX csapat meghatározta, így kell működnie, ahogy most látjuk.
- A Nominatim API használatát (backend) a CTO meghatározta, így kell hívni, ahogy most látjuk.
- A CIB bankra a Nominatim API nem tud Szlovákiában keresni, ezért az előző fejlesztő hozzáadott egy if CIB és if Bratislava kivételt, hogy ilyenkor a VUB bankra keressünk.

Amire a jövőben számítani lehet, hogy változni fog:

- A UX csapat bármikor meggondolhatja magát, és akkor másképp kell majd a kinézetet alakítani, az API-tól kapott mezőket lehet, hogy másképp kell majd publikálni a HTML-ben. Amit mindenképp meg akarnak tartani, az a terminál és a felette lévő kikeresett banki branchet mutató UI widget mint különálló UI komponensek. Ezekre akár egymástól függetlenül is jöhetnek változtatási kérések. Ezért kérték, hogy mindenképp két model legyen hozzájuk, ezt az előző fejlesztő létre is hozta.
- Új országra, városra nem kell számítani, viszont új bankok jöhetnek a rendszerbe. Őket ugyanúgy fogjuk keresni, ahogy most az OTP-t és a CIB-et, azaz a kisbetűs magyar banknévvel és a kisbetűs városnévvel.
- Elképzelhető, hogy a Nominatim API adataiban változás lesz, és a bank nevét az amenity mezőben másképp fogja visszaadni, tehát több variáció is lehet még az OTP-re és CIB-re is, mint ami most le van kódolva.

0. Feladat - Funkcionális teszt lefedettség
- A viewModel architektúrának köszönhetően elég az app viewModelljeinek állapotát vizsgálni, de jelenleg csak 1 search van lefedve teszttel.
- A további 5 search-öt is érdemes lefedni integrációs teszttel, ezzel biztosítható lesz, hogy a refaktoroknál nem fognak eltörni.

1. Feladat: Single Responsibility Principle
- Kik az aktorok, akiktől jöhetnek a változtatási kérések? CTO és UX Team.
- Ezek szerint érdemes szétválasztani a prezentációs és az adatlekérési logikát. (Presenter, DataFetcher)

2. Feladat: Open-Closed Principle
- Mi van, ha új bankot kell hozzáadni a rendszerhez? Jelenleg bele kellene nyúlni a Bank osztályba.
- Örökléssel oldjuk meg, hogy bank hozzáadásra nyitott legyen a rendszer. Javasolt a Bank osztályból OTP és CIB osztályokat származtatni, amik tudják kezelni azt, hogy az adott banknál milyen bank logót, országlogót és banknevet írjunk ki.
- Szintén vezessünk be öröklést a Bank fetchelésre (BankFetcher), amiből a CIB-es kivételkezelést (CIBFetcher osztály) leszármaztatjuk.
- A DataFetcher is osztályt próbáljuk egy általános abtract osztályt készíteni, ha esetleg más query-t kell használni később, nem csak a bank, city jellegűt, akkor ebből is tudjunk más Fetcher osztályokat származtatni.
- A jövőben bármilyen új bank jön, akkor tudjuk a BankFetcher osztályunkat használni, vagy pedig a CIBFetcher-hez hasonló kivételkezelést készíteni.

3. Feladat: Liskov Substitution Principle
- Sajnos a CIB esetén van egy architekturális LSV sértésünk, mert a Nominatim API mindenképp másképp működik a CIB kereséssel Szlovákiára, ha meg akarjuk keresni a helyi CIB-et, akkor VUB keresőszóval kell keressünk. Itt vagy a UX csapatnak kellene a Nominatim kereséshez alkalmazkodnia és külön bankként kezelni a VUB-ot, vagy a Nominatim API-nak kellene megtalálnia a VUB-ot is a CIB keresőszóval. Egyelőre ettől az ellentmondástól nem tudunk megszabadulni, de legalább külön osztályba szerveztük ezt a kivételt, hogy az Open-Closed Principle szerint az alap működésünket ne zavarja. 

