# trick-engine

Moteur TypeScript pur de CalcTrick. Il résout une opération binaire, génère plusieurs chemins de calcul mental mathématiquement équivalents, estime leur difficulté et les classe du plus simple au plus difficile.

Le package est privé, n’a aucune dépendance d’exécution et ne dépend ni de React ni de Next.js.

## Périmètre actuel

- Addition, soustraction, multiplication et division.
- Entiers, décimaux et nombres signés.
- Saisie texte ou objet TypeScript.
- Réponse directe, solution compacte et explication étape par étape.
- Stratégies dédupliquées et triées par difficulté estimée.
- Erreurs typées pour les entrées invalides et la division par zéro.

Le moteur traite volontairement **une seule opération binaire au P0**. Une expression comme `2 + 3 * 4` est refusée plutôt qu’interprétée de façon ambiguë. L’UI, le mode entraînement et l’historique ne font pas partie de ce package.

## Commandes

Depuis la racine du monorepo :

```bash
npm install
npm test
npm run typecheck
npm run build
```

Ou seulement pour ce workspace :

```bash
npm test --workspace trick-engine
npm run typecheck --workspace trick-engine
npm run build --workspace trick-engine
```

## Utilisation

```ts
import { explainTrick, generateTricks, solve } from "trick-engine";

const analysis = generateTricks("24 x 25");

analysis.answer; // 600
analysis.tricks[0]?.expression; // "6 × 100"
analysis.tricks[0]?.difficulty; // { score: 11.3, level: "easy" }

const compact = explainTrick(analysis.tricks[0]!, "compact");
// 6 × 100 = 600

const detailed = explainTrick(analysis.tricks[0]!, "detailed");
// Diviser par 4, multiplier par 4
// ...
// 1. 24 ÷ 4 = 6 — Divise un facteur.
// 2. 25 × 4 = 100 — Multiplie l’autre par la même valeur.
// 3. 6 × 100 = 600 — ...

solve({ left: 7.5, operator: "÷", right: 0.25 }); // 30
```

Les symboles `*`, `x`, `X`, `×`, `/`, `÷`, `:`, `+` et `-` sont acceptés. Les chaînes acceptent le point ou la virgule décimale, par exemple `"12,5 - 2,5"`.

## Résultat de `generateTricks`

```ts
interface TrickAnalysis {
  calculation: Calculation;
  expression: string;
  answer: number;
  difficulty: Difficulty; // difficulté du calcul direct
  tricks: readonly Trick[];
  metadata: {
    generatedCandidates: number;
    returnedTricks: number;
  };
}
```

Chaque `Trick` contient :

- `rule` : identifiant stable de la stratégie, utile pour les futures statistiques ;
- `expression` : alternative courte à montrer immédiatement ;
- `answer` : résultat final ;
- `difficulty` et `improvement` : score du chemin et gain par rapport au calcul direct ;
- `steps` : opérations atomiques, résultats intermédiaires et explications ;
- `tags` : catégories exploitables par le futur mode entraînement.

Options disponibles :

```ts
generateTricks("24 * 25", {
  maxTricks: 5,
  minimumImprovement: 1,
  includeNonImproving: false,
});
```

Par défaut, seules les stratégies gagnant au moins un point sont renvoyées, avec un maximum de huit résultats. `includeNonImproving: true` est utile pour analyser ou tester l’ensemble des règles.

## Stratégies implémentées

| Opération | Familles de règles | Exemple |
| --- | --- | --- |
| Addition | compensation, double proche, décomposition par valeur de position | `38 + 27 → 40 + 25` |
| Soustraction | gestion du négatif, compensation, arrondi-correction, repère intermédiaire, décomposition | `83 − 29 → 53 + 1` |
| Multiplication | gestion du signe, transfert de facteur, distributivité, différence de carrés | `24 × 25 → 6 × 100` |
| Division | gestion du signe, facteur commun, changement d’échelle, facteurs successifs, quotients partiels | `7,5 ÷ 0,25 → 30 ÷ 1` |

## Organisation du code

```text
src/
├── engine.ts       # orchestration, validation, tri et explications
├── difficulty.ts   # heuristique de coût mental
├── math.ts         # calcul sûr, normalisation et formatage
├── parser.ts       # lecture et normalisation des entrées
├── types.ts        # contrat public et erreurs typées
└── rules/
    ├── addition.ts
    ├── subtraction.ts
    ├── multiplication.ts
    ├── division.ts
    ├── shared.ts   # constructeurs communs d’étapes
    └── types.ts    # contrats internes des règles
```

Le flux est le suivant :

1. `parser.ts` transforme l’entrée en `Calculation` canonique.
2. `math.ts` calcule et normalise la réponse directe.
3. Le fichier de règle correspondant produit des candidats et leurs étapes atomiques.
4. `engine.ts` recalcule chaque étape, écarte toute route dont le dernier résultat n’est pas équivalent, puis déduplique les expressions.
5. `difficulty.ts` additionne le coût mental des étapes et le moteur trie les stratégies.

Le score de difficulté est une **heuristique**, pas une mesure scientifique. Les nombres ronds, petits facteurs, doubles et divisions exactes coûtent moins cher ; les opérations générales avec plusieurs chiffres coûtent davantage. La règle mathématique reste indépendante de ce score, ce qui permet d’ajuster le classement sans modifier les transformations.

## Ajouter une règle

1. Ajouter un générateur dans le fichier de l’opération concernée.
2. Construire chaque étape avec `makeStep` ou `makeAdjustment`.
3. Donner à la règle un identifiant stable comme `multiplication.factor-transfer`.
4. Terminer la liste d’étapes par une opération dont le résultat est la réponse finale : le moteur vérifie cet invariant.
5. Ajouter un test d’exemple dans `tests/rules.test.ts` et, si nécessaire, une valeur à la matrice de `tests/invariants.test.ts`.

## Précision numérique

Le package utilise les nombres JavaScript (`number`) et supprime le bruit flottant courant avec une normalisation à 15 chiffres significatifs : `0.1 + 0.2` renvoie donc `0.3`. Les opérandes et le résultat doivent rester finis. Pour de futurs calculs financiers exacts ou des nombres arbitrairement grands, il faudra introduire un type décimal dédié ; ce n’est pas le besoin du calcul mental P0.
