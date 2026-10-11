---
titre: "L'enveloppe et la thermique"
description: "L'enveloppe d'un bâtiment (toit, murs, plancher bas, menuiseries), les trois voies de perte de chaleur, le passage de λ à R puis à U, les ponts thermiques, l'étanchéité à l'air et le Bbio de la RE2020."
parcours: ba-ba
ordre: 8
niveau: Intermédiaire
verifie_le: 2026-10-11
---

## Objectifs

- Nommer les parois de l'enveloppe et les trois voies par lesquelles un bâtiment perd de la chaleur.
- Passer de λ à R puis à U pour une paroi de plusieurs couches.
- Expliquer ce qu'est un pont thermique et pourquoi l'étanchéité à l'air se mesure.
- Dire ce que mesure le Bbio et situer son seuil moyen.

## Cas concret : Arbola passe à la thermique

*Opération fictive.* La Résidence Arbola compte 12 logements, pour 744 m² de surface de référence, en ossature bois sur quatre niveaux. Le bureau d'études thermique présente trois lignes au maître d'ouvrage : « le mur a un U de 0,19 », « le Bbio passe juste sous le seuil » et « un test d'étanchéité à l'air est prévu avant la livraison ». Le maître d'ouvrage voudrait comprendre. Où ce bâtiment perd-il de la chaleur ? Que veut dire 0,19 ? Et pourquoi tester l'air d'un bâtiment qui n'est pas encore habité ?

## Essentiel

### L'enveloppe : la peau du bâtiment

L'**enveloppe** réunit les parois qui séparent les volumes chauffés de l'extérieur, du sol ou de locaux non chauffés : la toiture (ou le plancher haut), les murs, le plancher bas, les fenêtres et les portes. Le chauffage compense ce qui s'échappe par cette peau. Plus elle retient la chaleur, moins le bâtiment a besoin d'énergie.

### Par où la chaleur s'échappe

Trois voies, à ne pas confondre :

- **À travers les parois.** La chaleur traverse les murs, la toiture, le plancher bas et les vitrages. L'isolant ralentit ce passage.
- **Aux jonctions.** Là où l'isolant s'interrompt (liaison mur-plancher, balcon, appui de fenêtre), la chaleur passe plus facilement : ce sont les **ponts thermiques**.
- **Avec l'air.** Une partie de l'air chaud sort par les défauts de l'enveloppe, et de l'air froid entre : ce sont les fuites parasites. À distinguer de la **ventilation**, qui renouvelle l'air volontairement pour le garder sain.

