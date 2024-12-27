import React from "react";

const PolitiqueDeConfidentialite = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 gap-10 2xl:mt-[80px] bg-[#F2F2F2] px-6">
      <div className="w-full max-w-[800px] bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-[#14213D] mb-6">
          Politique de Confidentialité
        </h1>
        <p className="text-sm text-[#666] mb-4">
          Dernière mise à jour : <strong>02/02/2024</strong>
        </p>
        <p className="mb-6">
          La société <strong>Semantic Groupe</strong> (ci-après
          &quot;nous&quot;, &quot;notre&quot; ou &quot;nos&quot;) attache une
          importance particulière à la protection des données personnelles de
          ses utilisateurs (ci-après &quot;vous&quot;, &quot;votre&quot;,
          &quot;vos&quot;). La présente politique de confidentialité a pour
          objet de vous informer de manière claire, transparente et précise sur
          la manière dont nous collectons, utilisons, protégeons et partageons
          vos données personnelles dans le cadre de l’utilisation de notre site
          internet
          <a
            href="https://semantic-epc8.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FCA310] underline"
          >
            https://semantic-epc8.onrender.com
          </a>{" "}
          et des services associés (ci-après les &quot;Services&quot;).
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            1. Responsable du traitement
          </h2>
          <p>Le responsable du traitement des données personnelles est :</p>
          <ul className="list-disc ml-6 mt-4">
            <li>
              <strong>Société :</strong> Semantic Groupe
            </li>
            <li>
              <strong>Adresse :</strong> 105 rue de Longchamp, 92200
              Neuilly-sur-Seine, France
            </li>
            <li>
              <strong>E-mail :</strong>{" "}
              <a
                href="mailto:sprtsemantic@gmail.com"
                className="text-[#FCA310] underline"
              >
                sprtsemantic@gmail.com
              </a>
            </li>
            <li>
              <strong>Représentant légal :</strong> Thomas Criou
            </li>
          </ul>
          <p className="mt-4">
            Pour toute question relative à cette politique ou à l’exercice de
            vos droits, vous pouvez nous contacter aux coordonnées ci-dessus.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            2. Données collectées
          </h2>
          <p>
            Nous collectons des données personnelles dans les cas suivants :
          </p>
          <h3 className="text-lg font-semibold text-[#14213D] mt-6 mb-2">
            1. Données fournies directement par vous :
          </h3>
          <ul className="list-disc ml-6">
            <li>Nom, prénom.</li>
            <li>Adresse e-mail.</li>
            <li>
              Identifiants de connexion (nom d’utilisateur et mot de passe).
            </li>
            <li>
              Documents que vous importez dans les Services (potentiellement
              sensibles selon leur contenu).
            </li>
            <li>
              Données nécessaires aux paiements (fournies via vos transactions
              bancaires ou via nos prestataires de paiement).
            </li>
          </ul>
          <h3 className="text-lg font-semibold text-[#14213D] mt-6 mb-2">
            2. Données collectées automatiquement :
          </h3>
          <ul className="list-disc ml-6">
            <li>Adresse IP.</li>
            <li>Type de navigateur, système d’exploitation.</li>
            <li>
              Données d’utilisation du Service (ex. : historique des mind maps,
              journaux d’activité).
            </li>
          </ul>
          <h3 className="text-lg font-semibold text-[#14213D] mt-6 mb-2">
            Données sensibles :
          </h3>
          <p>
            Nous ne collectons pas intentionnellement de données sensibles.
            Cependant, si vous importez des documents contenant des informations
            sensibles, ces données sont traitées exclusivement par nos
            prestataires techniques <strong>OpenAI</strong> et{" "}
            <strong>Render</strong>, selon leurs garanties de conformité au
            RGPD.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            3. Finalités du traitement
          </h2>
          <p>Vos données personnelles sont utilisées pour :</p>
          <ul className="list-disc ml-6">
            <li>Fournir les Services (création de mind maps interactives).</li>
            <li>
              Gérer votre compte utilisateur et assurer la sécurité des accès.
            </li>
            <li>
              Communiquer avec vous à des fins d’assistance ou d’information.
            </li>
            <li>Assurer le traitement des paiements et la facturation.</li>
            <li>Améliorer nos Services grâce à l’analyse des usages.</li>
            <li>Respecter nos obligations légales et réglementaires.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            4. Durée de conservation des données
          </h2>
          <p>
            Nous conservons vos données uniquement pour la durée strictement
            nécessaire aux finalités décrites ci-dessus :
          </p>
          <ul className="list-disc ml-6 mt-4">
            <li>
              <strong>Données du compte utilisateur :</strong> Conservées
              pendant toute la durée de votre abonnement. En cas de résiliation
              ou de suppression du compte, elles sont automatiquement
              supprimées.
            </li>
            <li>
              <strong>Données des mind maps :</strong> Conservées pendant toute
              la durée de l’abonnement et supprimées en cas de résiliation ou de
              suppression du compte.
            </li>
            <li>
              <strong>Données des documents importés :</strong> Conservées par{" "}
              <strong>OpenAI</strong> pour une durée maximale de 30 jours,
              conformément à leur politique.
            </li>
            <li>
              <strong>Données de navigation :</strong> Stockées temporairement
              (durée de session).
            </li>
            <li>
              <strong>Données financières :</strong> Nous ne stockons aucune
              donnée bancaire. Les transactions sont directement gérées par vos
              banques ou prestataires.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            5. Partage des données
          </h2>
          <p>Vos données personnelles peuvent être partagées avec :</p>
          <h3 className="text-lg font-semibold text-[#14213D] mt-6 mb-2">
            1. Prestataires techniques :
          </h3>
          <ul className="list-disc ml-6">
            <li>
              <strong>Render :</strong> Hébergement sécurisé des données.
            </li>
            <li>
              <strong>OpenAI :</strong> Traitement des documents pour la
              création des mind maps, avec conservation des données pour un
              maximum de 30 jours.
            </li>
          </ul>
          <h3 className="text-lg font-semibold text-[#14213D] mt-6 mb-2">
            2. Autorités compétentes :
          </h3>
          <p>
            En cas d’obligation légale (ex. : demande judiciaire), vos données
            peuvent être partagées avec les autorités compétentes.
          </p>
          <p className="mt-4">
            Nous veillons à ce que nos partenaires respectent des normes
            strictes en matière de sécurité et de confidentialité, conformément
            au RGPD.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            6. Transferts internationaux de données
          </h2>
          <p>
            Certaines données personnelles sont transférées en dehors de l’Union
            Européenne, notamment via <strong>Render</strong> et{" "}
            <strong>OpenAI</strong>.
          </p>
          <ul className="list-disc ml-6 mt-4">
            <li>
              <strong>OpenAI :</strong> Conformité au RGPD assurée par un Data
              Processing Addendum (DPA) et une conservation limitée à 30 jours.
            </li>
            <li>
              <strong>Render :</strong> Certifié SOC 2/3 et respectant les
              normes RGPD de l’Union Européenne.
            </li>
          </ul>
          <p className="mt-4">
            Pour ces transferts, nous appliquons des garanties supplémentaires
            lorsque nécessaire (ex. : clauses contractuelles types).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            7. Sécurité des données
          </h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles
            adaptées pour garantir la sécurité de vos données contre les accès
            non autorisés, pertes ou modifications.
          </p>
          <p className="mt-4">
            Nos partenaires techniques, <strong>Render</strong> et{" "}
            <strong>OpenAI</strong>, assurent la protection des données
            hébergées et traitées sur leurs plateformes (chiffrement des
            données, certifications de sécurité, etc.).
          </p>
          <p className="mt-4">
            En cas d’incident technique ou de violation de données, nous nous
            engageons à rétablir les Services dans les plus brefs délais et à
            vous notifier conformément à la réglementation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            8. Vos droits
          </h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc ml-6 mt-4">
            <li>
              <strong>Droit d’accès :</strong> Obtenir une copie des données
              personnelles vous concernant.
            </li>
            <li>
              <strong>Droit de rectification :</strong> Modifier ou compléter
              vos données inexactes ou incomplètes.
            </li>
            <li>
              <strong>Droit à l’effacement :</strong> Demander la suppression de
              vos données.
            </li>
            <li>
              <strong>Droit d’opposition :</strong> Vous opposer au traitement
              de vos données pour des motifs légitimes.
            </li>
            <li>
              <strong>Droit à la portabilité :</strong> Recevoir vos données
              dans un format structuré pour les transmettre à un tiers.
            </li>
            <li>
              <strong>Droit à la limitation :</strong> Suspendre temporairement
              le traitement de vos données.
            </li>
          </ul>
          <p className="mt-4">
            Pour exercer vos droits, contactez-nous à{" "}
            <a
              href="mailto:sprtsemantic@gmail.com"
              className="text-[#FCA310] underline"
            >
              sprtsemantic@gmail.com
            </a>
            . Nous répondrons à votre demande dans un délai maximum d’un mois.
          </p>
          <p className="mt-4">
            En cas de litige, vous pouvez introduire une réclamation auprès de
            la <strong>CNIL</strong> (3 place de Fontenoy, 75007 Paris).
          </p>
        </section>
        <section className="mb-8">
  <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
    9. Cookies
  </h2>

  <p className="text-[#333] leading-7">
    Lors de l’utilisation du Site, seuls des <strong>cookies strictement nécessaires</strong> sont déposés sur le navigateur de l’Utilisateur. Ces cookies sont essentiels pour assurer le fonctionnement optimal du Site et des services proposés par Semantic.
  </p>

  <h3 className="text-lg font-semibold text-[#14213D] mt-6 mb-2">
    9.1. Finalité des cookies strictement nécessaires
  </h3>
  <p className="text-[#333] leading-7">
    Les cookies strictement nécessaires utilisés par Semantic permettent de :
  </p>
  <ul className="list-disc ml-6 text-[#333] leading-7">
    <li><strong>Assurer la gestion des sessions</strong> : Ces cookies permettent de maintenir la connexion de l’Utilisateur lorsqu’il navigue sur le Site, notamment pour accéder à son espace personnel ou aux fonctionnalités du Service.</li>
    <li><strong>Garantir la sécurité</strong> : Ils contribuent à la sécurisation des transactions et de la navigation sur le Site.</li>
    <li><strong>Faciliter la navigation</strong> : Les cookies assurent une interaction fluide avec les fonctionnalités principales du Site, telles que l’importation de documents ou la génération de mind maps.</li>
  </ul>

  <h3 className="text-lg font-semibold text-[#14213D] mt-6 mb-2">
    9.2. Caractéristiques des cookies strictement nécessaires
  </h3>
  <ul className="list-disc ml-6 text-[#333] leading-7">
    <li>Ces cookies ne collectent pas d’informations personnelles pouvant identifier directement l’Utilisateur au-delà des besoins indispensables au fonctionnement du Site.</li>
    <li>Ils ne sont pas utilisés à des fins de publicité ou d’analyse comportementale.</li>
    <li>Leur durée de conservation est limitée à la session de navigation ou à une période nécessaire au fonctionnement du Site, en conformité avec la législation en vigueur.</li>
  </ul>

  <h3 className="text-lg font-semibold text-[#14213D] mt-6 mb-2">
    9.3. Gestion des cookies par l’Utilisateur
  </h3>
  <p className="text-[#333] leading-7">
    En tant que cookies strictement nécessaires, leur désactivation peut altérer le bon fonctionnement du Site ou rendre certaines fonctionnalités inaccessibles. L’Utilisateur peut néanmoins configurer son navigateur pour bloquer ou supprimer ces cookies, mais il est informé que cette action pourrait affecter son expérience utilisateur.
  </p>
  <p className="text-[#333] leading-7 mt-4">
    Pour plus d’informations sur la gestion des cookies via les paramètres des navigateurs, l’Utilisateur peut consulter les guides spécifiques fournis par les principaux navigateurs (Google Chrome, Firefox, Safari, Edge, etc.).
  </p>

  <h3 className="text-lg font-semibold text-[#14213D] mt-6 mb-2">
    9.4. Protection des données liées aux cookies
  </h3>
  <p className="text-[#333] leading-7">
    Les données collectées via ces cookies sont strictement limitées aux finalités énoncées ci-dessus et ne sont en aucun cas partagées, vendues, ou utilisées à d’autres fins non prévues par Semantic. Ces cookies respectent les normes de sécurité en vigueur et garantissent la confidentialité des informations traitées.
  </p>
</section>


        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            10. Modifications de cette politique
          </h2>
          <p className="text-[#333] leading-7">
            Nous nous réservons le droit de modifier cette politique de
            confidentialité à tout moment, notamment pour nous conformer à des
            évolutions légales ou techniques. Toute mise à jour sera publiée sur
            cette page avec une date de révision visible.
          </p>
          <p className="text-[#333] leading-7 mt-4">
            En cas de changements majeurs, nous vous informerons par e-mail ou
            via une notification sur le site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            11. Contact
          </h2>
          <p className="text-[#333] leading-7">
            Pour toute question relative à cette politique ou à vos données
            personnelles, contactez-nous :
          </p>
          <ul className="list-disc ml-6 mt-4">
            <li>
              <strong>E-mail :</strong>{" "}
              <a
                href="mailto:sprtsemantic@gmail.com"
                className="text-[#FCA310] underline"
              >
                sprtsemantic@gmail.com
              </a>
            </li>
            <li>
              <strong>Adresse :</strong> Semantic Groupe, 105 rue de Longchamp,
              92200 Neuilly-sur-Seine, France
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PolitiqueDeConfidentialite;
