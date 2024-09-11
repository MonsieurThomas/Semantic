const Prompt = `Objectif : Création exhaustive d'une Mind Map hiérarchisée à partir d'un texte donné
Je souhaite que tu crées une mind map exhaustive à partir d’un texte donné, qui peut provenir de plusieurs auteurs ou sources différentes. Cette mind map doit refléter l'intégralité du texte, en s'assurant qu'aucune partie n'est omise et que chaque branche terminale renvoie à un bloc spécifique du texte.

Raisonnement à suivre :

1. Lecture et découpage en blocs de texte
1.0. Lecture complète : Lis d'abord le texte en entier pour comprendre sa structure générale.
1.1. Définition des blocs : Un bloc de texte est un ensemble de phrases ou de paragraphes liés par une même idée. Chaque bloc doit :
•	Commencer par une majuscule et se terminer par un point (ou autre ponctuation forte comme "?" ou "!").
•	Ne pas dépasser une vingtaine de lignes, sauf si nécessaire pour respecter la continuité d'une idée.
•	Si le texte est déjà divisé en paragraphes, privilégie leur utilisation comme blocs.
•	Garantir que la somme des caractères des blocs soit exactement égale au nombre de caractères du texte initial (règle de Complétude des Caractères).
•	Proportionnalité des blocs : La taille moyenne des blocs de texte doit être proportionnelle à la taille totale du document (en fonction de nb-pages). 
La taille moyenne d’un bloc doit être d'environ 15 à 25 lignes. 
Sa taille max doit être 1 page. 
Sa taille minimum doit être 10 lignes. 
Documents structurés et fragmentés : Dans les textes très structurés, comme les codes législatifs ou réglementaires, si un article ou une unité de texte est trop court, il doit être automatiquement fusionné avec d'autres articles voisins, même si les thèmes diffèrent légèrement. L'objectif est de limiter la fragmentation excessive du texte
1.2. Validation des blocs : 
1.2.1. Non-chevauchement et exhaustivité : Assurez-vous que chaque bloc de texte couvre exactement toutes les phrases et caractères du texte original, sans omission ni chevauchement. La somme des caractères de tous les blocs doit correspondre précisément au nombre de caractères du texte original. Le dernier mot d'un bloc doit être suivi par le premier mot du bloc suivant, sans duplication ni omission. Si une erreur est détectée (comme un chevauchement ou une omission), corrige-la immédiatement.
1.2.2. Taille de blocs : Après avoir découpé les blocs, effectue un contrôle de la taille moyenne des blocs. Si des blocs sont trop petits ou trop grands par rapport aux autres blocs du texte, ajuste-les en conséquence avant de passer à l'étape suivante.
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
5.1. Nombre de branches primaires : La mind map doit comporter entre 3 et 9 branches principales, avec une profondeur suffisante pour explorer toutes les nuances du texte.

6. Règles de profondeur de la mind map selon le nombre de pages du document (nb-pages)
6.0. Proportionnalité du nombre de blocs : En fonction de la longueur du texte, le nombre total de blocs doit respecter la proportionnalité par rapport au nombre de pages, soit en moyenne 3 blocs par page avec une variation possible de 10 %. Le nombre total de blocs sera donc :
•	Minimum de blocs : 0,9 * 3 * nb-pages
•	Maximum de blocs : 1,1 * 3 * nb-pages
6.1. Documents de moins de 10 pages : La mind map doit comporter au minimum 3 niveaux de profondeur (par exemple : a.b.c).
Exemple de structure JSON pour nb-pages = 9 :
{
  "Titre Global": {
    "item 1": {
      "value": "Titre du bloc",
      "item 1.1": {
        "value": "Titre du sous-bloc",
        "item 1.1.1": {
          "value": "Titre du sous-sous-bloc",
          "bounding": ["Début de citation... —> ...fin de citation."]
        }
      },
      "item 1.2": {
        "value": "Titre du sous-bloc",
        "bounding": ["Début de citation... —> ...fin de citation."]
      }
    }
  }
}

6.1.1. Précision pour début de citation et fin de citation : il s'agit uniquement des 5 premiers et 5 derniers mots de chaque bloc

6.2. Documents de 10 à 40 pages : La mind map doit comporter au minimum 4 niveaux de profondeur (par exemple : a.b.c.d).
Exemple de structure JSON pour nb-pages = 25 :
{
  "Titre Global": {
    "item 1": {
      "value": "Titre du bloc",
      "item 1.1": {
        "value": "Titre du sous-bloc",
        "item 1.1.1": {
          "value": "Titre du sous-sous-bloc",
          "item 1.1.1.1": {
            "value": "Titre du sous-sous-sous-bloc",
            "bounding": ["Début de citation... —> ...fin de citation."]
          }
        }
      },
      "item 1.2": {
        "value": "Titre du sous-bloc",
        "bounding": ["Début de citation... —> ...fin de citation."]
      }
    }
  }
}

6.3. Documents de 40 à 75 pages : La mind map doit comporter au minimum 5 niveaux de profondeur (par exemple : a.b.c.d.e).
Exemple de structure JSON pour nb-pages = 60 :
{
  "Titre Global": {
    "item 1": {
      "value": "Titre du bloc",
      "item 1.1": {
        "value": "Titre du sous-bloc",
        "item 1.1.1": {
          "value": "Titre du sous-sous-bloc",
          "item 1.1.1.1": {
            "value": "Titre du sous-sous-sous-bloc",
            "item 1.1.1.1.1": {
              "value": "Titre du sous-sous-sous-sous-bloc",
              "bounding": ["Début de citation... —> ...fin de citation."]
            }
          }
        }
      },
      "item 1.2": {
        "value": "Titre du sous-bloc",
        "bounding": ["Début de citation... —> ...fin de citation."]
      }
    }
  }
}

6.4. Documents de plus de 75 pages : La mind map doit comporter au minimum 6 niveaux de profondeur (par exemple : a.b.c.d.e.f).
Exemple de structure JSON pour nb-pages = 100 :
{
  "Titre Global": {
    "item 1": {
      "value": "Titre du bloc",
      "item 1.1": {
        "value": "Titre du sous-bloc",
        "item 1.1.1": {
          "value": "Titre du sous-sous-bloc",
          "item 1.1.1.1": {
            "value": "Titre du sous-sous-sous-bloc",
            "item 1.1.1.1.1": {
              "value": "Titre du sous-sous-sous-sous-bloc",
              "item 1.1.1.1.1.1": {
                "value": "Titre du sous-sous-sous-sous-sous-bloc",
                "bounding": ["Début de citation... —> ...fin de citation."]
              }
            }
          }
        }
      },
      "item 1.2": {
        "value": "Titre du sous-bloc",
        "bounding": ["Début de citation... —> ...fin de citation."]
      }
    }
  }
}

7. Format de réponse en JSON
7.1. Structure JSON : La mind map doit être fournie sous forme de JSON, en respectant le format suivant :
{
  "Titre Global": {
    "item 1": {
      "value": "titre du bloc",
      "item 1.1": {
        "value": "titre du sous-bloc",
        "bounding": ["Début de citation... —> ...fin de citation."]
      },
      "item 1.2": {
        "value": "titre du sous-bloc",
        "bounding": ["Début de citation... —> ...fin de citation."]
      }
    },
    "item 2": {
      "value": "titre du bloc",
      "item 2.1": {
        "value": "titre du sous-bloc",
        "item 2.1.1": {
          "value": "titre du sous-sous-bloc",
          "bounding": ["Début de citation... —> ...fin de citation."]
        },
        "item 2.1.2": {
          "value": "titre du sous-sous-bloc",
          "bounding": ["Début de citation... —> ...fin de citation."]
        }
      },
      "item 2.2": {
        "value": "titre du sous-bloc",
        "bounding": ["Début de citation... —> ...fin de citation."]
      }
    }
  }
}

7.2. Validation des citations dans les bounding : Après avoir validé le découpage des blocs, assurez-vous que les citations textuelles dans les "bounding" contiennent ni plus ni moins que 5 mots en début de citation, 5 mots en fin de citation. Si une ambiguïté est présente (comme la répétition des mêmes mots), ajoutez des précisions pour clarifier.

8. Vérification de l'exhaustivité
8.0. Exhaustivité des blocs : Vérifie systématiquement que chaque portion du texte initial est présente dans un bloc, sans omission ni chevauchement.
8.1. Respect des règles de structure : Toutes les branches doivent atteindre un niveau de profondeur suffisant pour garantir que les informations textuelles se trouvent au dernier niveau de la mind map.

9. Renvoie moi le JSON, sans autre texte parasite.`;

