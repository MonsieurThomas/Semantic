const nestedObjectData = {
  //////////////////////////////Choix 1 //////////////////////////////////////////////////

  bigcategory: {
    category1: {
      subcategory1: {
        item1: "valeur1",
        item2: "valeur2",
        item3: "valeur3",
      },
      subcategory2: {
        item4: "valeur4",
        item5: "valeur5",
        item6: "valeur6",
      },
      subcategory3: {
        item7: "valeur7",
        item8: "valeur8",
        item9: "valeur9",
      },
    },
    category2: {
      subcategory1: {
        item10: "valeur10",
        item11: "valeur11",
      },
      subcategory2: {
        item13: "valeur13",
        item14: "valeur14",
        item15: "valeur15",
      },
      subcategory3: {
        item16: "valeur16",
        item17: "valeur17",
        item18: "valeur18",
      },
    },
    category3: {
      subcategory1: "test",
      // subcategory1: {
      //   item19: "valeur19",
      //   item20: "valeur20",
      //   item21: "valeur21",
      // },
      subcategory2: {
        item22: "valeur22",
        item23: "valeur23",
        item24: "valeur24",
      },
      subcategory3: {
        item25: "valeur25",
        item26: "valeur26",
        item27: "valeur27",
      },
    },
    category4: "test",
  },

  //////////////////////////////// Choix2 //////////////////////////////////////////////////

  // niveau1: {
  //   valeur1: "Valeur au niveau 1",
  //   valeur2: "Valeur au niveau 1",
  //   valeur3: "Valeur au niveau 1",
  //   valeur4: "Valeur au niveau 1",//4
  //   niveau2: {
  //     valeur1: "Valeur au niveau 2",
  //     valeur2: "Valeur au niveau 2",
  //     valeur3: "Valeur au niveau 2",
  //     valeur4: "Valeur au niveau 2",//4
  //     niveau3: {
  //       valeur1: "Valeur au niveau 3",
  //       valeur2: "Valeur au niveau 3",
  //       valeur3: "Valeur au niveau 3",
  //       valeur4: "Valeur au niveau 3", //4
  //       niveau4: {
  //         valeur1: "Valeur au niveau 4",
  //         valeur2: "Valeur au niveau 4",
  //         valeur3: "Valeur au niveau 4",
  //         valeur4: "Valeur au niveau 4", //4
  //       }
  //     }
  //   }
  // }

  //////////////////////////////// Choix3 //////////////////////////////////////////////////

  // category1: {
  //   subcategory1: {
  //     item1: "valeur1",
  //     item2: "valeur2",
  //     item3: "valeur3",
  //   },
  //   subcategory3: "test",
  //   subcategory2: {
  //     item4: "valeur4",
  //     item5: "valeur5",
  //     item6: "valeur6",
  //   },
  // },

  //////////////////////////////// Choix4 //////////////////////////////////////////////////

  // category1: {
  //   subcategory1: "1",
  //   subcategory2: "2",
  // },
  // };
  // export default nestedObjectData;

  // const nestedObjectData = {
  // // "titre": "La Blockchain d'Entreprise",
  // "La Blockchain d'Entreprise": {
  //   Introduction: {
  //     titre: "Introduction",
  //     "niveau inférieur": {
  //       "Enjeux de confiance": {
  //         titre: "Enjeux de confiance",
  //         "niveau inférieur": {
  //           "Protection des données et confiance (Bloc 0:0-255)": {
  //             titre: "Protection des données et confiance (Bloc 0:0-255)",
  //             Bloc: "Introduction —> actuel, étant donné la.",
  //           },
  //           "Problématiques des entreprises (Bloc 256-533)": {
  //             titre: "Problématiques des entreprises (Bloc 256-533)",
  //             Bloc: "multiplicité des identificateurs —> B2C).",
  //           },
  //         },
  //       },
  //     },
  //   },
  //   "Blockchain: Historique et Évolution": {
  //     titre: "Blockchain: Historique et Évolution",
  //     "niveau inférieur": {
  //       "Origines de la Blockchain": {
  //         titre: "Origines de la Blockchain",
  //         "niveau inférieur": {
  //           "Début de la technologie blockchain (Bloc 534-1033)": {
  //             titre: "Début de la technologie blockchain (Bloc 534-1033)",
  //             Bloc: "1. Rappel : un petit —> sans aucune autorité centrale.",
  //           },
  //           "Bitcoin et décentralisation (Bloc 1034-1402)": {
  //             titre: "Bitcoin et décentralisation (Bloc 1034-1402)",
  //             Bloc: "Alors que la blockchain du Bitcoin —> stockant les bitcoins des abonnés),",
  //           },
  //         },
  //       },
  //       "Blockchain Programmable": {
  //         titre: "Blockchain Programmable",
  //         "niveau inférieur": {
  //           "Introduction des Smart Contracts (Bloc 1403-2170)": {
  //             titre: "Introduction des Smart Contracts (Bloc 1403-2170)",
  //             Bloc: "de nouvelles Blockchains, inspirées —> Algorand, etc.",
  //           },
  //           "Blockchains non-permissionnées (Bloc 2171-2691)": {
  //             titre: "Blockchains non-permissionnées (Bloc 2171-2691)",
  //             Bloc: "Toutes ces blockchains —> et lus par tous.",
  //           },
  //         },
  //       },
  //       "Réticences et Barrières": {
  //         titre: "Réticences et Barrières",
  //         "niveau inférieur": {
  //           "Barrières des blockchains publiques (Bloc 2692-3428)": {
  //             titre: "Barrières des blockchains publiques (Bloc 2692-3428)",
  //             Bloc: "Malgré le succès spectaculaire —> responsable diffuse et indéterminée).",
  //           },
  //         },
  //       },
  //     },
  //   },
  //   "Blockchain d'Entreprise": {
  //     titre: "Blockchain d'Entreprise",
  //     "niveau inférieur": {
  //       "Blockchain Permissionnée": {
  //         titre: "Blockchain Permissionnée",
  //         "niveau inférieur": {
  //           "Définition et accès contrôlé (Bloc 3429-4140)": {
  //             titre: "Définition et accès contrôlé (Bloc 3429-4140)",
  //             Bloc: "Ces facteurs ont fait émerger —> gérée par la société R3),",
  //           },
  //           "Exemples notoires (Bloc 4141-4420)": {
  //             titre: "Exemples notoires (Bloc 4141-4420)",
  //             Bloc: "et plus récemment Hyperledger —> consommation d’énergie.",
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
};

export default nestedObjectData;
