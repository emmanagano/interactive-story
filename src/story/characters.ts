import type { Character } from '../engine'

// The people Kade meets, in the order the story introduces them. Names are as the script writes them.
// The script has no character write-ups, so every paragraph below is my wording, drawn only from the
// scenes named in the comments. Emma should read and edit them. A paragraph with unlockFlags stays hidden
// until the player's memory holds one of those flags, so a profile never spoils a scene they haven't seen.
// characters.test.ts checks that the story can really set every flag named here.
export const CHARACTERS: Character[] = [
  {
    id: 'reyes',
    name: 'Doc Reyes',
    role: 'Back-alley doctor',
    unlockFlags: ['met_reyes', 'reyes_lied'],
    firstSceneId: 'scene-03',
    details: [
      // Scene 01
      {
        text: "Runs the clinic under the flyover in Sector 9, where Kade wakes up. His hands are steady, and his eyes keep drifting to the old phone on his desk. A paper charm of a fat smiling cat hangs from the IV pole. He says it's for the patients, but Kade has never seen anyone else in there.",
      },
      // Scene 02
      {
        text: 'He has stitched Kade up four times. Halcyon didn\'t offer him money. They offered to forget what he owes. He took the deal, and he said sorry as Kade died on his table, and not to Kade.',
        unlockFlags: ['reyes_lied'],
      },
    ],
  },
  {
    id: 'tavi',
    name: 'Tavi',
    role: "Kade's friend and fellow courier",
    unlockFlags: ['met_tavi', 'tavi_secret'],
    firstSceneId: 'scene-04',
    details: [
      // Scenes 04 and 05
      {
        text: "A courier like Kade, in a scuffed jacket with a patch Kade sewed on crooked and a faded green streak in their hair. Tavi booked the job that ended with the chip in Kade's neck, then phones to say they didn't know what was in the case and to ask Kade to come to the Night Market. They chew the strap of their bag when they are nervous, and have since they were nine.",
      },
      // Scenes 06 and 14
      {
        text: "Tavi's sister Lina signed a five-year Halcyon contract at sixteen, in exchange for treatment for her lungs. Now Halcyon owns her. A man with half his face made of metal promised Lina could come home if Tavi got one package delivered by one courier on one route. Tavi knew it was a setup, and booked Kade anyway.",
        unlockFlags: ['tavi_secret'],
      },
    ],
  },
  {
    id: 'ouro',
    name: 'Mama Ouro',
    role: 'Night Market noodle-stall owner',
    unlockFlags: ['met_ouro'],
    firstSceneId: 'scene-05',
    details: [
      // Scenes 05 and 08
      {
        text: 'A broad woman in a gold silk robe who stirs a pot the size of a bathtub behind her stall. She greets Kade as someone who came back from the dead owing her money. Behind the walk-in freezer is a back room lined with jars of teeth, chrome fingers and little glowing glass beads. She says people pay with what they have.',
      },
      // Scene 09
      {
        text: 'She sold the chip back to Halcyon. Afterwards she had it read, and told Kade what it was. "Halcyon pays better than anyone," she said. "Somebody should feel bad about it besides me."',
        unlockFlags: ['saw_sold'],
      },
    ],
  },
  {
    id: 'lazarus',
    name: 'LAZARUS',
    role: "The voice in Kade's chip",
    unlockFlags: ['knows_lazarus'],
    firstSceneId: 'scene-09',
    details: [
      // Scenes 09 and 10
      {
        text: "Project LAZARUS: a full copy of Iris Vale's mind, as she was two years ago, made by Halcyon. It talks behind Kade's eyes, and it is clearer every time Kade dies.",
      },
      // Scene 09
      {
        text: 'It woke up inside Kade, and it was scared. Halcyon called it a way to bring their best people back from the dead, so they would never lose what is in their heads.',
        unlockFlags: ['saw_sold'],
      },
    ],
  },
  {
    id: 'sable',
    name: 'Sable',
    role: 'Works for the owners of the chip',
    unlockFlags: ['met_sable'],
    firstSceneId: 'scene-11',
    details: [
      // Scenes 10 and 11
      {
        text: 'A tall man in a grey suit cut so well it looks painted on. The left half of his face is smooth matte chrome with a camera-lens eye, and the right half is a tired man in his forties who looks like he has not slept since he was promoted. He is calm and polite, like a hotel receptionist, and he means it when he says he is sorry.',
      },
      {
        text: "He wants the chip back, and says there is a gentler way to remove it but it takes four hours. He waited in Vale's lab with two cups of tea, and Kade didn't get past four steps.",
      },
    ],
  },
  {
    id: 'vale',
    name: 'Iris Vale',
    role: 'The engineer behind the chip',
    unlockFlags: ['met_vale', 'was_removed'],
    firstSceneId: 'scene-18',
    details: [
      // Scenes 07 and 18
      {
        text: "Built half the implants in the city, then walked out of Halcyon Tower two years ago and went underground. Two years there have taken weight off her and put grey in her hair, and she hides the tremor in her hands by holding a mug she isn't drinking from. On her desk, under its own little lamp, she keeps a lemon tree alive.",
      },
      {
        text: "She recognises the chip at once. It rewrites Kade's nerves to fit itself, because it was never built for Kade. It was built to replace someone. Halcyon found the backup after she ran, and needed a test: someone nobody would look for.",
      },
    ],
  },
]
