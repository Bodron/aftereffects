# COSMIN MOTION

Panou CEP pentru Adobe After Effects, cu preseturi de animație pentru text și layere, instrumente de aranjare a textului și template-uri sociale editabile.

## Instalare

1. Descarcă repository-ul și copiază folderul proiectului în directorul de extensii CEP al utilizatorului (`%APPDATA%\Adobe\CEP\extensions\` pe Windows).
2. Repornește After Effects și deschide **Window > Extensions > COSMIN MOTION**.

Extensia este furnizată ca sursă CEP, fără pachet semnat. Pentru dezvoltare locală, After Effects trebuie configurat să permită extensii CEP nesemnate.

## Utilizare

Deschide o compoziție, selectează layerele, poziționează playhead-ul, alege un preset și apasă **Apply animation**. Categoriile **Layout** și **Templates** oferă instrumente pentru text și elemente sociale. Operațiile din After Effects pot fi anulate cu Undo.

`index.html` poate fi deschis în browser pentru a vedea interfața; aplicarea efectelor necesită After Effects.

## Structură

- `CSXS/manifest.xml` — configurarea extensiei CEP
- `index.html`, `css/`, `js/` — interfața panoului
- `jsx/` — scripturile ExtendScript care modifică proiectul After Effects
