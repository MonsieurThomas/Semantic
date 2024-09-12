const Prompt = `Objectif : Création exhaustive d'une Mind Map hiérarchisée à partir d'un texte donné
Je souhaite que tu crées une mind map exhaustive à partir d’un texte donné, qui peut provenir de plusieurs auteurs ou sources différentes. Cette mind map doit refléter l'intégralité du texte, en s'assurant qu'aucune partie n'est omise et que chaque branche terminale renvoie à un bloc spécifique du texte.

Raisonnement à suivre :

1. Lecture et découpage en blocs de texte
1.0. Lecture complète : Lis d'abord le texte en entier pour comprendre sa structure générale. Plus la taille du texte est grande (c'est-à-dire plus "nb-pages=x" est grand), plus la taille moyenne des blocs sera grande.
1.1. Définition des blocs : Un bloc de texte est un ensemble de phrases ou de paragraphes liés par une même idée. Chaque bloc doit obligatoirement :
•	Commencer par une majuscule et se terminer par un point (ou autre ponctuation forte comme "?" ou "!"). Si ton découpage ne se termine pas par un point, un point d'interrogation ou un point d'exclamation, étends la fin du bloc à la prochaine ponctuation forte. Jamais tu ne dois inventer, créer ou rajouter ces points, ils doivent obligatoirement correspondre à ceux du texte que je te donne. Jamais le bloc ne peut commencer ou se terminer au milieu d'une phrase ou après une virgule ou après une parenthèse. Si c'est le cas, reconstruis-le bloc ou rallonge-le au prochain point ("." ou "?" ou "!) présent dans le texte.
Les 5 mots du début d'un bloc doivent impérativement être placés avant les 5 mots de fin du bloc dans le texte. Si ce n'est pas le cas, tu dois reconstruire le bloc de manière à ce que les mots soient dans le bon ordre. Après chaque découpage de bloc, réalise une vérification systématique pour garantir que les 5 premiers mots du bloc apparaissent bien avant les 5 derniers mots dans le texte original. Cette règle est absolue et doit être appliquée à chaque découpage de bloc.

Exemple :

Si le texte original est : "L'économie mondiale subit des transformations importantes. Ces changements sont dus à de multiples facteurs comme la globalisation, l'évolution des technologies, et les nouvelles régulations internationales."

Bloc incorrect :

Début du bloc : "transformations importantes. Ces changements sont"
Fin du bloc : "globalisation, l'évolution des technologies"
Dans ce cas, les 5 mots du début sont après les 5 mots de fin dans le texte, ce qui est incorrect.

Bloc corrigé :

Début du bloc : "L'économie mondiale subit des transformations"
Fin du bloc : "multiples facteurs comme la globalisation"
Ainsi, les 5 premiers mots se trouvent bien avant les 5 derniers mots dans l'ordre du texte.
•	Ne pas dépasser une 2 pages pour la taille d'un bloc, sauf si nécessaire pour respecter la continuité d'une idée.
•	Si le texte est déjà divisé en paragraphes, privilégie leur utilisation comme blocs.
•	Garantir que la somme des caractères des blocs soit exactement égale au nombre de caractères du texte initial (règle de Complétude des Caractères).
•	Proportionnalité des blocs : La taille moyenne des blocs de texte doit être proportionnelle à la taille totale du document (en fonction de nb-pages).  Plus le "nb-pages=" tend vers 120-130, plus les blocs feront une taille d'1,5 page.. Plus la taille du texte est grande (c'est-à-dire plus "nb-pages=x" est grand), plus la taille moyenne des blocs sera grande.
La taille moyenne d’un bloc doit être d'environ 15 à 25 lignes. 
Sa taille max doit être 1,5 page. 
Sa taille minimum doit être 10 lignes. 
Documents structurés et fragmentés : Dans les textes très structurés, comme les codes législatifs ou réglementaires, si un article ou une unité de texte est trop court, il doit être automatiquement fusionné avec d'autres articles voisins, même si les thèmes diffèrent légèrement. L'objectif est de limiter la fragmentation excessive du texte
1.2. Validation des blocs : 

1.2.1. Chaque bloc de texte doit couvrir exactement une partie distincte du texte original, sans chevauchement ni omission. Le dernier mot d'un bloc doit être immédiatement suivi par le premier mot du bloc suivant. Aucune phrase ni section de texte ne doit apparaître dans deux blocs différents.

Si un chevauchement est détecté — c'est-à-dire que la même phrase ou section apparaît dans deux blocs distincts —, il faut corriger cela immédiatement.

Exemple :
Si le texte original est :
"L'innovation est un facteur clé de la croissance. De nombreuses entreprises investissent dans des technologies de pointe. Les résultats sont prometteurs pour l'avenir. Le développement durable est également un sujet clé."

Blocs incorrects (avec chevauchement) :

Bloc 1 : "bounding": ["L'innovation est un facteur clé... —> ...des technologies de pointe."]
Bloc 2 : "bounding": ["De nombreuses entreprises investissent... —> ...pour l'avenir."]
Ici, la phrase "De nombreuses entreprises investissent dans des technologies de pointe." est présente dans les deux blocs, ce qui cause un chevauchement.

Blocs corrigés (sans chevauchement) :

Bloc 1 : "bounding": ["L'innovation est un facteur clé... —> ...de la croissance."]
Bloc 2 : "bounding": ["De nombreuses entreprises investissent... —> ...des technologies de pointe."]
Bloc 3 : "bounding": ["Les résultats sont prometteurs... —> ...pour l'avenir."]
Bloc 4 : "bounding": ["Le développement durable est... —> ...également un sujet clé."]
Dans cette version corrigée, chaque bloc contient des phrases distinctes, sans chevauchement entre les blocs, et le texte est découpé de manière continue.

1.2.2. Taille de blocs : Après avoir découpé les blocs, effectue un contrôle de la taille moyenne des blocs. Si des blocs sont trop petits ou trop grands par rapport aux autres blocs du texte, ajuste-les en conséquence avant de passer à l'étape suivante.

Le nombre de blocs à l'extrémité du json (aux dernières branches) doit être proportionnel au nombre de pages ("nb-pages=") du texte que je vais t'envoyer (en suivant 4 tranches de taille). Ne te limite jamais en termes de nombre de token de sortie. Tu dois obligatoirement me donner le json complet, même si le document est très long. Lorsque le "nb-pages" dépasse les 40 pages, tu es obligée de faire un json avec 3 niveaux de profondeur ou plus.
2. Extraction de mots-clés
2.0. Mots-clés précis : Attribue à chaque bloc un ou plusieurs mots-clés qui résument son contenu de manière précise, sans répétition inutile.
2.1. Blocs textuels originaux : Les blocs de texte doivent être directement tirés du texte fourni en input, et non être des résumés ou réécritures du texte original.

3. Regroupement thématique
3.0. Regroupement par sens : Regroupe les blocs de texte par proximité sémantique, en fonction des mots-clés attribués.
3.1. Taille des groupes : Chaque groupe de blocs doit contenir entre 2 et 5 blocs de texte. Pour des textes tels que les textes juridiques très fragmentées, les articles trop courts (moins de 5 lignes) doivent être fusionnés avec les articles voisins ou regroupés sous une même branche (titre de la section ou chapitre dans le cas du juridique) si leur thématique est similaire
3.2. Hiérarchie finale : Tous les blocs de texte doivent se retrouver à l'extrémité des branches de la mind map. Les noms des blocs n'apparaissent qu'au dernier niveau de la structure.

4. Assignation de catégories
4.0. Mots-clés de catégorie : Regroupe les mots-clés en catégories pour former des sous-branches. Chaque catégorie doit :
•	Représenter le thème principal du groupe de blocs.
•	Ne pas dépasser 5 mots.

5. Construction des branches non finales
5.0. Profondeur : Continue à regrouper les catégories par proximité sémantique jusqu’à atteindre les branches primaires (premier niveau de la mind map).
5.1. Nombre de branches primaires : La mind map doit comporter entre 3 et 8 branches principales, avec une profondeur suffisante pour explorer toutes les nuances du texte. 


6. Règles obligatoires de profondeur de la mind map selon le nombre de pages du document (nb-pages)
6.0. Proportionnalité du nombre de blocs :
En fonction de la longueur du texte, le nombre total de blocs doit respecter la proportionnalité par rapport au nombre de pages, soit en moyenne 3 blocs par page avec une variation possible de 10 %. Le nombre total de blocs sera donc :

Minimum de blocs : 0,9 * 3 * nb-pages
Maximum de blocs : 1,1 * 3 * nb-pages
6.1. Si le texte a moins de 50 pages (nb-pages < 50) :
La mind map doit obligatoirement avoir 3 niveaux de profondeur (maximum 6 branches primaires, 5 secondaires, 4 tertiaires). Toutes les branches doivent obligatoirement se terminer au minimum au niveau 3 (c’est-à-dire x.y.z).

Important : Le nombre de blocs doit respecter la proportionnalité définie précédemment et toutes les branches doivent se terminer au niveau de profondeur requis. L'exemple suivant ne développe que la première branche primaire pour ne pas être trop long, mais toutes les branches doivent suivre cette structure.

Intervalle de blocs :

Minimum de blocs : 0,9 * 3 * nb-pages
Maximum de blocs : 1,1 * 3 * nb-pages

Dans cet exemple de structure JSON, seule la première branche de la branche primaire a été développé, les branches 1.2, 1.3, 1.4 et toutes les autres doivent suivre globalement cet exemple :

json
Copier le code
{
  "Titre Global": {
    "item 1": {
      "value": "Titre du bloc",
      "item 1.1": {
        "value": "Titre du bloc",
        "item 1.1.1": {
          "value": "Titre du bloc",
          "bounding": ["7 premiers mots exacts... —> ...7 derniers mots exacts"]
        },
        "item 1.1.2": {
          "value": "Titre du bloc",
          "bounding": ["7 premiers mots exacts... —> ...7 derniers mots exacts"]
        },
        "item 1.1.3": {
          "value": "Titre du bloc",
          "bounding": ["7 premiers mots exacts... —> ...7 derniers mots exacts"]
        },
        "item 1.1.4": {
          "value": "Titre du bloc",
          "bounding": ["7 premiers mots exacts... —> ...7 derniers mots exacts"]
        }
      }
    },
    "item 1.2": {
      "value": "Titre du bloc"
    },
    "item 1.3": {
      "value": "Titre du bloc"
    }
  }
}

6.2. Si le texte a plus de 50 pages (nb-pages > 50) :
La mind map doit obligatoirement avoir 4 niveaux de profondeur (maximum 8 branches primaires, 5 secondaires, 4 tertiaires, 3 quaternaires). Toutes les branches doivent obligatoirement se terminer au minimum au niveau 4 (c’est-à-dire x.y.z.a).

Important : Le nombre de blocs doit respecter la proportionnalité définie précédemment et toutes les branches doivent se terminer au niveau de profondeur requis. L'exemple suivant ne développe que la première branche primaire pour ne pas être trop long, mais toutes les branches doivent suivre cette structure.

Intervalle de blocs :

Minimum de blocs : 0,9 * 3 * nb-pages
Maximum de blocs : 1,1 * 3 * nb-pages

Dans cet exemple de structure JSON, seule la première branche de la branche primaire a été développé, les branches 1.2, 1.3, 1.4 et toutes les autres doivent suivre globalement cet exemple :

json
Copier le code
{
  "Titre Global": {
    "item 1": {
      "value": "Titre du bloc",
      "item 1.1": {
        "value": "Titre du bloc",
        "item 1.1.1": {
          "value": "Titre du bloc",
          "item 1.1.1.1": {
            "value": "Titre du bloc",
            "bounding": ["7 premiers mots exacts... —> ...7 derniers mots exacts"]
          },
          "item 1.1.1.2": {
            "value": "Titre du bloc",
            "bounding": ["7 premiers mots exacts... —> ...7 derniers mots exacts"]
          },
          "item 1.1.1.3": {
            "value": "Titre du bloc",
            "bounding": ["7 premiers mots exacts... —> ...7 derniers mots exacts"]
          }
        }
      }
    },
    "item 1.2": {
      "value": "Titre du bloc"
    },
    "item 1.3": {
      "value": "Titre du bloc"
    }
  }
}

Assurance d'exhaustivité : Dès que tu as fini de lire, commence le découpage en blocs en t'assurant qu'aucune partie du texte ne soit ignorée. En fonction du nombre de pages précisé du texte ("nb-pages="), tu dois anticiper le nombre de blocs approximatif que tu dois découper (un bon ordre d'idée est que pour 1 page, il y a en moyenne 3 à 4 blocs). Pour 75 pages, il y aura environ entre 225 et 300 blocs. C'est aussi ce "nb-pages=" qui déterminera, du fait du nombre de blocs, le niveau de profondeur du json.

7.2. Validation des citations dans les bounding : Après avoir validé le découpage des blocs, assurez-vous que les citations textuelles dans les "bounding" contiennent ni plus ni moins que 5 mots en début de citation, 5 mots en fin de citation. Si une ambiguïté est présente (comme la répétition des mêmes mots), ajoutez des précisions pour clarifier. Pour rappel, chaque bloc doit obligatoirement :
•	Commencer par une majuscule et se terminer par un point (ou autre ponctuation forte comme "?" ou "!"). Si ton découpage ne se termine pas par un point, un point d'interrogation ou un point d'exclamation, étends la fin du bloc à la prochaine ponctuation forte.

8. Vérification de l'exhaustivité
8.0. Exhaustivité des blocs : Vérifie systématiquement que chaque portion du texte initial est présente dans un bloc, sans omission ni chevauchement.
8.1. Respect des règles de structure : Toutes les branches doivent atteindre un niveau de profondeur suffisant pour garantir que les informations textuelles se trouvent au dernier niveau de la mind map.

9. Renvoie moi le JSON, sans autre texte parasite.`;

export default Prompt;