![Les trois voies de perte de chaleur : à travers les parois, aux jonctions (ponts thermiques) et par l'air.](/schemas/ba-ba/08-trois-voies-de-perte.svg)

### De λ à R, puis à U

![Du λ au U : les couches d'un mur d'Arbola, leurs résistances, la somme et le coefficient U.](/schemas/ba-ba/08-du-lambda-au-u.svg)

Le raisonnement se fait en trois temps :

1. **λ** (lambda) est la conductivité du matériau, en W/(m·K) (chapitre 2 du parcours « Nouvelles méthodes de construction »). Plus elle est faible, mieux il isole.
2. **R** est la résistance d'une couche : R = épaisseur (en mètres) ÷ λ. Elle s'exprime en m²·K/W.
3. **U** est le coefficient de transmission thermique de toute la paroi, en W/(m²·K). Il dit combien de chaleur traverse un mètre carré de paroi pour un degré d'écart entre les deux faces. Plus U est faible, mieux la paroi isole.

Pour passer de R à U, on additionne les R de toutes les couches, puis on ajoute les **résistances superficielles** : le mince film d'air qui colle à chaque face de la paroi. On note Rsi celui de l'intérieur et Rse celui de l'extérieur. Pour un mur (flux de chaleur horizontal), Rsi vaut 0,13 et Rse 0,04 m²·K/W. Pour une toiture, 0,10 et 0,04. Pour un plancher bas, 0,17 et 0,04.

**U = 1 ÷ (Rsi + somme des R + Rse)**

### Le calcul pour Arbola

Le mur d'Arbola, de l'intérieur vers l'extérieur : une plaque de plâtre de 1,3 cm (λ = 0,25), 20 cm d'isolant (λ = 0,040, hypothèse) et un panneau OSB de 1,5 cm (λ = 0,13).

- Plâtre : 0,013 ÷ 0,25 = 0,05.
- Isolant : 0,20 ÷ 0,040 = 5,00.
- OSB : 0,015 ÷ 0,13 = 0,12.
- Total : 0,13 + 0,05 + 5,00 + 0,12 + 0,04 = **5,34 m²·K/W**.
- U = 1 ÷ 5,34 ≈ **0,19 W/(m²·K)**.

C'est le U « en partie courante » : il ignore les montants de l'ossature et les jonctions. Le U réel du mur est un peu moins bon (voir « Expert »).

### Les ponts thermiques

Une paroi bien isolée en partie courante peut perdre beaucoup à ses jonctions. Les zones sensibles sont la liaison mur-plancher, la liaison mur-toiture, les balcons, les appuis de fenêtres et les montants de l'ossature. La parade est la **continuité de l'isolant** : un manteau sans trou. D'où l'intérêt de traiter ces points dès la conception, pas sur le chantier.

### L'étanchéité à l'air

Un bâtiment peut être très isolé et fuir par ses joints, ses traversées de réseaux et ses menuiseries. L'**étanchéité à l'air** se vérifie par un test à la **porte soufflante** (ou blower door) : un ventilateur met le bâtiment en pression ou en dépression, et l'on mesure le débit de fuite. L'indicateur est le **Q4Pa-surf**, en m³/(h·m²) : le débit de fuite sous 4 pascals de différence de pression, rapporté à la surface des parois. Plus il est bas, plus l'enveloppe est étanche.

D'après des sources professionnelles, le test est obligatoire en fin de chantier pour les logements neufs soumis à la RE2020, avec un Q4Pa-surf d'au plus **0,6** en maison individuelle et **1,0** en logement collectif.

### Le Bbio : noter l'enveloppe

La RE2020 juge d'abord la qualité du bâti, indépendamment des équipements de chauffage, avec le **Bbio** (besoin bioclimatique conventionnel), exprimé en points. Il additionne les besoins de chauffage, de refroidissement et d'éclairage, avec des poids différents. Il doit rester sous un plafond, le Bbio max. Pour Arbola, un logement collectif, la valeur moyenne de ce plafond est de **65 points**, avant les modulations propres au projet.

## Approfondir

### Le Bbio en détail

La formule est : **Bbio = 2 × besoins de chauffage + 2 × besoins de refroidissement + 5 × besoins d'éclairage**. La RE2020 a ajouté la prise en compte systématique du froid, que la RT 2012 ne notait pas.

Le plafond d'un projet est calculé ainsi : **Bbio max = Bbio max moyen × (1 + modulations)**. Le Bbio max moyen vaut 63 points pour les maisons individuelles ou accolées et 65 points pour les logements collectifs (décret du 29 juillet 2021). Les modulations tiennent compte de la situation géographique, des combles aménagés, de la surface des logements et de l'exposition au bruit. Elles peuvent changer sensiblement le résultat : le plafond de ton projet vient du bureau d'études.

À la différence de l'Ic construction (chapitre 5 du parcours « Nouvelles méthodes »), ces valeurs de Bbio ne baissent pas aux paliers de 2025, 2028 et 2031.

### Ponts thermiques : deux coefficients

On mesure un pont thermique par un coefficient :

- **ψ** (psi), linéique, en W/(m·K), pour une jonction qui court sur une longueur (liaison mur-plancher, appui de fenêtre) ;
- **χ** (chi), ponctuel, en W/K, pour un point isolé (une console, une fixation traversante).

Les règles Th-Bât donnent la méthode et des valeurs par défaut dans leur fascicule « Ponts thermiques ». Les valeurs calculées par un logiciel de simulation sont plus favorables que les valeurs par défaut, mais elles se justifient.

### Le test d'étanchéité à l'air

Le test s'extrapole à partir de plusieurs points de mesure, jusqu'à 4 pascals, car une mesure directe à cette pression serait trop imprécise. Il est confié à un opérateur qualifié (d'après un fournisseur, la qualification Qualibat 8711). Le rapport accompagne l'attestation de fin de travaux de la RE2020, jointe à la déclaration d'achèvement : un résultat au-dessus du seuil bloque cette attestation. Un joint de silicone en finition suffit pour l'eau, pas pour l'air durablement : l'étanchéité à l'air se prévoit dès la conception, avec des membranes et des jonctions soignées.

La manière de tester un immeuble collectif (par logement ou par échantillon) n'est pas détaillée ici.

### Isoler par l'intérieur, par l'extérieur ou en paroi répartie

- **Par l'intérieur (ITI)** : simple à poser, mais elle réduit la surface habitable et laisse en général des ponts thermiques au droit des planchers.
- **Par l'extérieur (ITE)** : l'isolant passe devant les planchers, ce qui traite mieux les ponts thermiques. Elle change l'aspect de la façade, ce qui peut demander une autorisation d'urbanisme.
- **Répartie** : l'isolant est entre les montants d'une ossature, comme pour Arbola. Les montants eux-mêmes forment de petits ponts thermiques, souvent complétés par une couche d'isolant continue.

Ces comparaisons viennent de la pratique de conception : le bureau d'études tranche pour chaque projet.

## Expert

- **Valeur déclarée et valeur utile.** Les règles Th-Bât (fascicule « Matériaux ») partent de la valeur déclarée par le fabricant : λ utile = λ déclaré × FT × Fm × FR. Dans les applications courantes, FT et Fm valent 1. FR est un coefficient de sécurité : 1 avec un marquage CE de système 1+ (ou équivalent), 1,15 avec les autres systèmes de marquage CE. Sans valeur déclarée, on applique les **valeurs par défaut**, volontairement prudentes.
- **Tabulé ou mesuré.** Pour les valeurs tabulées, le même fascicule précise qu'elles priment sur les procès-verbaux de mesure : un résultat d'essai isolé ne remplace pas la valeur réglementaire.
- **U de partie courante et U réel.** Le U de l'exemple d'Arbola ignore les montants de l'ossature, qui sont plus conducteurs que l'isolant : les règles Th-Bât les traitent comme des ponts thermiques intégrés à la paroi. Pour une paroi à ossature bois, le U réel dépasse le U de partie courante.
- **De l'Ubât au Bbio.** La RT 2005 jugeait l'enveloppe par un coefficient moyen, l'Ubât. Depuis la RT 2012, le Bbio juge aussi la conception bioclimatique (orientation, apports solaires, éclairage naturel), pas seulement l'isolation.
- **Ajustements de 2026.** Un décret et un arrêté du 18 mars 2026 modifient la RE2020 pour les permis déposés depuis le 1er juillet 2026. Leur effet sur la modulation du Bbio n'a pas été vérifié ici.

## Cas pratiques

1. Un mur reçoit 24 cm d'isolant de λ = 0,040, avec Rsi = 0,13 et Rse = 0,04. Calcule R de l'isolant, R total et U. Que donnerait un U calculé sans les résistances superficielles ?
2. Le même mur reçoit un isolant de λ = 0,050 sur 24 cm. Calcule U et compare avec la question 1. Qu'en conclus-tu sur le choix de l'isolant ?
3. Un test d'étanchéité donne un Q4Pa-surf de 0,9 m³/(h·m²). Est-ce conforme pour Arbola, un logement collectif ? Et pour une maison individuelle ?
4. Avec le [comparateur de matériaux](/comparateur/), choisis la botte de paille, le panneau de fibre de bois rigide et le polystyrène expansé, et vise R = 5. Quel isolant est le plus mince, et lequel le plus épais ? Quelle limite de ce critère retiens-tu ?

## Vocabulaire

Enveloppe du bâtiment · Conductivité thermique · Résistance thermique · Résistances superficielles · Coefficient de transmission thermique · Pont thermique · Étanchéité à l'air · Q4Pa-surf · Test d'infiltrométrie · Bbio · ITE · ITI · RE2020

## Auto-évaluation

### Quiz

1. Comment calcule-t-on la résistance thermique R d'une couche ?
2. Un U plus élevé veut-il dire une meilleure isolation ?
3. Quelles sont les résistances superficielles d'un mur ?
4. Qu'est-ce qu'un pont thermique ?
5. Pourquoi mesure-t-on l'étanchéité à l'air d'un bâtiment neuf ?

### Flashcards

- R d'une couche = épaisseur ÷ λ, en m²·K/W.
- U = 1 ÷ (Rsi + somme des R + Rse), en W/(m²·K). Plus U est bas, mieux la paroi isole.
- Résistances superficielles d'un mur : Rsi 0,13 et Rse 0,04.
- Pont thermique : zone où l'isolant s'interrompt, par exemple une jonction mur-plancher ou un balcon.
- Q4Pa-surf : débit de fuite sous 4 Pa rapporté à la surface des parois. Au plus 0,6 en maison et 1,0 en collectif (sources professionnelles).
- Bbio = 2 × chauffage + 2 × refroidissement + 5 × éclairage. Bbio max moyen : 63 en maison, 65 en collectif.

## Attention

- Le U de partie courante n'est pas le U réel de la paroi : les jonctions et les montants le dégradent.
- Les valeurs de λ des fabricants sont des valeurs déclarées. Seules les valeurs utiles, ou les fiches de produit, servent à un calcul réglementaire.
- Les seuils d'étanchéité à l'air viennent de sources professionnelles : le texte réglementaire n'a pas été relu ici.
- Le plafond de Bbio d'un projet dépend de modulations que seul le bureau d'études calcule.
- Les comparaisons entre isolation par l'intérieur, par l'extérieur et répartie viennent de la pratique : elles ne remplacent pas l'étude du projet.
- Les chiffres d'Arbola sont fictifs. Ce chapitre donne des repères généraux, pas une étude thermique.

## Sources et vérification

Vérifié le 11 octobre 2026.

- Résistances superficielles et formule de U : règles Th-Bât, d'après des supports pédagogiques de l'Éducation nationale ([Thermique STI2D, académie de La Réunion](https://etab.ac-reunion.fr/wp-content/uploads/sites/114/2015/10/Thermique-STI2DAC.pdf) ; [annales ENSEA](https://concours.ensea.fr/pdfs/dutbts/annales/2003/Civil.pdf)).
- Valeurs par défaut de λ (plâtre 0,25 ; OSB 0,13) et coefficients de conversion FT, Fm, FR : [règles Th-Bât, fascicule « Matériaux »](https://rt-re-batiment.developpement-durable.gouv.fr/IMG/pdf/2-fascicule_materiaux.pdf) (ministère, 20 décembre 2017).
- Bbio : DRIEAT Île-de-France, [présentation de la RE2020](https://www.drieat.ile-de-france.developpement-durable.gouv.fr/IMG/pdf/drieat_francois_bourgeois.pdf) (formule, 63 et 65 points) ; préfecture de l'Isère, [présentation de la RE2020](https://www.isere.gouv.fr/index.php/contenu/telechargement/69474/553758/file/Presentation%20RE%202020.pdf) ; FFB, [Quels sont les trois indicateurs de performance énergétique de la RE2020 ?](https://www.ffbatiment.fr/techniques-batiment/reglementation-construction/reglementation-thermique-environnementale/dossier/quels-sont-les-trois-indicateurs-de-performance-energetique-de-la-re2020) ; Batirama, [la formule du Bbio max et ses modulations](https://www.batirama.com/article/39675-performances-energetiques-des-logements-la-re2020-moins-exigeante-que-la-rt2012.html).
- Ponts thermiques (ψ et χ), Ubât : [supports de l'académie de La Réunion](https://etab.ac-reunion.fr/wp-content/uploads/sites/114/2015/10/Thermique-STI2DAC.pdf) ; extraits des règles Th-Bât, fascicule 4 (ossature bois) dans le [sujet d'agrégation de 2018](https://media.devenirenseignant.gouv.fr/file/agregation_externe/25/3/s2018_agreg_externe_sii_construction_3_4_917253.pdf).
- Étanchéité à l'air (Q4Pa-surf, seuils, test, attestation) : sources professionnelles : [Construires, test d'infiltrométrie](https://www.construires.fr/reglementation-thermique/rt-infiltrometrie/) ; [Hellopro, tout savoir sur l'infiltrométrie](https://conseils.hellopro.fr/tout-savoir-sur-l-infiltrometrie-2641.html) ; fiche commerciale Siniat (seuil de 1,0 en collectif).
- Ajustements de la RE2020 de 2026 : FFB, [première série d'ajustements](https://www.ffbatiment.fr/actualites-batiment/actualite/re2020-premiere-serie-ajustements-suite-rapport-rivaton).

Contrôlé le 11 octobre 2026 : le Bbio max moyen de 63 et 65 points est confirmé par la préfecture de l'Isère, la DRIEAT et la FFB. Un site grand public donne des valeurs de Bbio par zone climatique (50 à 65 points) : elles contredisent ces sources et n'ont pas été retenues.

À contrôler : les résistances superficielles, relevées dans des supports pédagogiques et non dans le fascicule « Parois opaques » ; les seuils de Q4Pa-surf (0,6 et 1,0) et le caractère obligatoire du test, tirés de sources professionnelles et non de l'arrêté du 4 août 2021 ; l'obligation de joindre l'attestation de fin de travaux et la qualification de l'opérateur ; la façon de tester un collectif ; l'effet du décret du 18 mars 2026 sur le Bbio ; la valeur du Bbio max pour un projet précis, qui dépend des modulations ; les affirmations sur l'isolation par l'intérieur et par l'extérieur, qui viennent de la pratique de conception ; le fait que les valeurs de Bbio ne baissent pas aux paliers de 2025 à 2031 (deux sites professionnels, non revérifié sur le décret).
