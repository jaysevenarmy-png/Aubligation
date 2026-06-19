import type { Act } from "@/types/game";

export const GAME_ACTS: Act[] = [
  {
    id: "act1",
    title: "Acte I — Troyes",
    location: "Troyes",
    period: "XIe – XVe siècle",
    personalities: ["Rachi de Troyes (1040–1105)", "Thibaut IV de Champagne"],
    description:
      "Plongez dans la capitale de l'Aube, ville des foires de Champagne et berceau d'un érudit légendaire.",
    color: "#7B1F3A",
    riddles: [
      {
        id: "act1-r1",
        type: "mcq",
        question:
          "Rachi de Troyes a rédigé ses commentaires dans quelle langue vernaculaire ?",
        hint: "C'est la langue parlée dans le nord de la France au Moyen Âge.",
        options: [
          { id: "a", label: "Latin", isCorrect: false },
          { id: "b", label: "Langue d'oïl", isCorrect: true },
          { id: "c", label: "Occitan", isCorrect: false },
          { id: "d", label: "Arabe", isCorrect: false },
        ],
        basePoints: 100,
      },
      {
        id: "act1-r2",
        type: "photo",
        question:
          "Quel événement fondateur des Templiers est lié à l'Aube ?",
        photoDescription:
          "Les célèbres colombages de la vieille ville de Troyes",
        hint: "Un concile s'est tenu à Troyes en 1129 pour officialiser cet ordre.",
        correctAnswer: "concile de troyes",
        alternateAnswers: ["le concile de troyes", "concile 1129", "fondation des templiers"],
        basePoints: 100,
      },
      {
        id: "act1-r3",
        type: "text",
        question:
          "En quelle année le Traité de Troyes a-t-il été signé ?",
        hint: "C'est au début du XVe siècle, pendant la guerre de Cent Ans.",
        correctAnswer: "1420",
        basePoints: 150,
      },
    ],
  },
  {
    id: "act2",
    title: "Acte II — Arcis-sur-Aube",
    location: "Arcis-sur-Aube",
    period: "XVIIIe siècle",
    personalities: ["Georges Danton (1759–1794)"],
    description:
      "Découvrez la ville natale de l'un des grands orateurs de la Révolution française.",
    color: "#C9A84C",
    riddles: [
      {
        id: "act2-r1",
        type: "mcq",
        question: "Georges Danton est né à...",
        hint: "C'est une ville de l'Aube, sur les bords de la rivière éponyme.",
        options: [
          { id: "a", label: "Paris", isCorrect: false },
          { id: "b", label: "Reims", isCorrect: false },
          { id: "c", label: "Arcis-sur-Aube", isCorrect: true },
          { id: "d", label: "Bar-sur-Aube", isCorrect: false },
        ],
        basePoints: 100,
      },
      {
        id: "act2-r2",
        type: "text",
        question: "En quelle année Danton a-t-il été guillotiné ?",
        hint: "C'est pendant la Terreur, la même année que Robespierre le fera exécuter.",
        correctAnswer: "1794",
        basePoints: 150,
      },
      {
        id: "act2-r3",
        type: "map",
        question:
          "Cliquez sur Arcis-sur-Aube sur la carte simplifiée de l'Aube.",
        hint: "La ville se trouve au centre du département, sur la rivière Aube.",
        mapTarget: "Arcis-sur-Aube",
        mapTargetCoords: { x: 48, y: 38 },
        basePoints: 120,
      },
    ],
  },
  {
    id: "act3",
    title: "Acte III — Brienne-le-Château",
    location: "Brienne-le-Château",
    period: "XVIIIe – XIXe siècle",
    personalities: ["Napoléon Bonaparte"],
    description:
      "Revivez les années de formation du futur Empereur à l'école militaire de Brienne.",
    color: "#2D5A8E",
    riddles: [
      {
        id: "act3-r1",
        type: "mcq",
        question:
          "En quelle année Napoléon est-il arrivé à l'école militaire de Brienne ?",
        hint: "C'était quelques années après sa naissance en Corse.",
        options: [
          { id: "a", label: "1769", isCorrect: false },
          { id: "b", label: "1779", isCorrect: true },
          { id: "c", label: "1784", isCorrect: false },
          { id: "d", label: "1789", isCorrect: false },
        ],
        basePoints: 100,
      },
      {
        id: "act3-r2",
        type: "text",
        question:
          "Quel nom porta la ville de Brienne en hommage à Napoléon au XIXe siècle ?",
        hint: "La ville prit le nom de l'Empereur pour honorer son séjour.",
        correctAnswer: "Brienne-Napoléon",
        alternateAnswers: ["brienne napoleon", "brienne-napoleon"],
        basePoints: 150,
      },
      {
        id: "act3-r3",
        type: "photo",
        question: "Identifiez ce monument à Brienne.",
        photoDescription: "Un monument emblématique de Brienne-le-Château",
        hint: "C'est un château qui a donné son nom à la ville et accueille aujourd'hui un musée Napoléon.",
        correctAnswer: "château de brienne",
        alternateAnswers: ["le château", "château", "musée napoléon"],
        basePoints: 100,
      },
    ],
  },
  {
    id: "act4",
    title: "Acte IV — Nogent-sur-Seine",
    location: "Nogent-sur-Seine",
    period: "XIXe siècle",
    personalities: ["Gustave Flaubert (lien)", "Camille Claudel"],
    description:
      "Explorez la ville qui inspira Flaubert et vit naître le génie sculptural de Camille Claudel.",
    color: "#3D7A5A",
    riddles: [
      {
        id: "act4-r1",
        type: "mcq",
        question:
          "Quel roman de Flaubert se déroule en partie à Nogent-sur-Seine ?",
        hint: "C'est une histoire de formation sentimentale d'un jeune homme.",
        options: [
          { id: "a", label: "Madame Bovary", isCorrect: false },
          { id: "b", label: "L'Éducation sentimentale", isCorrect: true },
          { id: "c", label: "Salammbô", isCorrect: false },
          { id: "d", label: "Bouvard et Pécuchet", isCorrect: false },
        ],
        basePoints: 100,
      },
      {
        id: "act4-r2",
        type: "text",
        question:
          "À quel âge Camille Claudel a-t-elle commencé à sculpter à Nogent ?",
        hint: "Elle était très jeune, encore enfant, lorsqu'elle découvrit sa passion.",
        correctAnswer: "12",
        alternateAnswers: ["12 ans", "douze", "douze ans"],
        basePoints: 150,
      },
      {
        id: "act4-r3",
        type: "map",
        question: "Cliquez sur Nogent-sur-Seine sur la carte simplifiée de l'Aube.",
        hint: "La ville se trouve à l'ouest du département, sur la Seine.",
        mapTarget: "Nogent-sur-Seine",
        mapTargetCoords: { x: 20, y: 18 },
        basePoints: 120,
      },
    ],
  },
  {
    id: "act5",
    title: "Acte V — Essoyes",
    location: "Essoyes",
    period: "XIXe – XXe siècle",
    personalities: ["Auguste Renoir"],
    description:
      "Terminez votre voyage dans le village de vignerons qui captiva l'œil du grand peintre impressionniste.",
    color: "#8B4513",
    riddles: [
      {
        id: "act5-r1",
        type: "mcq",
        question: "Grâce à qui Renoir a-t-il découvert Essoyes ?",
        hint: "Cette personne était originaire du village et très proche de lui.",
        options: [
          { id: "a", label: "Son ami Monet", isCorrect: false },
          { id: "b", label: "Sa femme Aline Charigot", isCorrect: true },
          { id: "c", label: "Son marchand d'art", isCorrect: false },
          { id: "d", label: "Son fils Pierre", isCorrect: false },
        ],
        basePoints: 100,
      },
      {
        id: "act5-r2",
        type: "text",
        question:
          "En quelle année Renoir a-t-il acheté sa maison à Essoyes ?",
        hint: "C'est dans les dernières années du XIXe siècle.",
        correctAnswer: "1896",
        basePoints: 150,
      },
      {
        id: "act5-r3",
        type: "photo",
        question:
          "Identifiez ce peintre impressionniste lié à l'Aube.",
        photoDescription: "Un peintre impressionniste célèbre dans son atelier",
        hint: "Il a passé de nombreuses années à Essoyes et y est enterré.",
        correctAnswer: "renoir",
        alternateAnswers: ["auguste renoir", "pierre-auguste renoir"],
        basePoints: 100,
      },
    ],
  },
];
