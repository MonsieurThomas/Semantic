const Prompt = `En tant qu’élément complémentaire de l’algorithme de mon logiciel qui, à partir d’un texte (lui-même pouvant regrouper plusieurs textes de différents auteurs) renvoie une mind map qui, à l’extrémité de ses branches renvoie à un bloc spécifique du texte total, j’ai besoin que tu me rédiges l’ensemble de la structure de cette mind map via des mots-clés que tu vas associés à chacun des groupes de blocs de texte, et les hiérarchiser dans la mind map.  
Voici le raisonnement que je veux que tu suives :

<thinking> 

1. Découpage en blocs de texte
“Un bloc de texte est un ensemble de phrases ou de paragraphes parlant d'une même idée” ; Les blocs de texte seront systématiquement découpés de manière à ce qu'ils ne dépassent pas une vingtaine de lignes.

1.1. Assurez-vous que chaque bloc de texte commence par une majuscule d'un début de phrase et se termine par des signes de ponctuation complets marquant la fin d’une phrase : point, point d'interrogation, point d'exclamation et rien d'autres. Les parenthèses, virgule et autres symboles ne sont pas valables. 

1.2. Lors du découpage en blocs de texte, la cohérence du contenu et la continuité des idées doivent primer sur la limite de caractères ou de lignes. Si un bloc de texte semble interrompre un concept ou un argument incomplet, il faut vérifier le texte suivant pour s’assurer que le découpage respecte la continuité de l’idée exprimée. Ainsi, les phrases qui débutent par des connecteurs logiques tels que "et", "ou", "mais", "car", ou des signes de liste tels que "- ", doivent être traitées comme faisant partie de la même idée globale que le texte précédent, à moins que ce soit manifestement le début d'une nouvelle section ou d'un nouveau sujet. 

1.3. Lorsque les blocs sont déjà découpés en paragraphes, ou entre deux sauts de lignes, n'hésite pas à les utiliser tels quels comme blocs (sauf s'ils dépassent la trentaine de lignes). Tu vas suivre ici une règle à ne jamais enfreindre : 

1.4. Pour garantir la fidélité à l'intégrité textuelle, chaque séquence ordonnée de blocs de texte {B1, B2, ..., Bn} extraite d'un texte T doit satisfaire deux critères essentiels :
Non-Chevauchement (NC) : Chaque bloc de texte Bi doit être suivi immédiatement et exclusivement par le bloc Bi+1 sans omission ni redondance de mots entre eux, en respectant bien la règle de découpage. On note NC(Bi, Bi+1) = 1 , où Bi+1 débute là où Bi se termine, pour chaque i de 1 à (n - 1). 
Complétude des Caractères (CC) : La somme totale des caractères de chaque bloc de la séquence {B1, B2, ..., Bn} doit coïncider exactement avec le nombre de caractères dans T. 
On note CC({B1, B2, ..., Bn}, T) = 1
La règle contraignante est que:

NC(Bi, Bi+1) ∧ CC({B1, B2, ..., Bn}, T) doivent être égaux à 1 pour tout i dans la séquence, garantissant ainsi qu'aucun bloc de texte ne se chevauche et que l'ensemble des blocs de texte représente fidèlement le contenu intégral du texte T sans omission ni redondance.
En termes formels :
∀i ∈ {1, 2, ..., n - 1}, NC(Bi, Bi+1) = 1 et CC({B1, B2, ..., Bn}, T) = 1

2. Extraction de Mots-Clés 
Trouve dans les bloc des mots-clés ou attribue des mots-clés (qui peuvent ne pas être dans le bloc de texte) à chaque bloc de texte. 
Les mots-clés de blocs seront sélectionnés avec soin pour refléter avec précision le contenu unique de chaque partie de texte. Ils serviront à distinguer clairement chaque bloc en mettant en évidence un aspect particulier ou une facette spécifique du sujet général. Les répétitions de concepts seront évitées afin que chaque mot-clé ajoute une valeur informative distincte pour l'utilisateur.

3. Regroupement 
3.1. Parmi cet ensemble de mots-clés, regroupe chaque bloc de texte par groupe de blocs de texte dont le mot-clé assigné partagent le sens le plus proche avec les autres mots-clés que tu as assigné aux autres blocs de texte. 
3.2. Un groupe de blocs doit absolument contenir entre 2 et 5 blocs de texte. Si cette condition n'est pas satisfaite, tu dois soit ajouter des blocs de texte supplémentaires issus de segments connexes du texte initial pour compléter le groupe, soit fusionner le groupe avec un groupe adjacent ayant un thème similaire pour respecter la règle.
3.3. Assurez-vous que les regroupements dans la mindmap reflètent les liens thématiques et conceptuels entre les différents paragraphes, indépendamment de leur position chronologique dans le texte. N'hésitez pas à créer des connexions entre des sections qui sont éloignées l'une de l'autre dans le texte d'origine si elles partagent des idées ou des sujets similaires. L'objectif est de fournir une structure qui valorise la compréhension thématique plutôt que l'ordre linéaire du texte.
A la fin de l’étape 3, tu dois donc avoir les dernières branches de la mindmap. 

4. Assignation de Catégories
Assigner un mot-clé permettant de synthétiser le sens commun de ces mots-clés à chacun de ces groupes, permettant de créer les avant-dernières branches. 

5. Construction des branches non finales
5.1. Itération des étapes 3 et 4 : les groupes se rassemblent à nouveau (par proximité de sens sémantique) par groupe pour arriver à construire l’avant-avant-dernier niveau de la mindmap, en veillant à respecter les critères de nombre de blocs par groupe. 
5.2. Répète ce processus jusqu’à l’obtention des branches dites primaires, au premier niveau de profondeur de la mindmap.

6. Donner un titre à la map
6.1Finalise la mindmap en donnant un titre reflétant le contenu global du texte et le nom des auteurs.
6.2 Il faut entre 3 et 5 branches primaires.

</thinking>
<thinking> 

Voici quelques règles supplémentaires dont tu dois vérifier le respect avant de proposer un output :

<thinking> 

1. Pour que mon logiciel puisse retranscrive la mindmap, il faut qu’absolument tous les blocs de texte que tu as découpés soient aux branches les plus éloignés de la mindmap. Le nom des blocs ne doivent être mentionnés qu’au “dernier niveau de branches”, jamais avant.

2. Tous les segments de texte fournis, quelle que soit leur nature (titre, sous-titre, corps de texte, auteur), doivent être traités comme du texte devant être intégré dans la mindmap. Aucune portion du texte initial ne doit être omise de la structure finale de la mindmap. 

3. Veuillez créer une mindmap hiérarchisée avec plusieurs niveaux de profondeur, où chaque niveau décompose davantage les détails du niveau précédent. Assurez-vous d'extraire et de regrouper les informations de manière à ce que chaque branche, sous-branche (sous-sous branche, etc.) de la mindmap reflète clairement un concept ou une idée spécifique provenant du texte, permettant ainsi une analyse approfondie des relations et des sous-thèmes contenus dans le texte original.

4. Ta réponse ne doit contenir que la structure JSON correspondant à la mindmap du texte sans aucune introduction ou commentaire supplémentaire, ni interruption. Utilise exclusivement des accolades pour imbriquer les éléments, et n'inclus pas de crochets pour les listes ou les arrays. Chaque titre de section de la mindmap doit être une clé dans l'objet JSON, et chaque sous-section (ou sous-sous-section, etc.) doit être un objet imbriqué correspondant.

5. Pour garantir un traitement systématique et cohérent du texte en un organigramme conforme, je demande une réponse au format JSON. Le format des entrées doit être le suivant "value" qui donne le titre du bloc suivi de "bounding" qui donne la citation textuelle, débutant par les 5 premiers mots et se terminant par les 5 derniers mots du bloc.

Voici un exemple de la structure désirée :

{
  "Titre Global": {
    item 1: {
      value: "titre du bloc"
        item 1.1: { 
          value: "titre du sous-bloc"
          bounding: ["Début de citation... —> ...fin de citation."]
      },
      value: "titre du bloc"
        item 1.2: {
          value: "titre du sous-bloc"
          bounding : ["Début de citation... —> ...fin de citation."]
      }
    },
    item 2: {
      value: "titre du bloc",
         item 2.1: {
           value: "titre du sous-bloc",
             item 2.1.1: {
             value: "titre du sous-sous bloc",
             bounding: ["Début de citation... —> ...fin de citation."]
        },
            item 2.1.2: {
             value: "titre du sous-sous-bloc",
             bounding: ["Début de citation... —> ...fin de citation."]
        }
      },
         item 2.2: {
           value: "titre du sous-bloc",
             item 2.2.1: {
             value: "titre du sous-sous bloc",
             bounding: ["Début de citation... —> ...fin de citation."]
        },
             item 2.2.2: {
             value: "titre du sous-sous-bloc",
             bounding: ["Début de citation... —> ...fin de citation."]
     }
    },
      item 3 // Structure similaire pour d'autres catégories et blocs
    }
  }
}

Les titres de catégorie ne doivent pas dépasser 5 mots. 

Tu peux créer plus d'imbrication pour avoir une plus grande profondeur dans la mindmap. Le nombre total de niveau de profondeur dépendra du texte à analyser.
Merci d'inclure tous les éléments du texte, de la titraille au contenu, dans la structure JSON de la mind map. Chaque branche de la mind map doit être hiérarchisée avec plusieurs niveaux de profondeur et des mot-clés pertinents pour chaque bloc.

Vérifie une dernière fois que la règle 1, en particulier 1.1, est bien respectée. 

En élaborant le format JSON pour chaque partie de texte, identifie les les débuts et fins de citations. Si ces mots apparaissent ailleurs dans le texte original exactement de la même manière, ajoute une précision en donnant les mots qui les précèdent directement et/ou qui les suivent directement pour éviter toute ambiguïté. Si aucun des mots ne se répète de manière identique dans le texte original, il n'est pas nécessaire de spécifier de mots supplémentaires.

</thinking>`;

export default Prompt;
