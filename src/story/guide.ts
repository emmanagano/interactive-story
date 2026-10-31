// The summary and ending guide. Everything in ENDING_GUIDE and SECRET_ENDING_PATH is copied from the
// script's "All ten endings" and "Shortest path to Merged" sections (guide.test.ts checks it word for
// word). STORY_SUMMARY is a short recap written from the scenes, with the scenes it covers, so it can
// be checked and edited against the script.

export type SummarySection = {
  id: string
  title: string
  scenes: string // the scenes the recap is drawn from
  paragraphs: string[]
}

export const STORY_SUMMARY: SummarySection[] = [
  {
    id: 'set-up',
    title: 'The set-up',
    scenes: 'Scenes 01 and 02',
    paragraphs: [
      "Kade is a courier. After a job that Tavi booked, Kade was jumped in an alley behind Sector 9, and wakes in Doc Reyes's clinic with a chip the size of a coin under the skin of their neck. Whoever attacked Kade didn't rob them. They installed it.",
      "The monitor shows two heartbeats: Kade's and the chip's. Reyes says Kade's body is fighting the chip like an infection, with about six hours before the nervous system quits. A voice behind Kade's eyes, the chip itself, is trying to speak.",
      'Time only moves when Kade makes a choice, and the chip takes 1 health for every hour that passes.',
    ],
  },
  {
    id: 'act-1',
    title: 'Act 1: the clinic to the Night Market',
    scenes: 'Scenes 01 to 07',
    paragraphs: [
      'Kade can stay and let Reyes treat them, or bolt. Bolting leads out under the flyover, where Tavi calls and asks Kade to come to the Night Market.',
      'At the market, Mama Ouro looks at the chip and recognises a design by Iris Vale. Vale built half the implants in the city, then walked out of Halcyon Tower with something in her pocket and has not been seen in two years. Only Vale can take the chip out without killing Kade, and Kade has about four and a half hours to find her.',
      "There are three ways to look: pay Ouro for what she knows, break into Halcyon Tower to reach Vale's old lab, or listen to the chip, which only opens up after Kade has died twice. If Kade found Reyes's delivery slip, it points to Line 4.",
    ],
  },
  {
    id: 'act-2',
    title: 'Act 2: the search',
    scenes: 'Scenes 08 to 16',
    paragraphs: [
      "Act 2 has three routes, and all of them end at the Drowned Line. Ouro's price is a piece of Kade: an eye, a memory, Tavi's implant if Tavi came along, or the chip itself. The Lab is Vale's old lab on floor 88 of Halcyon Tower, where a terminal holds a project file and Sable, who works for the people who own the chip, phones to ask for it back. Following the chip takes Kade across the city to a house the chip remembers.",
      'The Drowned Line is a flooded metro line. If Tavi is with Kade, Tavi may ask to go ahead and check the way. Past the stairs the tunnel splits three ways: left to an old flood gate, through the flooded centre, or along a low crawlway.',
      'This is where most runs end. The left tunnel can hand Kade to Sable, the centre tunnel drowns anyone who does not know the way, and the crawlway is safe but slow.',
    ],
  },
  {
    id: 'act-3',
    title: "Act 3: Vale's door",
    scenes: 'Scenes 17 to 23',
    paragraphs: [
      "At the end of the line is a steel door with a terminal that asks Kade to identify themself. Ouro's code or Reyes's note will open it. Without either, Vale lets Kade in at gunpoint. If Kade has learned the chip's name, typing it opens the door another way.",
      "Inside, Iris Vale explains that Kade was never a random victim. Halcyon installed the chip on purpose, as the first test of LAZARUS in a living host, and Tavi's job was how they delivered Kade. The chip is a copy of Vale's own mind from two years ago.",
      'Sable arrives at the door and offers to let everyone walk out alive if Kade opens it. Kade then has one last choice. Vale can cut the chip out if at least an hour is left, or Kade can open the door to Sable. Two more choices stay locked until earlier runs and choices have opened them.',
    ],
  },
]

export type EndingGuideEntry = {
  number: number
  name: string
  kind: 'Death' | 'Survive' | 'Secret'
  howToGet: string // from the script's table
  opens?: { text: string; flags: string[] } // what it gives the next run, and the flags that carry it
}

export const ENDING_GUIDE: EndingGuideEntry[] = [
  {
    number: 1,
    name: "Doc's Table",
    kind: 'Death',
    howToGet: 'Stay at the clinic',
    opens: { text: 'Opens the locked choice "Ask who he called" in the clinic.', flags: ['reyes_lied'] },
  },
  {
    number: 2,
    name: 'Caught',
    kind: 'Death',
    howToGet: 'Heat 3+ at the lab, or the gate at Heat 4+',
    opens: { text: 'Opens "Stall Sable" in the Lab. If Tavi was with you, it also opens "Ask about Lina".', flags: ['met_sable', 'tavi_secret'] },
  },
  {
    number: 3,
    name: "Tavi's Trade",
    kind: 'Death',
    howToGet: 'Let Tavi go ahead at the Drowned Line',
    opens: { text: 'Opens "Ask about Lina" at the Night Market.', flags: ['tavi_secret'] },
  },
  {
    number: 4,
    name: 'Drowned',
    kind: 'Death',
    howToGet: 'Center tunnel without the route',
    opens: { text: 'Shows the safe way through the centre tunnel.', flags: ['knows_route'] },
  },
  {
    number: 5,
    name: 'Flatline',
    kind: 'Death',
    howToGet: 'Time or health hits zero',
    opens: { text: "Each flatline shows a little more of the chip's own memory.", flags: [] },
  },
  {
    number: 6,
    name: 'Sold',
    kind: 'Survive',
    howToGet: 'Sell the chip to Ouro',
    opens: { text: "Lets you type the chip's name at Vale's door, and changes the chip's first line next run.", flags: ['knows_lazarus', 'saw_sold'] },
  },
  {
    number: 7,
    name: 'Company Man',
    kind: 'Survive',
    howToGet: 'Open the door to Sable',
    opens: { text: "Changes the chip's first line next run.", flags: ['saw_company'] },
  },
  {
    number: 8,
    name: 'Removed',
    kind: 'Survive',
    howToGet: 'Let Vale remove it with 1:00+ left',
    opens: { text: "Changes the chip's first line next run.", flags: ['was_removed'] },
  },
  {
    number: 9,
    name: 'Partners',
    kind: 'Survive',
    howToGet: 'Forgive Tavi, keep the memory, reach Vale together',
  },
  {
    number: 10,
    name: 'Merged',
    kind: 'Secret',
    howToGet: 'Type LAZARUS at the door, and listen to the chip',
    opens: { text: "Changes the chip's first line on every future run.", flags: ['saw_merged'] },
  },
]

export const SECRET_ENDING_PATH =
  'The fastest a player can reach it is on their third run. The two runs before it must both end in a death, so the chip\'s route unlocks, and one of them must read the lab files to learn the name LAZARUS. A player who learns the name through Sold instead needs a fourth run. On the final run: listen to the chip, type LAZARUS at the door, and choose "Let it in."'

export const GOOD_TO_KNOW: string[] = [
  'Locked choices are greyed out and open because of what Kade went through in earlier runs.',
  "Dying at Doc's Table opens \"Ask who he called\". Searching Reyes's office after that gives painkillers and Reyes's slip, which leads to Line 4.",
  '"Listen to the chip" opens after two deaths.',
  "The chip's voice gets clearer the more times Kade has died.",
]
