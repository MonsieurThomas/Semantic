const apiResponse = [
    {
        role: 'title',
        content: "36 - La Blockchain d'Entreprise",
        boundingRegions: [ { pageNumber: 1, polygon: [Array] } ],
        spans: [ { offset: 0, length: 31 } ]
      },
      {
        content: 'Par Najah Naffah',
        boundingRegions: [ { pageNumber: 1, polygon: [Array] } ],
        spans: [ { offset: 32, length: 16 } ]
      },
      {
        role: 'sectionHeading',
        content: 'Introduction',
        boundingRegions: [ { pageNumber: 1, polygon: [Array] } ],
        spans: [ { offset: 49, length: 12 } ]
      },
      {
        content: "Au-delà des problèmes connus du domaine de la cybersécurité, où le principal objectif est de protéger les données sensibles ainsi que les infrastructures qui hébergent et traitent ces données, établir la confiance dans les transactions que nous effectuons dans le monde physique et numérique devient de plus en plus un grand défi pour les concepteurs des systèmes d'information. Avoir confiance dans une identité présentée lors d'une commande en ligne, ou d'une soumission de dossier de prêt ou d'ouverture de compte bancaire, est un grand défi dans notre monde actuel, étant donné la multiplicité des identificateurs fournis par les opérateurs des réseaux sociaux, et des grands opérateurs des services publics. Obtenir des garanties sur l'authenticité de la source des produits que nous consommons tous les jours, ou de l'information que nous lisons, devient de plus en plus un besoin vital pour continuer à interagir en toute confiance avec les services qui nous sont proposés. La technologie de la Blockchain sert à bâtir cette confiance à l'aide d'une nouvelle génération d'applications décentralisées. Dans ce document, nous nous focalisons sur les problèmes de confiance auxquels sont confrontés les entreprises et leurs écosystèmes, regroupant partenaires et consommateurs (B2B et B2C).",
        boundingRegions: [ { pageNumber: 1, polygon: [Array] } ],
        spans: [ { offset: 62, length: 1294 } ]
      },
      {
        role: 'sectionHeading',
        content: "1.Rappel : un petit peu d'histoire",
        boundingRegions: [ { pageNumber: 1, polygon: [Array] } ],
        spans: [ { offset: 1357, length: 34 } ]
      },
      {
        content: "La technologie blockchain a démarré avec la plateforme de cryptomonnaie Bitcoin en janvier 2009, qui était bâtie sur une base de données décentralisée et une architecture peer-to-peer, permettant aux utilisateurs d'échanger directement des transactions signées, sans aucun intermédiaire. La blockchain du Bitcoin a fonctionné depuis plus de 12 ans sans faille au niveau de la sécurité, et a illustré la puissance du concept de décentralisation, tout en créant une nouvelle cryptomonnaie par un logiciel contrôlé d'une façon communautaire sans aucune autorité centrale.",
        boundingRegions: [ { pageNumber: 1, polygon: [Array] } ],
        spans: [ { offset: 1392, length: 568 } ]
      },
      {
        content: 'Alors que la blockchain du Bitcoin est centrée sur une application financière',
        boundingRegions: [ { pageNumber: 1, polygon: [Array] } ],
        spans: [ { offset: 1961, length: 77 } ]
      },
      {
        content: "(offrant des fonctionnalités de paiement entre abonnés et de coffre stockant les bitcoins des abonnés), de nouvelles Blockchains, inspirées de celle du Bitcoin, ont émergé en y ajoutant de nouveaux concepts, tels que les Smart Contracts, pour les rendre programmables. Ce qui a permis de développer des nouvelles applications dans divers domaines (traçabilité et certification des produits dans tous les secteurs : agriculture, chaîne alimentaire, industrie du luxe, sécurité et gestion d'identité applicable également dans différents métiers comme le recrutement, les services administratifs, la mobilité). Ethereum a été la 1ère Blockchain à ouvrir la voie des réseaux programmables, et elle a été suivie par EOS, Tezos, Polkadot, Solana, Algorand, etc.",
        boundingRegions: [ { pageNumber: 1, polygon: [Array] } ],
        spans: [ { offset: 2039, length: 755 } ]
      },
      {
        content: "Toutes ces blockchains sont non-permissionnées (et qualifiées souvent de publiques), ce qui veut dire que n'importe quel individu peut télécharger le logiciel diffusé en mode libre, sans aucune permission, et fonctionner comme un nœud du réseau de blockchain (en jouant le rôle de diffuseur de transactions et/ou le rôle de mineur/valideur). Par ailleurs, l'accès à ce réseau pour développer ou utiliser les applications est en général ouvert à tous. Toutes les transactions sont transparentes et donc visibles par tous, et tous les smart contracts déployés sur la blockchain sont lus par tous.",
        boundingRegions: [ { pageNumber: 1, polygon: [Array] } ],
        spans: [ { offset: 2795, length: 594 } ]
      },
      {
        content: "Malgré le succès spectaculaire de ces blockchains depuis juillet 2015, date du lancement d'Ethereum, les entreprises ont hésité à adopter cette approche non-permissionnée. De nombreuses barrières ont été citées. Elles sont technologiques (scalabilité limitée et faible vitesse de traitement de transaction due aux protocoles de consensus), opérationnelles (confidentialité de données et des transactions, coût imprévisible dû à la gestion du gas, divulgation de code stratégique) et légales (conformité au RGPD, localisation des données, responsabilité diffuse et indéterminée).",
        boundingRegions: [ { pageNumber: 2, polygon: [Array] } ],
        spans: [ { offset: 3390, length: 578 } ]
      },
      {
        content: "Ces facteurs ont fait émerger un nouveau type de blockchain qualifiée de permissionnée, où chaque nœud du réseau est installé après une procédure d'Onboarding définie dans le cadre d'une gouvernance stricte adoptée par l'écosystème de participants. Trois exemples dans cette catégorie ont atteint une certaine notoriété : Hyperledger Fabric (lancée en décembre 2015, open source et ayant comme principal contributeur IBM) et Corda (lancée en 2016, open source, orientée vers les institutions financières.et gérée par la société R3), et plus récemment Hyperledger Besu sur la base d'Ethereum.",
        boundingRegions: [ { pageNumber: 2, polygon: [Array] } ],
        spans: [ { offset: 3969, length: 591 } ]
      },
      {
        content: "À l'opposé de blockchains qui ne fonctionnent qu'en un seul mode, non permissionné, ou permissionné (Hyperledger Fabric, Corda), la plateforme Ethereum peut être déployée dans les deux modes. Les avantages de cette version Entreprise sont doubles : rapidité d'exécution des transactions, et adoption de protocoles de consensus simples, nécessitant moins de puissance de calcul et de consommation d'énergie.",
        boundingRegions: [ { pageNumber: 2, polygon: [Array] } ],
        spans: [ { offset: 4561, length: 406 } ]
      },
      {
        role: 'sectionHeading',
        content: "2. Le marché global de la blockchain d'entreprise",
        boundingRegions: [ { pageNumber: 2, polygon: [Array] } ],
        spans: [ { offset: 4968, length: 49 } ]
      },
      {
        content: "Pour donner une perspective du marché de la valeur générée par la blockchain, nous nous basons sur les analyses effectuées par Gartner, ainsi que les rapports de l'Union Européenne, et d'autres organisations mondiales comme l'OCDE, la EWF (Energy Web Foundation), MOBI (alliance blockchain pour la mobilité) ... .",
        boundingRegions: [ { pageNumber: 2, polygon: [Array] } ],
        spans: [ { offset: 5018, length: 313 } ]
      },
      {
        content: "En particulier, Gartner affiche une valeur générée par la blockchain estimée à 176 Milliards de $ en 2025 et évoluant vers 3.100 Milliards $ en 2030. La segmentation pour laquelle ces chiffres ont été estimés couvre un large spectre de marchés : interne à l'entreprise, inter-entreprises, secteur public et cryptomonnaies. On voit apparaître dans cette étude, une dominance pour le marché inter-entreprises, ce qui s'explique car la blockchain a tout son sens dans des écosystèmes réunissant une large communauté de partenaires qui échangent des transactions. L'argent détenu en cryptomonnaies (digital cash) occupe la 2ème place, sachant qu'il pourrait même se hisser au 1er rang si les stablecoins sont adoptés par tous les États ainsi que des acteurs globaux comme le consortium Libra soutenu par Facebook. Notons aussi que le secteur public est significatif et occupe 18% du marché estimé. .",
        boundingRegions: [ { pageNumber: 2, polygon: [Array] } ],
        spans: [ { offset: 5332, length: 895 } ]
      },
      {
        role: 'sectionHeading',
        content: "Rappel du Bilan des blockchains d'entreprise - avril 2020",
        boundingRegions: [ { pageNumber: 2, polygon: [Array] } ],
        spans: [ { offset: 6228, length: 57 } ]
      },
      {
        content: "Une étude réalisée par Forbes auprès des 50 premières compagnies (valorisées à plus d'un Milliard de $) qui utilisent la Blockchain en production, et montre la technologie utilisée par chacune. On y découvre le positionnement des 3 grandes familles : Hyperledger Fabric (avec 24 cas), Ethereum (22 cas) et Corda.",
        boundingRegions: [ { pageNumber: 2, polygon: [Array] } ],
        spans: [ { offset: 6286, length: 312 } ]
      },
      {
        content: 'BLOCKDATA',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6599, length: 9 } ]
      },
      {
        role: 'title',
        content: '| FORBES BLOCKCHAIN 50 DEVELOPMENT PLATFORMS |',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6609, length: 46 } ]
      },
      {
        role: 'pageNumber',
        content: 'B',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6656, length: 1 } ]
      },
      {
        content: '24',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6658, length: 2 } ]
      },
      {
        content: 'ING AD amazon',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6661, length: 13 } ]
      },
      {
        content: 'Balder',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6675, length: 6 } ]
      },
      {
        content: 'citi',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6682, length: 4 } ]
      },
      {
        content: 'Tencent the',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6687, length: 11 } ]
      },
      {
        content: 'Microsoft p/ Nasdaq Anthem.ag',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6699, length: 29 } ]
      },
      {
        content: '& Santander & UBS Dole',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6729, length: 22 } ]
      },
      {
        content: 'Walmart ><',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6752, length: 10 } ]
      },
      {
        content: 'overstock',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6763, length: 9 } ]
      },
      {
        content: 'Nestlé',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6773, length: 6 } ]
      },
      {
        content: 'Honeywell',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6780, length: 9 } ]
      },
      {
        content: 'HSBC FIGURE',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6790, length: 11 } ]
      },
      {
        content: '22',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6802, length: 2 } ]
      },
      {
        content: 'Santunder',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6805, length: 9 } ]
      },
      {
        content: 'coinbase',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6815, length: 8 } ]
      },
      {
        content: '& UDS',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6824, length: 5 } ]
      },
      {
        content: '@Shell',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6830, length: 6 } ]
      },
      {
        content: 'Foxconn',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6837, length: 7 } ]
      },
      {
        content: 'Google',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6845, length: 6 } ]
      },
      {
        content: 'HSBC LVMH',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6852, length: 9 } ]
      },
      {
        content: 'Microsoft',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6862, length: 9 } ]
      },
      {
        content: 'DAIMLER',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6872, length: 7 } ]
      },
      {
        content: 'INGA T-Mobile-',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6880, length: 14 } ]
      },
      {
        content: 'SAMSUNG',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6895, length: 7 } ]
      },
      {
        content: '11',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6903, length: 2 } ]
      },
      {
        content: ':selected: O AON',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6906, length: 16 } ]
      },
      {
        content: 'DAIMLER',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6923, length: 7 } ]
      },
      {
        content: 'CREDITSUISSE',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6931, length: 12 } ]
      },
      {
        content: ':selected:',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6944, length: 10 } ]
      },
      {
        content: 'ING 90',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6955, length: 6 } ]
      },
      {
        content: 'Draadridge',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6962, length: 10 } ]
      },
      {
        content: 'Microsoft',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6973, length: 9 } ]
      },
      {
        content: '9',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6983, length: 1 } ]
      },
      {
        content: 'BITFURY coinbase',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 6985, length: 16 } ]
      },
      {
        content: 'ING.90',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7002, length: 6 } ]
      },
      {
        content: 'Google',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7009, length: 6 } ]
      },
      {
        content: ':unselected: Like',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7016, length: 17 } ]
      },
      {
        content: 'cverslock',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7034, length: 9 } ]
      },
      {
        content: '7',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7044, length: 1 } ]
      },
      {
        content: 'citi',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7046, length: 4 } ]
      },
      {
        content: 'UBS',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7051, length: 3 } ]
      },
      {
        content: 'Re Brzadridge',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7055, length: 13 } ]
      },
      {
        content: 'ING &D J.PMorgan',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7069, length: 16 } ]
      },
      {
        content: '3',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7086, length: 1 } ]
      },
      {
        content: 'Cripple',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7088, length: 7 } ]
      },
      {
        content: 'coinbase',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7096, length: 8 } ]
      },
      {
        content: '3',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7105, length: 1 } ]
      },
      {
        content: 'pol Nasdas citi',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7107, length: 15 } ]
      },
      {
        content: '2',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7123, length: 1 } ]
      },
      {
        content: 'Cargill',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7125, length: 7 } ]
      },
      {
        content: '2',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7133, length: 1 } ]
      },
      {
        content: 'citi DTCC',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7135, length: 9 } ]
      },
      {
        content: '2',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7145, length: 1 } ]
      },
      {
        content: 'DAIMLER Cargill',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7147, length: 15 } ]
      },
      {
        content: '2',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7163, length: 1 } ]
      },
      {
        content: '28 Broadridge pNasdaq',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7165, length: 21 } ]
      },
      {
        content: 'FABRIC',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7187, length: 6 } ]
      },
      {
        content: 'c·rda',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7194, length: 5 } ]
      },
      {
        content: 'Obitcoin',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7200, length: 8 } ]
      },
      {
        content: 'assembly',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7209, length: 8 } ]
      },
      {
        content: '- SAWTOOTH',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7218, length: 10 } ]
      },
      {
        content: 'XAXONI',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7229, length: 6 } ]
      },
      {
        content: 'DAML',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7236, length: 4 } ]
      },
      {
        content: 'Source: Farbes',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7241, length: 14 } ]
      },
      {
        content: 'WWW.BLOCKDATA.TECH | INFO@BLOCKDATA. TECH',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7256, length: 41 } ]
      },
      {
        content: "Quant aux usages, l'étude de Forbes montre la richesse des applications que permet la blockchain d'entreprise, essentiellement dans le secteur de la finance. On y trouve la tokenisation d'actifs et émission d'obligations, les plateformes de traçabilité, les solutions de dépôts (custody solutions), le développement d'infrastructures blockchain pour les entreprises, le financement du commerce et la gestion d'identités numériques.",
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7298, length: 431 } ]
      },
      {
        role: 'sectionHeading',
        content: 'Business value-add of Blockchain - $176 billion by 2025, $3.1 trillion by 2030',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7730, length: 78 } ]
      },
      {
        content: 'Millions of Dollars',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7809, length: 19 } ]
      },
      {
        content: '1,000,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7829, length: 9 } ]
      },
      {
        content: '900,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7839, length: 7 } ]
      },
      {
        content: '800,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7847, length: 7 } ]
      },
      {
        content: '# Auto-Adjudication = Intracompany',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7855, length: 34 } ]
      },
      {
        content: '= Between Companies . Digital Cash Public Record',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7890, length: 48 } ]
      },
      {
        content: '18%',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7939, length: 3 } ]
      },
      {
        content: '10%',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7943, length: 3 } ]
      },
      {
        content: '700,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7947, length: 7 } ]
      },
      {
        content: '2030',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7955, length: 4 } ]
      },
      {
        content: '28%',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7960, length: 3 } ]
      },
      {
        content: '22%',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7964, length: 3 } ]
      },
      {
        content: '600,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7968, length: 7 } ]
      },
      {
        content: '500,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7976, length: 7 } ]
      },
      {
        content: '22%',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7984, length: 3 } ]
      },
      {
        content: '400,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7988, length: 7 } ]
      },
      {
        content: '300,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 7996, length: 7 } ]
      },
      {
        content: '200,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8004, length: 7 } ]
      },
      {
        content: '100,000',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8012, length: 7 } ]
      },
      {
        content: '0',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8020, length: 1 } ]
      },
      {
        content: '2025',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8022, length: 4 } ]
      },
      {
        content: '2026',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8027, length: 4 } ]
      },
      {
        content: '2027',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8032, length: 4 } ]
      },
      {
        content: '2028',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8037, length: 4 } ]
      },
      {
        content: 'Source: Forecast: Blockchain Business Value, Worldwide, 2017-2030',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8042, length: 65 } ]
      },
      {
        content: '2029',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8108, length: 4 } ]
      },
      {
        content: '2030 @2017 Gartner, Inc',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8113, length: 23 } ]
      },
      {
        role: 'sectionHeading',
        content: 'Gartner.',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8137, length: 8 } ]
      },
      {
        role: 'sectionHeading',
        content: "3.Les bénéfices attendus de la Blockchain d'Entreprise",
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8146, length: 54 } ]
      },
      {
        content: 'Ils se résument par les apports suivants :',
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8201, length: 42 } ]
      },
      {
        content: "1. Optimisation des processus métier, par l'automatisation de certaines tâches, la minimisation des cas de litige, et l'authentification des transactions ;",
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8244, length: 155 } ]
      },
      {
        content: "2. Réduction des coûts, résultant de l'élargissement de l'usage du numérique, dans les échanges inter-entreprises et avec les usagers ;",
        boundingRegions: [ { pageNumber: 3, polygon: [Array] } ],
        spans: [ { offset: 8400, length: 135 } ]
      },
      {
        content: "3. Amélioration du parcours citoyen ou de l'expérience utilisateur, lors des interactions avec un futur employeur, un organisme public, ou une entreprise privée (site e-commerce) ;",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 8582, length: 180 } ]
      },
      {
        content: "4. Maîtrise et protection des informations personnelles - qui seront sous contrôle de l'utilisateur et hébergés dans son portefeuille digital (Wallet) personnel ou dans un data-hub partagé et sécurisé ;",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 8763, length: 202 } ]
      },
      {
        content: "5. Meilleure empreinte carbone, par l'élimination du papier dans les transactions diverses ;",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 8966, length: 92 } ]
      },
      {
        content: "6. Augmentation de la confiance dans les services de l'État, et les services privés ;",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 9059, length: 85 } ]
      },
      {
        content: "7. Lutte contre la fraude à l'aide de mécanismes de traçabilité fiable de la source à la consommation ou à la conclusion d'un processus de décision.",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 9145, length: 148 } ]
      },
      {
        content: "Ces bénéfices sont réalisables grâce à : une méthodologie de déploiement rapide, une intégration avec l'existant, la garantie de l'évolutivité, l'interopérabilité entre blockchains, la mutualisation des investissements autour du même réseau, le transfert du savoir-faire, la définition et la mise en œuvre d'une gouvernance sur mesure et l'introduction d'un modèle économique novateur sur la base de la tokenisation.",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 9294, length: 416 } ]
      },
      {
        content: "Au-delà de la technologie, la réussite de Blockchain d'entreprise passe par l'adoption d'une gouvernance adaptée et d'un modèle économique viable.",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 9711, length: 146 } ]
      },
      {
        content: 'Gouvernance - où la question essentielle est : quelle gouvernance pour un consortium constitué de membres qui peuvent être partenaires et/ou concurrents ? Le défi est de clairement définir les rôles opérationnels (ex. valideurs de nœuds qui doivent travailler sans collusion et sans influence externe. Leur nombre devra être suffisant pour éliminer toute centralisation qui remettrait en cause le principe fondateur de la Blockchain qui est la décentralisation), techniques (support et administration de la plateforme), et stratégiques (orientation, extension, ouverture à de nouveaux membres, validation de modèles économiques, investissement).',
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 9858, length: 645 } ]
      },
      {
        content: "Modèle économique - à l'heure actuelle, la plupart des projets Blockchain, même ceux qui sont en production, ont adopté un modèle économique expérimental. Le ROI de ces projets n'est pas encore palpable. Néanmoins les efforts se poursuivent pour expérimenter, résoudre les challenges et identifier les risques. Dans un tel contexte, il est intéressant d'approfondir un modèle économique à base de Tokens (FT et NFT) pour les différents cas d'usage développés. Par exemple, un titre de propriété sera représenté par un NFT. Ce titre pouvant être vendu et en échange obtenir un volume de FTs. L'exploitation des différents services proposés par les applications pourraient aussi être associés à des Tokens fongibles.",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 10504, length: 714 } ]
      },
      {
        role: 'sectionHeading',
        content: '4.Perspectives',
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 11219, length: 14 } ]
      },
      {
        content: "Au vu des évolutions technologiques et de différents scénarios de blockchains publiques et privées, la plupart des analystes prévoient l'existence d'une multiplicité de Blockchains dans le futur. Le challenge pour une entreprise est de déployer en rejoignant une ou plusieurs blockchains privées selon l'application collaborative de l'écosystème dans lequel elle est membre, tout en sollicitant pour certains services des Blockchains publiques, car chacune présente un intérêt qui lui est spécifique, et qui apporte de la valeur à l'entreprise.",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 11234, length: 544 } ]
      },
      {
        content: "Najah NAFFAH est CEO de Blockchain Secure, start-up focalisée sur la conception de solutions décentralisées et bénéficiant des futures technologies quantiques pour améliorer la sécurisation et l'optimisation des performances.",
        boundingRegions: [ { pageNumber: 4, polygon: [Array] } ],
        spans: [ { offset: 11779, length: 225 } ]
      },
      {
        content: 'Page 3 début de tab',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12005, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12025, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12045, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12065, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12085, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12105, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12125, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12145, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12165, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12185, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12205, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12225, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12245, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12265, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12285, length: 19 } ]
      },
      {
        content: 'Ceci est un tableau',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12305, length: 19 } ]
      },
      {
        content: 'Page 3 fin de tab',
        boundingRegions: [ { pageNumber: 5, polygon: [Array] } ],
        spans: [ { offset: 12325, length: 17 } ]
      }
]

export default apiResponse;