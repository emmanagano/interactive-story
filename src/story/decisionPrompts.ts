// One plain sentence above the choices saying what the player is deciding. It is UI help, not story text:
// written only from what each scene says and kept out of the scene data so the script's words stay
// untouched. Emma should read and edit these. Scenes with no entry (endings, "continue" scenes) show nothing.
export const DECISION_PROMPTS: Record<string, string> = {
  'scene-01': 'Reyes wants to treat you, and he keeps glancing at the phone on his desk. Do you stay, run, or press him?',
  'scene-03': 'Someone called Reyes before you woke, and he says they will be here within thirty minutes. Make him help, or leave now?',
  'scene-04': 'Tavi wants to meet you at the Night Market. Decide how you get there.',
  'scene-05': 'Tavi admits booking the job, and Mama Ouro has seen the chip. Do you keep Tavi with you, go alone, or ask about Lina?',
  'scene-06': 'Tavi has told you why. Forgive them, or leave them behind?',
  'scene-07': 'Only Iris Vale can remove the chip. Choose how you go looking for her.',
  'scene-08': 'Mama Ouro will help, for a price. Choose what you pay with.',
  'scene-10': "You are in Vale's old lab and Sable is on the line. Do you read the files, grab the drive and run, or keep him talking?",
  'scene-12': 'The chip has led you to a house it remembers. Do you stay a moment, or keep moving?',
  'scene-13': 'Tavi offers to go ahead and check the way. Let them, or keep Tavi close?',
  'scene-13-tunnels': 'The tunnel splits three ways. Choose your way through.',
  'scene-14': "Tavi can't look at you. Forgive them, or say nothing?",
  'scene-17': "The door to Vale's hideout is shut. You need a way through.",
  'scene-19': 'Time is nearly up. Decide what happens to the chip, and to you.',
  'scene-21': 'Vale asks what the chip said at the end. Tell her, or keep it to yourself?',
}
