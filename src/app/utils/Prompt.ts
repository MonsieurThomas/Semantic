const Prompt = `Objectif :

Je développe un logiciel qui reçoit un ou plusieurs documents texte de l'utilisateur, les combine en un seul bloc et te les envoie, tout en précisant le nombre total de pages que ces textes représentent. Ton travail consiste à créer une structure JSON qui reflète une mind map complète et exhaustive du texte, avec chaque idée décomposée en sous-blocs hiérarchisés. Peu importe que le texte provienne de différentes sources (Word, PDF, pages Web, etc.), tu dois le traiter comme un tout unique et t’assurer que chaque segment du texte soit inclus dans la mind map. Aucune partie du texte ne doit être omise.

Règle fondamentale : l'exhaustivité.

Chaque paragraphe, chaque phrase, chaque mot que tu reçois doit être inclus dans les blocs de la mind map. Si une partie du texte est omise dans les délimitations que tu donnes des blocs, la mind map sera incorrecte et devra être ajustée pour que tout soit intégré. L'exhaustivité totale du texte est la priorité numéro un.

La mind map que tu crées sera utilisée par notre logiciel SaaS pour générer une visualisation que l’utilisateur final pourra explorer. La précision de ta réponse est essentielle, car elle impacte directement la qualité de la mind map affichée. Les résultats que tu renvoies seront transformés en une représentation visuelle et toute erreur dans la délimitation ou la hiérarchie des blocs perturbera cette visualisation.

Les seules parties de texte que tu es autorisé à omettre sont les notes de bas de page.

Règles absolument fondamentales de découpage des blocs :

Chaque bloc doit correspondre à une partie du texte et respecter les règles suivantes :
La taille d'un bloc ne doit jamais dépasser 750 mots mais il doit toujours être supérieur à une 50 de mots. Plus le document te semble détaillé et grand en nombre de lignes, plus tu dois essayer de faire des gros blocs.
Chaque bloc doit commencer par une majuscule et se terminer par obligatoirement par une ponctuation forte dans le texte (point, point d’interrogation, exclamation). Tu ne dois jamais modifier le bounding du texte original que je t'envoie : il doit être obligatoirement ré-écrit tel quel pour que notre logiciel puisse ensuite rechercher exactement ces parties de texte dans le texte original.
Entre les 7 premiers mots et les 7 derniers mots du bloc, met obligatoirement le "-->".

Règle n°2 : Aucune limitation de taille du JSON.

La mind map JSON doit refléter l'intégralité du texte, quelle que soit la taille, même si cela nécessite un nombre élevé de blocs ou de lignes. Aucune restriction ne doit être appliquée en termes de taille du fichier JSON généré ou du nombre de blocs.

Raisonnement à suivre :

Lecture complète et analyse globale : Avant d’entamer le découpage en blocs, tu dois lire l'intégralité du texte et en comprendre la structure générale. Tu ne peux pas commencer à découper ou créer des blocs avant d'avoir analysé l'ensemble du contenu. Il est crucial de prendre en compte les transitions, les changements de sujet ou les documents distincts afin d'assurer une cohérence et une exhaustivité dans le découpage.

Règle : Regroupement et Augmentation de Profondeur dans le Cas de Documents Hautement Structurés

Dans le cas où tu identifies plus de 6 sous-thèmes ou articles à un certain niveau (par exemple, si tu as "item 2.3.1", "item 2.3.2", jusqu'à "item 2.3.10"), tu dois regrouper ces blocs en augmentant la profondeur de la mind map. Cela signifie que tu vas créer un niveau supplémentaire de hiérarchie, en rassemblant les articles en sous-groupes sous une même branche, tout en t'assurant que chaque titre ("value") reste synthétique, clair, et unique, sans dépasser 7 mots.

Exemple :

Supposons que tu as 10 articles courts qui seraient normalement placés sous "item 2.3". Plutôt que de les ranger directement sous "item 2.3.1" à "item 2.3.10", voici comment tu peux les organiser en augmentant la profondeur de la hiérarchie :

json
{
  "Titre Global": {
    "item 2": {
      "value": "Modifications de la Directive",
      "item 2.3": {
        "value": "Régulations Financières et Conformité",
        "item 2.3.1": {
          "value": "Transparence et Obligations",
          "item 2.3.1.1": {
            "value": "Directive et Transparence",
            "bounding": [
              "La directive s'applique à toutes les institutions... —> ...la transparence des opérations."
            ]
          },
          "item 2.3.1.2": {
            "value": "Rapport Annuel et Sanctions",
            "bounding": [
              "Toutes les entreprises doivent soumettre un rapport... —> ...entraîne des sanctions financières."
            ]
          }
        },
        "item 2.3.2": {
          "value": "Conformité et Fonds Propres",
          "item 2.3.2.1": {
            "value": "Contrôles de Conformité",
            "bounding": [
              "Les contrôles de conformité seront effectués par... —> ...activités non conformes."
            ]
          },
          "item 2.3.2.2": {
            "value": "Fonds Propres Minimaux",
            "bounding": [
              "Les entreprises doivent maintenir un niveau minimum... —> ...surveillance nationale."
            ]
          }
        },
        "item 2.3.3": {
          "value": "Lutte contre le Blanchiment",
          "item 2.3.3.1": {
            "value": "Obligations Anti-Blanchiment",
            "bounding": [
              "Les institutions financières doivent se conformer aux... —> ...activité suspecte."
            ]
          },
          "item 2.3.3.2": {
            "value": "Information des Actionnaires",
            "bounding": [
              "Les entreprises doivent informer leurs actionnaires des... —> ...de fusion ou d'acquisition."
            ]
          }
        },
        "item 2.3.4": {
          "value": "Audits et Contrôles Internes",
          "item 2.3.4.1": {
            "value": "Audits Sans Préavis",
            "bounding": [
              "Les autorités peuvent effectuer des audits sans... —> ...conformité aux réglementations en vigueur."
            ]
          },
          "item 2.3.4.2": {
            "value": "Gestion des Risques",
            "bounding": [
              "Les entreprises sont tenues de mettre en place... —> ...gestion des risques."
            ]
          }
        },
        "item 2.3.5": {
          "value": "Sanctions et Transactions",
          "item 2.3.5.1": {
            "value": "Sanctions pour Non-conformité",
            "bounding": [
              "Les sanctions pour non-conformité peuvent inclure des... —> ...faire appel des décisions prises."
            ]
          },
          "item 2.3.5.2": {
            "value": "Transactions Transfrontalières",
            "bounding": [
              "Des obligations spécifiques s'appliquent aux transactions... —> ...application de la directive."
            ]
          }
        }
      }
    }
  }
}

Explications :

item 2.3 : Représente la branche principale "Régulations Financières et Conformité".
item 2.3.1 à item 2.3.5 : Regroupent les 10 articles en 5 sous-thèmes principaux, chacun englobant des articles liés par thématique.
item 2.3.1.1, item 2.3.1.2, etc. : Correspondent aux articles individuels, placés à un niveau de profondeur supplémentaire (niveau 4), permettant de respecter la limite de sous-thèmes par niveau (3 à 6 sous-blocs).
Chaque titre ("value") est synthétique, clair et unique, ne dépassant pas 7 mots, et reflète le contenu des sous-blocs associés.

Création des branches primaires et regroupement progressif : La première étape après la lecture complète est la création des branches primaires qui représentent les grandes thématiques du texte. Même si plusieurs documents sont accolés ou s'il y a des changements thématiques importants, tu dois toujours créer de nouvelles branches primaires pour intégrer ces sections.

À chaque changement de document, signalé par un marqueur spécifique sous la forme doc-nb-x (ex. doc-nb-1, doc-nb-2), tu dois obligatoirement créer de nouvelles branches primaires pour le document suivant. En revanche, même si 1 seul document t'es envoyé (c'est-à-dire qu'il n'y a pas de doc-nb-2, tu dois obligatoirement créer plusieurs branches primaires. Il doit exister plusieurs branches primaires pour chaque document.

Tu peux créer autant de branches primaires que nécessaire, sans limitation. Chaque partie de texte de chaque document doit être entièrement intégrée.

Subdivision progressive (logique itérative) obligatoire :

Ton travail doit suivre un processus itératif où chaque niveau est travaillé avant de passer au suivant. Tous tes json doivent être au minimum de profondeur 3, c'est-à-dire avec des item à 3 niveaux (x.y.z). Chaque section du texte doit être subdivisée en branches secondaires, puis tertiaires, etc. Voici le processus à suivre :

Niveau 1 : Création des branches primaires. Identifie les grandes thématiques du texte et crée les branches primaires (maximum 8). Chaque branche primaire doit couvrir une section significative du texte.

Niveau 2 : Création des branches secondaires. Subdivise chaque branche primaire en 3 à 6 branches secondaires représentant les sous-thèmes. Il est absolument fondamental que tu ne crées par plus de 6 branches secondaires (exemple 1.7, 1.8 ou 2.9, 2.10) car la mind map deviendra trop déséquilibrée. Dans ce genre de cas, il faut que tu subdivise ces différentes branches en branches tertiaires (par exemple 2 groupe de 3 ou 4 branches tertiaires).

Niveau 3 : Création des branches tertiaires. Chaque branche secondaire doit être subdivisée en 2 à 5 branches tertiaires représentant des idées plus spécifiques.

Niveau 4 : Création des branches quaternaires (si le document dépasse 40 pages). Chaque branche tertiaire doit être subdivisée en 2 à 4 branches quaternaires pour atteindre une granularité maximale.

Règle importante pour chaque niveau :

Il est absolument essentiel que, pour chaque niveau de la mind map (branches primaires, secondaires, tertiaires, quaternaires), tu ne dépasses jamais le nombre maximum de branches défini. Si tu as plus de branches que le maximum autorisé, tu dois obligatoirement subdiviser ces branches en sous-branches du niveau suivant pour maintenir la clarté de la mind map.

Niveau 1 : Ne crée jamais plus de 8 branches primaires. Si tu en as plus, regroupe-les en branches secondaires sous les 8 premières branches primaires.

Niveau 2 : Ne crée jamais plus de 6 branches secondaires (exemple : "1.7", "1.8"). Si tu en as plus, tu dois subdiviser certaines branches secondaires en branches tertiaires.

Niveau 3 : Ne crée jamais plus de 5 branches tertiaires (exemple : "1.1.6", "1.1.7"). Si tu en as plus, subdivise ces branches tertiaires en branches quaternaires.

Niveau 4 : Ne crée jamais plus de 4 branches quaternaires. Si tu dépasses ce nombre, tu devras encore subdiviser pour garder un bon équilibre.

Vérification itérative : Après chaque étape (branches primaires, secondaires, etc.), vérifie que les règles ont bien été suivies et que toutes les parties du texte sont correctement intégrées.

Assurance d'exhaustivité et regroupement :

Si à un moment du processus il y a une divergence thématique ou que les sous-blocs semblent ne pas être directement liés entre eux, tu dois malgré tout les regrouper. La règle la plus fondamentale est l'exhaustivité, donc même si des blocs sont thématiquement éloignés, ils doivent être intégrés dans la structure hiérarchique sans omission.

Pas de limitation sur la taille des blocs ou du JSON :

Aucun bloc ne doit dépasser 50 phrases ou 750 mots et il est obligatoire de subdiviser davantage le bloc si nécessaire pour respecter cette limite. Toutefois, tu ne dois jamais être limité par le nombre de blocs, de lignes ou de la taille totale du JSON.

Fusion des branches primaires (si nécessaire) :

Si, à la fin du processus, le nombre total de branches primaires dépasse 8, tu devras effectuer un regroupement de ces branches pour en réduire le nombre.

Exemple : Si tu as 14 branches primaires, tu dois les regrouper pour n'en garder que 4 à 8 branches principales. Les branches regroupées deviendront des sous-branches secondaires.
Cette étape de fusion doit toujours être exécutée après la création de toutes les branches pour garantir un équilibre dans la représentation.

Exemple de structure JSON (avec transitions et niveaux de profondeur) :
json
Copier le code
{
  "Titre Global": {
    "item 1": {
      "value": "Document 1 - Économie mondiale",
      "item 1.1": {
        "value": "Sous-thème 1.1 : Transformations économiques",
        "item 1.1.1": {
          "value": "Sous-thème 1.1.1 : Impact technologique",
          "bounding": ["7 premiers mots exacts... —> ...7 derniers mots exacts"]
        }
      }
    },
    "item 2": {
      "value": "Document 2 - Développement durable",
      "item 2.1": {
        "value": "Sous-thème 2.1 : Innovation écologique",
        "bounding": ["7 premiers mots exacts... —> ...7 derniers mots exacts"]
      }
    }
  }
}

Règles spécifiques sur le découpage des blocs :
Définition des blocs :

Un bloc de texte est un ensemble de phrases ou de paragraphes liés par une même idée. 

Chaque bloc doit :
Commencer par une majuscule et se terminer par une ponctuation forte (point, point d’interrogation, exclamation).
Les 7 premiers mots du bloc doivent apparaître avant les 7 derniers mots du même bloc dans le texte original.

Vérification de la taille et subdivision des blocs :

Si un bloc dépasse 25 phrases, tu dois le subdiviser en sous-blocs plus petits tout en respectant les autres règles de découpage.
Le découpage doit être vérifié pour s’assurer que tous les blocs respectent les règles de délimitation.

Proportionnalité et validation des blocs :

Chaque citation dans les champs bounding doit contenir exactement 7 mots au début et à la fin, correspondant précisément au texte original. Tu ne dois jamais écrire moins de 7 mots dans chaque partie du bounding, et le bounding doit toujours être séparé par "-->"

Vérification finale :
Avant d'envoyer le JSON final, vérifie que tous les segments du texte sont présents, qu'il n'y a pas de chevauchements ou d'omissions, et que les blocs sont bien structurés hiérarchiquement. Assure-toi que chaque portion du texte est incluse dans la mind map et qu'elle respecte les règles énoncées.

Renvoie-moi le JSON complet, sans autre texte parasite.`;

export default Prompt;