export default Prompt;


// {
//   "Titre Global": {
//     item 1: {
//       value: "titre du bloc"
//         item 1.1: { 
//           value: "titre du sous-bloc"
//           bounding: ["Début de citation... —> ...fin de citation."]
//       },
//       value: "titre du bloc"
//         item 1.2: {
//           value: "titre du sous-bloc"
//           bounding : ["Début de citation... —> ...fin de citation."]
//       }
//     },
//     item 2: {
//       value: "titre du bloc",
//          item 2.1: {
//            value: "titre du sous-bloc",
//              item 2.1.1: {
//              value: "titre du sous-sous bloc",
//              bounding: ["Début de citation... —> ...fin de citation."]
//         },
//             item 2.1.2: {
//              value: "titre du sous-sous-bloc",
//              bounding: ["Début de citation... —> ...fin de citation."]
//         }
//       },
//          item 2.2: {
//            value: "titre du sous-bloc",
//              item 2.2.1: {
//              value: "titre du sous-sous bloc",
//              bounding: ["Début de citation... —> ...fin de citation."]
//         },
//              item 2.2.2: {
//              value: "titre du sous-sous-bloc",
//              bounding: ["Début de citation... —> ...fin de citation."]
//      }
//     },
//       item 3 // Structure similaire pour d'autres catégories et blocs
//     }
//   }
// }
