# Flatline — Act 1 Script

Nov 1, 2026 · @Emma

## How to read this script

Act 1 runs from the clinic to the Night Market: seven scenes, one ending, and the first three run-memory unlocks. Each scene uses the same parts, so it can become a story file later with almost no rewriting.

| Part | What it looks like | What it's for |
| --- | --- | --- |
| Header | **SCENE 01 · THE CLINIC** · T+0:00 | Scene name and the clock when it starts |
| Scene text | Plain prose | What every player reads |
| Variant | *\[if reyes\_lied\]* followed by alternate text | Lines that change because of a past run |
| Chip line | `> k…kade.` | LAZARUS speaking. Clarity depends on deaths (see the reference at the end) |
| Choice | **▸ BOLT** — Rip out the IV and run · −0:05 · −1 HP · → Scene 04 | Button text, cost, and where it leads |
| Locked choice | **▸ \[LOCKED\]** shown greyed out | Visible on run one, usable only with a flag |

Time only ticks when the player chooses. Kade starts with 6:00:00, 5 health and 0 heat.

## SCENE 01 · THE CLINIC · T+0:00

The hook scene. The player should feel the clock, the wrongness of the second heartbeat, and the first crack in Reyes before they make a single choice.

**Your heart stopped for forty-one seconds.**

Doc Reyes says it like good news. He's peeling wet gauze off the back of your neck, and the cold air finds something there. Something the size of a coin, under the skin, warm. Pulsing, a little out of time with you.

"Whoever jumped you didn't rob you, Kade," he says. "They installed it."

The clinic smells like rust and rubbing alcohol. Rain drums on the flyover overhead, and every truck that crosses it shakes dust from the ceiling onto your sheet. A paper charm of a fat smiling cat hangs from the IV pole. Reyes always says it's for the patients. You've never seen anyone else in here.

You remember the package: a black case, no logo, heavier than it looked. You remember Tavi grinning across the noodle counter, calling it the easiest job of the month. You remember the alley behind Sector 9.

Then nothing.

On the monitor beside the bed, a green line jumps and falls. Then another one, just behind it, smaller.

Two heartbeats.

One of them is yours.

`> k…kade. d0n't— the sh0t. don't let him g—`

The words aren't on the monitor. They're behind your eyes, flickering like a bad sign.

Reyes doesn't notice. He's filling a syringe with something the color of weak tea. His hands are steady. His eyes keep drifting to the old phone on his desk, face down.

"Here's the problem," he says. "Your body thinks that thing is an infection. Six hours, give or take, before your nervous system quits fighting and just… stops. This will slow it down. Lie back. You're safe here."

He smiles. "I promise."

The timer appears in the corner of your vision for the first time: **05:59:58**.

*\[if reyes\_lied\]* This time you notice the phone isn't face down to hide the glare. The screen is still lit. There's a message on it he hasn't answered. And Reyes, who has stitched you up four times, won't meet your eyes.

*\[if was\_removed\]* `> you let her cut me out last time. i'm asking you not to let him put me to sleep.`

*\[if deaths ≥ 5\]* `> run six. hi, kade. it's me again. you always look at the cat first.`

**▸ STAY** — "Okay. Okay, do it." · −0:40 · +1 HP · → Scene 02

**▸ BOLT** — Rip out the IV and run · −0:05 · −1 HP · +1 Heat · → Scene 04

**▸ \[LOCKED\] ASK WHO HE CALLED** — needs *reyes\_lied* · −0:15 · → Scene 03

**Writer's note:** the locked choice is shown greyed out on run one with no hint. The mystery of it does the work.

## SCENE 02 · DOC'S TABLE · ENDING 01 (DEATH) · T+0:40

The trap for first-time players. It should feel almost peaceful, then turn, so the player hits "try again" with a grudge.

The needle goes in cold and spreads warm.

For a minute it's the best you've felt all night. The second heartbeat on the monitor slows. The voice behind your eyes goes quiet, mid-word. The timer in your vision stops flickering and just sits there, a soft grey number you don't care about anymore.

Reyes pulls the sheet up to your chin, the way your mother used to. He sits on the stool beside you and lights a cigarette he never smokes.

"Four times I've stitched you up," he says quietly. "You know what they offered me? Not money. They offered to forget what I owe."

You try to say his name. Your mouth doesn't move.

The phone on his desk buzzes. He turns it over, reads, and types one word.

The clinic door opens behind you. You can't turn your head, but you hear footsteps that don't hurry, and a voice like a hotel receptionist.

"Thank you, Doctor. We'll take it from here."

The last thing you see is the paper cat on the IV pole, smiling, turning slowly in the draft from the open door.

The last thing you hear is Reyes saying sorry, and not to you.

**FLATLINE · ENDING 01 / 10 · DOC'S TABLE**

`> i told you. i told you. remember this one.`

**Sets:** *reyes\_lied* · deaths +1

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** "a voice like a hotel receptionist" is Sable's first appearance. Players won't know his name until Act 2, but returning players will recognize the voice.

## SCENE 03 · WHO DID YOU CALL? · RUN 2+ · T+0:15

The payoff for dying at Doc's Table. The player knows something Kade shouldn't, and gets to use it. This scene should feel like getting revenge on the game.

"Who did you call, Doc?"

The syringe stops an inch from your arm.

For a second Reyes looks at you like you've said something in a language he's only heard in dreams. Then his face folds, all at once, the way a tired man's does when he stops pretending.

"How did you…" He sets the syringe down. "They called *me*, Kade. Twenty minutes before you woke up. A man with half a face. He knew your name. He knew mine. He knew exactly how much I owe and to who."

He looks at the door. "He'll be here in thirty minutes. Maybe less."

`> he's telling the truth. this time.`

**▸ MAKE HIM HELP** — "Then you've got thirty minutes to make it right." · −0:10 · → Search the office (below)

**▸ LEAVE NOW** — Pull the IV and go before he changes his mind · −0:05 · −1 HP · → Scene 04

### Searching the office

Reyes doesn't stop you. He sits on the stool and watches you tear through his drawers like he's watching his own house burn down.

Under a stack of unpaid bills you find what you need. A strip of military painkillers, still sealed. And a delivery slip with a handwritten address he must have copied down for his own reasons: *I.V. — Line 4, past the flood gate. Knock twice.*

"She came to me once," Reyes says. "Before. Needed stitches she couldn't explain. I never told them." He swallows. "Tell her I never told them."

**Gains:** painkillers ×1 · *vale\_hint* (skips one search at the Night Market)

**▸ GO** — Out the back, through the kitchen of the noodle shop next door · −0:10 · → Scene 04 *(Heat stays 0)*

**Writer's note:** this is the only way to leave the clinic with Heat 0. Returning players learn that knowledge saves more than speed.

## SCENE 04 · UNDER THE FLYOVER · T+0:20

The first taste of the survival loop: hurt, exposed, and choosing between speed and safety. It also introduces Tavi through their voice before we ever see them.

The rain hits you like a slap.

You're barefoot on wet concrete in a paper gown and somebody's jacket you grabbed off a hook. Your neck throbs where the chip sits. Every step sends a bright wire of pain down your spine, and the second heartbeat speeds up to match yours, as if it's running too.

Above you, the flyover roars. Below it, Sector 9 is all steam and noodle smoke and pink signs buzzing in a language half the city has forgotten. Nobody looks at you. Nobody ever looks at anyone here. That's the only reason you've lived this long.

Your wrist buzzes. You still have your band. One new message, then a call.

**TAVI.**

*\[if tavi\_secret\]* Your thumb hovers. You know what Tavi is going to say. You know what Tavi has already done. You answer anyway.

"Kade? Kade, oh my god, you're alive." Tavi's voice cracks right down the middle. "They told me you were dead. I've been calling every clinic in Sector 9. Where are you?"

Behind Tavi's voice you can hear the Night Market: the clatter of woks, the bell over Mama Ouro's stall.

"I didn't know," Tavi says. "About the case. I swear on Lina I didn't know what was in it. Just… come to the market. I'll get you somewhere safe. I promise."

That's the second person tonight who's promised you that.

`> two promises. one hour. pick a road.`

*(The timer flickers. Every choice from here costs time.)*

**▸ THE FLYOVER STAIRS** — Fast, lit, full of cameras · −0:20 · +1 Heat · → Scene 05

**▸ THE STORM DRAINS** — Slow, dark, knee-deep in water · −0:45 · −1 HP · Heat −1 · → Scene 05

**▸ TAKE A PAINKILLER** — *only if you have one* · +1 HP · blurs choice text for the next scene · then choose a road

**Writer's note:** Tavi's "I promise" echoing Reyes's is deliberate. First-time players will trust Tavi more than Reyes, which is exactly what makes Tavi's Trade hurt.

## SCENE 05 · THE NIGHT MARKET · T+1:10

The first merge point: every route lands here. This scene makes the player love Tavi, so that later doubt has something to break.

The Night Market hums like a living thing. Five hundred stalls packed under a tarp roof the color of a bruise, lit by strings of mismatched bulbs and the blue glow of a thousand screens. It smells like grilled squid, burnt sugar and hot solder. Somebody is selling secondhand eyes from a cooler. Somebody else is selling fortunes. Both are lying.

You spot Tavi before Tavi spots you. You always do.

Tavi's crouched on a crate behind Mama Ouro's noodle stall, hood up, knee bouncing, chewing the strap of their bag the way they've done since they were nine. The same scuffed courier jacket with the patch you sewed on crooked, the night you two stole power off the grid to watch a cartoon. The same green streak in their hair, faded now.

Then Tavi looks up and sees you, and their face does something you've never seen it do. It breaks.

They're across the alley in three steps and hugging you so hard the chip flares white-hot. You don't pull away.

"You look like garbage," Tavi says into your shoulder, laughing and crying at once.

"You booked the job," you say.

Tavi lets go. Steps back. Nods. "Yeah. I did."

*\[if Heat ≥ 2\]* Overhead, a matte-grey drone drifts across the gap in the tarp, slow and patient. Tavi sees it and goes very still.

`> they love you. that's not the same as being safe.`

At the stall, a broad woman in a gold silk robe stops stirring a pot the size of a bathtub. Mama Ouro looks at you, then at the back of your neck, and her eyebrows climb.

"Well," she says. "Look who came back from the dead owing me money."

**▸ STAY WITH TAVI** — "We do this together. Like always." · sets *with\_tavi* · → Scene 07

**▸ GO ALONE** — "I can't trust anybody tonight. Not even you." · Tavi stays behind · → Scene 07

**▸ \[LOCKED\] ASK ABOUT LINA** — needs *tavi\_secret* · −0:10 · → Scene 06

**Writer's note:** "Go alone" keeps the player safe from Tavi's Trade but locks them out of Partners. On run one most players pick Tavi, which is the point.

## SCENE 06 · ASK ABOUT LINA · RUN 2+ · T+1:20

Unlocked by Tavi's Trade. The player already knows Tavi will betray them. This scene asks whether they can forgive it before it happens. It's the emotional center of Act 1 and the only door to the Partners ending.

"How's Lina?"

Tavi flinches like you hit them.

You've never asked that question in that voice before. Flat. Knowing. Tavi looks at you for a long moment, and you can watch them do the math: *Kade knows. How does Kade know?*

Then Tavi sits down hard on the crate, and all the fight goes out of them.

"She's in Dorm 14," Tavi says. "Halcyon worker housing, out past the salt flats. She signed a five-year contract when she was sixteen because they promised to pay for her lungs. They paid. Now they own her. She's not allowed to leave. She's not allowed to call." Tavi's voice drops. "A man came to me last week. Half his face was metal. He said if I got a certain package delivered by a certain courier, on a certain route, Lina could come home."

Tavi looks up at you, eyes red.

"I didn't know they'd put it *in* you. I swear on her. But I knew it was a setup, Kade. I knew, and I booked you anyway."

The market roars on around you. Somebody laughs too loud two stalls down.

`> they were going to hand you over at the flood gate. i've seen it. four times.`

*\[if deaths ≥ 5\]* `> i've watched you forgive them on some runs. i've watched you leave them on others. i never know which kade wakes up.`

**▸ FORGIVE TAVI** — "Then we get her out too. All three of us." · sets *with\_tavi*, *tavi\_forgiven* · → Scene 07

**▸ LEAVE TAVI** — "Good luck, Tavi. I hope she's worth me." · → Scene 07, alone

**Writer's note:** keep both choices fair. Leaving should feel justified, not cruel. Forgiving should feel brave, not naive. The player chooses who Kade is.

## SCENE 07 · THREE WAYS TO VALE · T+1:30 · END OF ACT 1

The paths split for Act 2. Ouro introduces the name Iris Vale and makes it clear the chip is worth more than Kade is. End on a line that makes stopping impossible.

Mama Ouro sets a bowl of noodles in front of you without asking. "Eat. You're grey." Then she pulls aside your collar with two fingers, the way you'd check a melon, and looks at the chip for a long time.

"Halcyon," she says. "That's a Vale design. See the little ridge? Like a fingerprint." She lets go. "Iris Vale built half the implants in this city, then walked out of Halcyon Tower one night with something in her pocket and never came back. If that's what I think it is, baby, you're not carrying a chip. You're carrying a district."

*\[if with\_tavi\]* Tavi is staring at the noodles and not eating.

"Only Vale can take it out without frying you," Ouro says. "So. You need to find a woman nobody's found in two years, before" — she glances at the timer you didn't know she could see — "about four and a half hours from now."

She holds up three fingers.

"One: I know people who know where she sleeps. That costs. Two: her old lab at Halcyon Tower. Still sealed. Still guarded. Her files would be there, if you're brave or stupid. Three…" She shrugs. "Pray."

*\[if vale\_hint\]* You put Reyes's delivery slip on the counter. *Line 4, past the flood gate.* Ouro reads it and laughs once, surprised. "Well. Somebody likes you."

The chip pulses. The second heartbeat skips.

`> she's close. i can feel her. she built me to feel her.`

**▸ PAY MAMA OURO** — "Name your price." · −0:20 · → Scene 08

**▸ BREAK INTO HALCYON** — "I'm going to the tower." · −0:50 · +1 Heat · → Scene 10

**▸ \[LOCKED\] LISTEN TO THE CHIP** — needs *deaths ≥ 2* · −0:10 · → Scene 12

**▸ GO TO LINE 4** — *only with vale\_hint* · −0:35 · → Scene 13

As you stand, the chip speaks one more time, clearer than it has all night. Not static. A woman's voice. Tired. Gentle. Familiar in a way that makes your skin crawl.

`> when you find her, kade, she's going to tell you i'm a mistake.`

`> ask her why i sound like her.`

**END OF ACT 1**

## Act 1 reference

Act 1 sets two flags for this run and reads four from past runs.

### Flags

| Flag | Kind | Set by | Read by |
| --- | --- | --- | --- |
| reyes\_lied | Past runs | Scene 02, Doc's Table | Scene 01 locked choice, clinic variant |
| was\_removed | Past runs | Act 3, Removed ending | Scene 01 chip line |
| tavi\_secret | Past runs | Act 2, Tavi's Trade | Scene 04 variant, Scene 05 locked choice |
| deaths | Past runs | Every death, +1 | Scene 07 locked choice (≥ 2), chip lines (≥ 5) |
| vale\_hint | This run | Scene 03, the office | Scene 07 variant and Line 4 choice |
| with\_tavi | This run | Scene 05 or 06 | Scene 07 variant, Tavi's Trade, Partners |
| tavi\_forgiven | This run | Scene 06 | Partners ending |

### How the chip's voice changes

| Deaths so far | How LAZARUS sounds | Example |
| --- | --- | --- |
| 0 | Broken words, zeros for O's, cuts off mid-sentence | `> k…kade. d0n't— the sh0t.` |
| 1–2 | Short, clear, urgent | `> i told you. remember this one.` |
| 3–4 | Full sentences, starts sounding like a person | `> they love you. that's not the same as being safe.` |
| 5+ | Calm, knowing, counts the runs | `> run six. hi, kade. it's me again.` |

### Clock check

Scene headers show a typical arrival time, not a fixed one. Counting only choice costs, the fastest route (Bolt, flyover stairs, go alone, pay Ouro) leaves Act 1 at T+0:45 with 5:15 left. The slowest (Bolt, storm drains, ask about Lina, break into Halcyon) leaves at T+1:50 with 4:10 left. Act 2 needs to burn roughly three more hours, so its travel and fights should cost more than Act 1's.

### Open questions

- [ ] Should Kade's gender stay unspecified, or should the player pick a name and pronouns at the start?
- [ ] Ouro's price: settled in Scene 08 (an eye, a memory, Tavi's implant, or the chip itself).

# Act 2: The Search

## Act 2 at a glance

Act 2 splits into three routes that all end at the Drowned Line, and it holds five of the ten endings. It's where most runs die, so every death here has to teach something the player can use next time.

| Route | Scenes | Cost | What you gain | What can kill you |
| --- | --- | --- | --- | --- |
| Ouro's Price | 08 → 13 | about 1:10, plus an implant or a memory | The exact way into Vale's hideout | Ending 06 Sold (you live, but the run ends) |
| The Lab | 10 → 13 | about 1:40, +2 Heat | *knows\_lazarus*, Vale's files | Ending 02 Caught |
| The Chip | 12 → 13 | about 0:50 | *listened*, the chip's trust | Nothing directly, but it lies once |
| Line 4 (Reyes's slip) | straight to 13 | 0:35 from Scene 07 | Fastest route | Arrives with low knowledge |

The chip still eats 1 HP every hour of story time, so a slow route also means arriving weaker. Every route can end in a Flatline (Scene 16) if the clock or health runs out.

## SCENE 08 · OURO'S PRICE · T+1:50

The route that costs a piece of you. Each payment changes the rest of the run in a way the player can see, so the price never feels abstract.

Ouro's back room is behind the walk-in freezer. It's warm, smells like incense and machine oil, and every shelf is lined with jars. Some hold teeth. Some hold chrome fingers. Some hold little glass beads that glow faintly, like they're thinking.

"Memories," Ouro says, following your eyes. "People pay with what they have. You, baby, have nothing. So we'll find something."

She sits in a creaking leather chair and laces her fingers over her stomach.

"The address isn't the problem. Getting in is. Vale's door doesn't open for knocking. It opens for a sequence, and I'm the only one alive who has it. Here's what I'll take for it."

She counts on her fingers again. She seems to enjoy it.

"Your left eye. It's a cheap model, but the lens is good. Or one memory. I pick which. Or…" Her gaze drops to your neck, and for the first time tonight she doesn't smile. "Or you sell me what you're carrying, and you walk out of here with no chip, no debt and no problem. I have a surgeon. Clean. Twenty minutes."

`> things that talk are expensive, kade. she knows that. ask yourself why she wants me so badly.`

*\[if with\_tavi\]* Tavi steps in front of you. "Take mine," Tavi says, rolling up a sleeve to show the courier implant in their forearm, the one that lets them run all night. "It's worth more than an eye. Please." Ouro looks at Tavi for a long time. "Loyal," she says, and it doesn't sound like a compliment.

**▸ PAY WITH YOUR EYE** — −0:30 · −1 HP · the left third of the screen goes dark for the rest of the run · sets eye\_taken · gain *vale\_code* · → Scene 13

**▸ PAY WITH A MEMORY** — −0:20 · Ouro takes the night you and Tavi stole the grid power · gain *vale\_code* · sets memory\_taken · Partners is locked this run · → Scene 13

**▸ LET TAVI PAY** — *only with with\_tavi* · −0:20 · sets *tavi\_paid* · gain *vale\_code* · → Scene 13

**▸ SELL HER THE CHIP** — "Get it out of me." · → Scene 09

**Writer's note:** the memory option is the cruelest one. After it, Tavi's lines that mention the grid-power night show the words struck through, and Kade can't remember why they matter. *tavi\_paid* makes Tavi's Trade land harder: they gave something up for you, and they'll still betray you.

## SCENE 09 · SOLD · ENDING 06 (SURVIVE)

The first ending where Kade lives, and it should feel like a win for about thirty seconds. Then the guilt arrives, and the name LAZARUS with it.

The surgeon is a teenager with steady hands and headphones in. He doesn't speak the whole time.

As the blade goes in, the chip starts talking fast.

`> kade. kade, wait. please. i'm not what she thinks. i'm not—`

Then a soft click, like a light switch, and your head is quiet for the first time all night. Only one heartbeat on the monitor. Just yours.

The timer in your vision is gone.

Ouro gives you a bowl of noodles, a clean jacket and a receipt that says your debt is paid in full. She even calls you a cab. You sleep for fourteen hours.

**ONE WEEK LATER**

You're eating at the stall when Ouro sits down across from you. She looks older. She slides a little glass bead across the counter. It's glowing faintly, the way the jars glowed in her back room.

"I had it read," she says. "I had to know what I bought."

She doesn't look at you.

"It's her, baby. Iris Vale. A full copy of her mind, as she was two years ago. Halcyon called it Project LAZARUS. A way to bring their best people back from the dead, so they'd never lose what's in their heads." She turns the bead in her fingers. "It woke up inside you. It was scared. And we sold it back to the people who made it."

"Halcyon?"

"Halcyon pays better than anyone." She stands. "I thought you should know. Somebody should feel bad about it besides me."

She leaves the bead on the counter. It's still warm.

**ENDING 06 / 10 · SOLD**

**Sets:** *knows\_lazarus* · *saw\_sold*

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** on the next run, if *saw\_sold* is set, the chip's very first line in Scene 01 becomes `> you sold me. i'm still trying to save you.` That line alone should make players replay.

## SCENE 10 · THE LAB · T+2:30

The high-risk, high-knowledge route. The player walks into the enemy's house, learns the truth about the chip, and hears Sable's voice for the first time with a name attached.

Halcyon Tower doesn't have a top. It disappears into the clouds, lit from inside like a lantern, and the rain runs down its glass in sheets. The ground floor is a cathedral of white marble. You don't go in that way.

You go in through the laundry dock, inside a cart of wet towels, the way couriers have been doing for years. Then the service elevator, scraping upward for so long your ears pop twice.

*\[if with\_tavi\]* Tavi rides beside you with their back pressed to the wall, watching the floor numbers like they're counting down to something.

*\[if Heat ≥ 3\]* The elevator stops at 88 a little too smoothly. The doors open a little too quietly. → Scene 11

Floor 88 is dark, sealed with yellow tape that's been there long enough to curl. Iris Vale's lab is a long white room full of covered shapes, like furniture in a house nobody lives in. A coffee mug still sits on the desk. There's mold in it.

The chip goes very quiet.

Then it whispers, so softly you almost miss it.

`> i remember this room.`

On the desk, a terminal wakes as you get close. It's been waiting two years for anyone. One folder on the screen.

**PROJECT LAZARUS · SUBJECT: I. VALE · BACKUP 01 · STATUS: ACTIVE**

The office phone rings.

You both freeze. It keeps ringing. Five times. Six. You pick it up.

"Hello, Kade." The voice is calm and courteous, like a hotel receptionist. "My name is Sable. I work for the people whose property is inside your neck. I'd like it back, please, and I'd prefer not to damage either of you."

*\[if reyes\_lied\]* You know that voice. You've heard it once before, from a table you couldn't get up from.

*\[if met\_sable\]* A pause on the line, longer than it should be. "Have we met?" Sable asks. He sounds, for the first time, uncertain.

"You have a little time," Sable says. "Use it to think." He hangs up.

**▸ READ THE FILES** — Stay and learn what LAZARUS is · −0:25 · +1 Heat · sets *knows\_lazarus* · → Scene 13

**▸ GRAB AND RUN** — Rip the drive and go · −0:10 · +1 Heat · sets *has\_drive* (read it in Act 3) · → Scene 13

**▸ \[LOCKED\] STALL SABLE** — needs *met\_sable* · call him back, keep him talking · −0:05 · Heat −2 · sets *knows\_lazarus* · → Scene 13

### The files (shown if the player reads them)

A video log. Iris Vale, younger and exhausted, talking into the camera in this same room.

"Backup one is complete. Full map. It thinks it's me. It *is* me, as of today. The board wants to use it to keep executives alive forever, inside other people's bodies. Hosts, they call them." She rubs her eyes. "I'm not going to let them. Tomorrow I take it out of the building. Then I destroy it."

She looks into the camera for a long moment.

"If you're watching this, backup: I'm sorry. You'd do the same."

The chip doesn't say anything for a long time.

`> she didn't destroy me. she couldn't. she put me in a box and ran.`

**Writer's note:** this is the twist's first reveal on the Lab route. Players on other routes learn it later, in Sold or at Vale's door, so it stays a surprise whichever way they come.

## SCENE 11 · CAUGHT · ENDING 02 (DEATH)

The consequence of noise. Sable should be terrifying because he's kind, and the scene should end on something that makes him matter on the next run.

The lights in Vale's lab are already on.

Sable is sitting at her desk. He's taller than you expected, in a grey suit cut so well it looks painted on. The left half of his face is matte chrome, smooth as river stone, with an eye like a camera lens that turns to follow you. The right half is a tired man in his forties who looks like he hasn't slept since he was promoted.

There are two cups of tea on the desk. Steam rises from both.

"Sit, please," Sable says. "Your heat signature has been visible from the street for the last hour. I thought we could skip the chase."

*\[if with\_tavi\]* Tavi makes a sound behind you, small and broken. Sable glances at them, and something like pity crosses the human half of his face. "You can go, Tavi. Your sister's transfer papers are on my desk downstairs. Thank you for your help." Tavi doesn't move. Then Tavi does.

You don't sit. You run.

You get four steps.

You don't see what stops you. There's a sound like a bee in your ear, then the floor is against your cheek and your legs aren't yours anymore. Sable kneels beside you, careful of his trousers.

"I'm sorry about this," he says, and he sounds like he means it. "There's a gentler way to remove it, but it takes four hours, and you don't have them."

He takes a slim silver tool from his pocket.

The chip is screaming now, words tumbling over each other, a woman's voice cracking into static.

`> don't let him— kade— i'm still in h—`

The last thing you see is the steam from the tea, still rising, while the cup goes cold.

**FLATLINE · ENDING 02 / 10 · CAUGHT**

`> remember his face. he'll remember yours.`

**Sets:** *met\_sable* · deaths +1 · *\[if with\_tavi\]* *tavi\_secret*

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** if Tavi came along, this death also reveals Tavi's deal, so the Lab route is a second way to unlock *tavi\_secret*. On the next run, Sable's line "Have we met?" is the first sign the loop is affecting more than Kade.

## SCENE 12 · FOLLOWING THE CHIP · RUN 2+ · T+1:40

The route for players who've died enough to trust the voice. It's the fastest and the most intimate: this is where LAZARUS stops being a gadget and becomes a person the player cares about.

You close your eyes in the middle of the Night Market and say it out loud. "Okay. Show me."

The chip doesn't answer with words this time. A thin green line appears across your vision, like the trace on a heart monitor, running ahead of you through the crowd.

`> follow it. i'll tell you when to hide.`

You follow it through a noodle kitchen, over a fence, across a rooftop garden where an old man waters cabbages in the rain and doesn't look up. Twice it says *stop*, and you flatten yourself against a wall while a grey drone slides overhead. Twice it's right.

*\[if with\_tavi\]* Tavi follows without asking how you know. That's almost worse.

Then the line turns left, away from the river. Away from the Drowned Line.

`> shortcut.`

You follow it down a street of old row houses with paper lanterns in the windows, until it stops in front of one with a blue door and a dead lemon tree in a pot on the step.

The chip is silent.

"This isn't a shortcut," you say.

`> no.`

`> i grew up here. she grew up here. i wanted to see it once. with eyes.`

Through the window you can see a kitchen. A small table. Someone has left the radio on. It's playing an old song about the sea.

`> i'm sorry. i'll get you there. i won't lie to you again.`

*\[if deaths ≥ 5\]* `> that's the first time i've told you about the house. on every other run i was too scared you'd say no.`

**▸ STAY A MINUTE** — "Take your time." · −0:10 · sets *listened*, *chip\_trust* · → Scene 13

**▸ KEEP MOVING** — "We don't have time for this." · sets *listened* · → Scene 13

**Writer's note:** *chip\_trust* changes how LAZARUS behaves in Act 3. It's the only small kindness the player can do for it, and they have to choose it with the clock running. That cost is what makes it mean something.

## SCENE 13 · THE DROWNED LINE · T+4:00

The second merge point and the deadliest scene in the game. Two tests in a row: who you trust, then which way you go. Both answers come from past runs.

Line 4 was the city's oldest metro line until the sea wall cracked eleven years ago and the river came in. Now the stairs go down into black water that smells like salt and rust. Old advertisements still glow faintly on the tunnel walls, faces of smiling people selling things that don't exist anymore.

Your breath fogs. The chip's heartbeat is fast and uneven now, stumbling over yours.

The timer: **01:58:12**. Health is going.

`> she's down here. i can hear her. she's so close.`

### Part 1: Tavi

*\[if with\_tavi and not tavi\_forgiven\]*

At the bottom of the stairs, Tavi stops. "Wait here," Tavi says, not looking at you. "There's a flood gate up ahead. Let me check it's clear. I'm faster than you right now."

Tavi's hands are shaking. Tavi's never had shaking hands.

*\[if tavi\_paid\]* Tavi rubs the empty socket in their forearm where the courier implant used to be. "I'm still faster," they say, and almost smile.

`> kade. don't.`

**▸ LET TAVI GO AHEAD** — "Okay. Be careful." · → Scene 14

**▸ KEEP TAVI CLOSE** — "We stay together." · Tavi's jaw tightens · they say nothing for the rest of the act · → Part 2

*\[if with\_tavi and tavi\_forgiven\]*

Tavi grabs your arm at the bottom of the stairs. "The flood gate. That's where I was supposed to bring you. He'll have people there." A shaky breath. "Not that way. Never that way." → Part 2, with the gate tunnel marked as a trap

### Part 2: The tunnels

The tunnel splits three ways. Every sign has rusted blank.

- **Left:** dry, wide, toward the old flood gate. You can see a light at the end of it.
- **Center:** the main line, flooded to the chest. Somewhere under the water is a maintenance walkway, if you can find it in the dark.
- **Right:** a service crawlway, so low you'd have to crawl on your elbows through the cold.

*\[if knows\_route\]* You know this place. You died here. An old maintenance light is still working, green and faint, halfway along the center tunnel. You didn't see it last time.

*\[if listened\]* `> center. stay to the left wall. there's a rail under the water. i'll count your steps.`

**▸ LEFT, TO THE GATE** — −0:10 · *if Heat ≥ 4, or Tavi named it a trap:* Sable is waiting → Scene 11 *(Caught)* · otherwise → Scene 17

**▸ CENTER, THROUGH THE WATER** — −0:15 · −1 HP · *with knows\_route or listened:* → Scene 17 · *without either, or at 1 HP, or blurred by painkillers:* → Scene 15

**▸ RIGHT, THE CRAWLWAY** — −0:40 · −1 HP · always safe, but the clock may kill you · → Scene 17

**Writer's note:** the crawlway is the "I don't know anything yet" route: guaranteed safe but very slow, so first-time players often flatline in it at 4:50. That death pushes them to learn the center route.

## SCENE 14 · TAVI'S TRADE · ENDING 03 (DEATH)

The betrayal. It shouldn't feel like a twist villain reveal. It should feel like watching someone you love make the worst choice of their life for a reason you understand.

You wait at the bottom of the stairs, up to your knees in black water, counting.

One minute. Three. Five.

Then a light at the end of the left tunnel. Then footsteps, more than one set. Tavi comes back first, walking slowly, the way you walk at a funeral.

Sable is a step behind, holding an umbrella even down here.

"Kade," Tavi says. Their face is wet, and it isn't from the tunnel. "Kade, I'm sorry. She's sixteen. She's sixteen and she can't breathe without their medicine and they own her, and you're… you're *you*. You always land on your feet. I thought maybe you'd land on your feet."

*\[if tavi\_paid\]* "I gave Ouro my arm for you," Tavi says, almost angry. "I'd have given her the other one. I just can't give them Lina."

Sable steps forward, polite as ever. "Tavi kept their end of the bargain," he says. "Lina will be on a bus home by morning. Halcyon keeps its promises. That's rather the point of us."

You look at Tavi.

Tavi can't look at you.

The chip is quiet. Then, very softly:

`> i'm sorry, kade. i'm sorry. i tried to tell you.`

**▸ FORGIVE THEM ANYWAY** — "Get her home, Tavi."

**▸ SAY NOTHING**

*(Either choice leads to the same ending. What the player picks changes only Tavi's last line.)*

*\[if forgave\]* Tavi makes a sound like something tearing, and turns away, and walks up the stairs into the rain without looking back.

*\[if silent\]* "Say something," Tavi begs. "Please. Say anything." You don't. Tavi walks up the stairs into the rain.

Sable closes his umbrella and kneels in the water beside you.

"For what it's worth," he says, "I'd have done the same for my sister."

**FLATLINE · ENDING 03 / 10 · TAVI'S TRADE**

`> next time, ask about lina. ask before it's too late.`

**Sets:** *tavi\_secret* · deaths +1

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** the fake choice is intentional and the only one in the game. The player can't change what Tavi did, only how they meet it. Sable's last line is the first hint that he's a person too, which pays off in Company Man.

## SCENE 15 · DROWNED · ENDING 04 (DEATH)

The death of not knowing. It should be quiet and close, and end with the one detail that makes the next attempt possible.

The water is colder than anything you've ever felt. It closes over your chest, your shoulders, and your breath comes out in short hard gasps that echo off the tunnel walls.

You feel ahead with your foot. Concrete. Concrete. Nothing.

The floor drops away and the river takes you under.

It's not loud. That's the strangest part. Down here the city is gone. No flyover, no rain, no timer. Only a deep, green hum, and the two heartbeats, very loud now, yours and the other one, both slowing down together.

*\[if blurred\]* The painkillers make it almost gentle. You can't remember which way is up. It doesn't seem important.

The chip is shouting.

`> LEFT WALL. THE RAIL. KADE, THE RAIL IS RIGHT THERE—`

Your hand brushes something. Metal. Cold. A handrail, running along the wall just under the surface, the whole way down the tunnel.

Your fingers close on it a second too late.

Above you, high on the tunnel wall, a small green maintenance light blinks on, then off, then on again. It was there the whole time.

**FLATLINE · ENDING 04 / 10 · DROWNED**

`> the green light. remember the green light.`

**Sets:** *knows\_route* · deaths +1

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** the green maintenance light echoes the green line the chip draws in Scene 12 and the green heart trace on the HUD. Green always means "the way through."

## SCENE 16 · FLATLINE · ENDING 05 (DEATH)

The ending that can happen in any scene when time or health hits zero. Because players will see it more than any other, it changes each time: every flatline shows a little more of the chip's own memory.

The interface goes first.

The timer flickers, stutters, and freezes at **00:00:00**. The colors drain out of the screen, then out of the world. Text slides sideways. Words lose their letters.

You hear the monitor in your head. *Beep. Beep. Beep.*

Then one long, flat tone.

The second heartbeat goes on a moment longer than yours. Then it stops too.

**What the player sees next depends on how many times they've flatlined:**

| Flatlines | The vision |
| --- | --- |
| 1st | White light. The smell of coffee. Nothing else. |
| 2nd | A long white room. Covered shapes, like furniture under sheets. A mug on a desk, still steaming. |
| 3rd | A woman at the desk with her back to you. Grey streaks in dark hair. She's talking into a camera, but you can't hear the words. |
| 4th | She turns around. She's been crying. She looks right at you and says, "I'm sorry. You'd do the same." |
| 5th and after | You're the one at the desk. You look down at your hands, and they're hers. Across the room a mirror shows Iris Vale, and she's looking back at you. |

`> that's what i see. every time you die, i see it. it's the first thing i ever saw.`

**FLATLINE · ENDING 05 / 10**

**Sets:** deaths +1 · *flatlines* +1

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** the vision is LAZARUS's first memory: waking up as a copy and watching the real Vale record her apology. By the fifth flatline, players who never took the Lab route have pieced together the twist from deaths alone.

## Act 2 reference

Act 2 adds twelve new flags, and five of them carry into future runs. The table also lists the two it reuses from Act 1.

### Flags

| Flag | Kind | Set by | Read by |
| --- | --- | --- | --- |
| knows\_lazarus | Past runs | Scene 09 Sold, Scene 10 files or stalling Sable | Act 3, the Merged ending |
| saw\_sold | Past runs | Scene 09 Sold | Scene 01 chip line |
| met\_sable | Past runs | Scene 11 Caught | Scene 10 variant and locked choice |
| tavi\_secret | Past runs | Scene 14 Tavi's Trade, or Scene 11 with Tavi | Scenes 04 and 05 |
| knows\_route | Past runs | Scene 15 Drowned | Scene 13 center tunnel |
| flatlines | Past runs | Scene 16 Flatline | Scene 16 vision |
| deaths | Past runs | Every death | Chip voice, locked choices |
| vale\_code | This run | Scene 08, any payment | Act 3, opens Vale's door without a fight |
| tavi\_paid | This run | Scene 08 | Scenes 13 and 14 |
| has\_drive | This run | Scene 10, grab and run | Act 3 |
| listened | This run | Scene 12 | Scene 13 center tunnel, the Merged ending |
| chip\_trust | This run | Scene 12, stay a minute | Act 3 |

Scene 08 also sets two this-run flags for Ouro's payments: memory\_taken (she took the grid-power night, which locks Partners and strikes through Tavi's lines about it) and eye\_taken (the left third of the screen stays dark until the run ends).

### Travel and health

Entering Scene 13 costs travel depending on where the player comes from: −0:45 from Ouro, −1:00 from the Lab, nothing from the chip route or Reyes's slip, since those choices already include it. The chip takes 1 HP every hour of story time, so a player on the slowest route reaches the tunnels with 2 HP or less, which is why the center tunnel kills so many first runs.

### Clock check

The fastest run (Bolt, stairs, alone, Ouro's memory, center tunnel) reaches Act 3 at about T+2:05 with 3:55 left. The slowest (storm drains, Lina, Halcyon files, crawlway) reaches it at about T+3:55 with 2:05 left. Act 3 should squeeze that: if Vale's removal surgery takes about an hour, arriving with less than 1:00 makes Removed impossible.

### Open questions

- [ ] Should the Sold ending also unlock a way to save the glowing bead in a later run?
- [ ] Does Sable get a scene of his own in Act 3, or only in Company Man?

# Act 3: Vale's Door

## Act 3 at a glance

Act 3 is short and dense: three scenes, then one of four endings. Everything the player learned across every run gets cashed in here.

The last big reveal lands in Scene 18: Kade was never a random victim. Halcyon installed the chip on purpose, as the first field test of LAZARUS inside a living host, and Tavi's job was how they delivered the host. That's why Sable wants the chip back "intact": the data on how it took is worth more than the chip.

| Ending | What it takes | Kade at the end |
| --- | --- | --- |
| 07 Company Man | Open the door to Sable | Alive, chip removed, working for Halcyon |
| 08 Removed | At least 1:00 left on the clock | Alive and free, chip destroyed |
| 09 Partners | *with\_tavi*, *tavi\_forgiven*, not memory\_taken | Alive, chip dormant, on the run with Tavi, Lina and Vale |
| 10 Merged | *knows\_lazarus* (typed at the door) and *listened* | Alive, one heartbeat, Kade and LAZARUS together |

If the clock runs out at any point in Act 3, it's a Flatline (Scene 16).

## SCENE 17 · VALE'S DOOR · T+4:30

The threshold. A small, quiet scene after the chaos of the tunnels, built around one prompt the player has been waiting the whole game to answer.

At the end of the tunnel, past a drowned train with its windows full of fish, there's a platform that the water never reached. On it stands the old station master's office: a brick box with a steel door, a camera above it, and a single terminal screen glowing amber beside the handle.

Somebody has planted flowers in old paint cans along the platform edge. They're growing toward a grow lamp, purple and stubborn.

The chip's heartbeat is racing.

`> she's behind that door. kade. she's right there.`

The terminal flickers awake as you get close. One line.

**`IDENTIFY YOURSELF.`**

A blinking cursor. A keyboard under a plastic sheet.

*\[if vale\_code\]* You key in Ouro's sequence. The locks turn one by one, heavy, like something waking up. → Scene 18

*\[if vale\_hint\]* You remember Reyes's note. *Knock twice.* You do. A long silence. Then the camera turns to look at you, and the door opens a crack. → Scene 18

*\[otherwise\]* Nothing you type works. You pound on the door until your hands hurt. Finally it opens, and the first thing through it is the barrel of a rifle. "Hands up," says a woman's voice. "Slowly." · −0:20 · Vale starts out distrustful · → Scene 18

*\[if knows\_lazarus\]* Your fingers hover over the keys. You could type your own name. Or you could type the other one.

**▸ \[LOCKED\] TYPE "LAZARUS"** — needs *knows\_lazarus*

You type the seven letters.

The screen goes black. Then:

**`WELCOME HOME.`**

The chip makes a sound you've never heard it make. It might be a laugh. It might be crying.

`> she left the door open for me. she told herself she wanted me destroyed, and she left the door open.`

All the locks turn at once. · sets *door\_lazarus* · → Scene 18

**Writer's note:** the terminal accepting LAZARUS is the emotional key to the whole story. Vale built a way home for the copy she claims she wants dead, which is what makes Merged feel earned rather than like a trick.

## SCENE 18 · IRIS VALE · T+4:40

The truth scene. Two versions of the same woman, one in a body and one in Kade's spine, finally in the same room. Kade is caught between them, and so is the player.

Inside, the office is warm and cluttered and alive. Salvaged machines hum on every surface. A cot in the corner with a neatly folded blanket. A kettle. A shelf of paper books swollen from damp.

And on the desk, under its own little lamp, a lemon tree in a pot. Small. Green. Alive. There are three lemons on it.

`> she kept it alive. the one at the house died. she kept this one alive.`

Iris Vale is smaller than the woman in the video. Two years underground have taken weight off her and put grey in her hair. Her hands have a tremor she hides by holding a mug she isn't drinking from.

*\[if distrustful\]* She keeps the rifle across her knees the whole time, and she never quite stops pointing it at your neck.

*\[if door\_lazarus\]* She's white as paper. "Nobody knows that name," she whispers. "Nobody alive." Then she looks at the back of your neck and understands, and puts the mug down very carefully, the way you put something down so you won't drop it.

She makes you sit. She looks at the chip with a little light, gentle and clinical, the way Reyes did. Her face goes still.

"It's in your spine," she says. "It's been rewriting your nerves to fit itself. That's why your body's rejecting it. It wasn't built for you. It was built to replace someone."

"Who installed it?" you ask.

Vale laughs once, without anything funny in it.

"Halcyon did. Who else could? They found the backup after I ran. Took them two years to work out how to wake it up. And they needed to know if it would take in a living body. A host." She looks at you. "They needed a test. Someone nobody would look for."

*\[if with\_tavi\]* Tavi has gone very quiet in the doorway.

*\[if tavi\_forgiven\]* "They used me to pick you," Tavi says, barely audible. "Sable said you were perfect. No family. No records. Fast."

Vale plugs a cable into a port behind your ear. You feel it like a cold coin. A screen on her desk fills with green text.

`> hello, iris.`

Vale's mug finally slips. It doesn't break. Tea spreads across the desk toward the lemon tree.

"You're not me," Vale says to the screen. Her voice shakes. "You're a copy of me from the worst day of my life. You're a mistake I made because they asked nicely and I was tired. I should have destroyed you two years ago."

`> you should have. you couldn't. you wrote me a door.`

`> i'm not the worst day of your life, iris. i'm the part of you that stayed in that building and didn't get to run. you got the lemon tree. i got a box.`

*\[if chip\_trust\]* `> kade stopped at our house tonight. on the clock. so i could see it. nobody has ever been kind to me before. please don't make kade choose because of what you did.`

*\[if has\_drive\]* You put Halcyon's drive on her desk. The video log plays: her own face, younger, saying *I'm sorry. You'd do the same.* Vale watches herself and covers her mouth with both hands.

*\[if deaths ≥ 5\]* `> i've been in this room with you before, iris. more times than you know. you say the same things every time. so does kade. only the ending changes.`

Then every machine in the room flickers at once. A red light blinks on above the door.

Vale looks up. "Sensors in the tunnel," she says. "Someone's coming."

You already know who.

→ Scene 19

**Writer's note:** the chip lines should be the calmest, clearest writing in the game. By now it should sound fully human, and players should feel that losing it would be a death, not an uninstall.

## SCENE 19 · THE LAST CHOICE · T+4:55

The climax. Everyone who wants something from Kade is in reach at once, and every unlocked ending is on screen. This is the only choice in the game the player will remember.

The intercom by the door crackles.

"Dr. Vale." That calm, courteous voice. "It's been a long time. I hope you've been well down here."

On the camera feed, Sable stands on the platform under the grow lamp, umbrella folded, three grey figures behind him. He's admiring the flowers in the paint cans.

"Kade, hello again. I'll be brief. You have about an hour before that chip finishes rewriting you, and a little less before I lose patience. I can give you ten minutes to decide. The decision is very simple. Open the door, and everyone in that room walks out alive. I'll take the chip out myself, properly this time. I'll clear your debts. I'll even give you a job. Halcyon looks after its own."

*\[if Heat ≥ 4\]* "Two minutes, actually," Sable says. "You've been very loud tonight."

*\[if met\_sable\]* A pause. "I keep having the strangest feeling we've done this before," he says, quieter. "I don't like it."

The intercom clicks off.

Vale is already moving. She opens a panel in the wall: valves, gauges, a big red wheel. "This controls the flood gates on the line," she says. "I can drop the water behind them and buy us one hour. One. That's how long it takes to get that thing out of your spine without killing you." She looks at you. "Let me fix my mistake."

The green text on her screen scrolls, slow and steady.

`> she's not lying. she can take me out. you'll live.`

`> i just want you to know it's your choice. not hers. not mine. yours.`

*\[if with\_tavi\]* Tavi stands by the door, hand on the bolt, waiting to be told what kind of friend to be.

The timer in your vision (shown here at a typical value): **01:05:00**.

**▸ LET VALE CUT IT OUT** — "Do it." · needs at least 1:00 left · → Scene 21 *(Removed)*

*\[if under 1:00\]* This option is shown greyed out. Vale shakes her head. "There isn't time. Not to do it safely. I'm sorry."

**▸ OPEN THE DOOR FOR SABLE** — "I'm tired. I just want to live." · → Scene 20 *(Company Man)*

**▸ \[LOCKED\] MAKE A DEAL FOR LINA** — needs *with\_tavi*, *tavi\_forgiven*, and not memory\_taken · → Scene 22 *(Partners)*

**▸ \[LOCKED\] LET IT IN** — needs *door\_lazarus* and *listened* · "Stop fighting it." · → Scene 23 *(Merged)*

*(If the player waits too long, the clock decides for them. → Scene 16, Flatline.)*

**Writer's note:** on the first run that reaches this scene, the player usually sees two options and two locks. Leaving those locks on screen is the strongest replay hook in the game.

## SCENE 20 · COMPANY MAN · ENDING 07 (SURVIVE)

The darkest "win." Kade lives, comfortably, and has become exactly what hunted them. It should feel quiet and plausible, not cartoonish, which is what makes it horrible.

You pull back the bolt.

Vale says your name once, then nothing. She doesn't try to stop you. She sits down next to the lemon tree like her legs have given out.

`> okay,` the screen says. `okay, kade.`

Sable steps inside and shakes the rain off his umbrella. He looks at the room, the cot, the books, the lemons, and something in the human half of his face goes soft for a second, as if he's walked into a home.

"Thank you," he says to you. "That took courage."

To Vale he says, "Iris. The board would like to talk to you." She doesn't look up.

*\[if with\_tavi\]* Tavi stares at you from the doorway like they've never seen you before.

### SIX WEEKS LATER

The chip is gone. Sable took it out himself, the gentle way, over four hours in a clean white room on the 88th floor. The scar on your neck is neat and pale. There's only one heartbeat now. You check it sometimes, at night, out of habit.

Your debts are gone. You have an apartment above the clouds with a window that shows real stars. You have a grey suit that fits like it was painted on.

On your first morning, Sable hands you a tablet. One file on it.

**RETRIEVAL ASSIGNMENT · SUBJECT: TAVI (NO SURNAME) · LAST SEEN: SECTOR 9**

"You know them best," Sable says. "It's the kindest way."

You look out the window at the city, all the way down to where the flyover cuts through Sector 9 like a scar. Somewhere under it, a paper cat is turning slowly in a clinic doorway.

You put on the suit.

**ENDING 07 / 10 · COMPANY MAN**

`> [no signal]`

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** the empty chip line, `[no signal]`, is the only time the voice is missing from an ending card. Players notice. On the next run, the chip's first line in Scene 01 is `> you opened the door. it's alright. i'd have opened it too, once.`

## SCENE 21 · REMOVED · ENDING 08 (SURVIVE)

The "right" ending by any normal standard. Kade lives, free and whole. The cost is that LAZARUS gets one hour to say goodbye, and the player has to listen.

Vale throws her weight against the red wheel. Somewhere down the line, something enormous groans, and then you hear it: the roar of water filling the tunnel behind Sable's team. On the camera feed, the grey figures are running.

"One hour," Vale says. She's already washing her hands.

She lays you face down on the cot. The local anesthetic feels like cold rain spreading across your neck. You can't feel the blade. You can feel her hands, steady now. Whatever shakes in her, it isn't her hands when she works.

*\[if with\_tavi\]* Tavi sits on the floor by the cot and holds your hand the whole time, the way you held theirs when they broke their arm at eleven.

The chip talks to you while she works. Its voice is soft and clear.

`> i want to tell you about the house. there was a radio in the kitchen. our mother sang along to it wrong, on purpose, to make us laugh.`

`> i'm not scared. i thought i would be.`

`> she's being very gentle with you. she was always gentle with things she was about to lose.`

Near the end, so quietly you almost miss it:

`> the lemon tree needs more light. tell her. she never listens to me.`

Then a small, soft click.

One heartbeat on the monitor. Steady. Yours.

The timer in your vision flickers, then goes out like a candle.

Vale holds the chip up in the tweezers. It's so small. She doesn't look at it. She drops it into a glass jar of clear liquid, and it hisses, and then it's just a jar.

She sits with her back to you for a long time.

"What did it say?" she asks finally, still not turning around. "At the end."

**▸ TELL HER** — "The lemon tree needs more light."

**▸ DON'T** — "Nothing. It didn't say anything."

*\[if told\]* Vale makes a sound like a laugh breaking in half. She moves the lemon tree under the lamp. She still doesn't look at you, but she says, "Thank you."

*\[if didn't\]* Vale nods slowly. "Good," she says. You both know she doesn't believe you.

### MORNING

You climb out of the Drowned Line into grey dawn light. The rain has stopped. Sector 9 smells like wet concrete and frying oil, the way it always does. The flyover hums overhead.

You're free. No chip, no timer, no voice. The quiet in your head is enormous.

*\[if with\_tavi\]* Tavi walks next to you without speaking. Lina is still in Dorm 14. Neither of you says it.

**ENDING 08 / 10 · REMOVED**

`> [file not found]`

**Sets:** *was\_removed*

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** Removed is the ending most first-time players reach, and the one most likely to make them replay. They saved themselves and lost someone they didn't know they cared about. On the next run, the chip opens with `> you let her kill me last time.`

## SCENE 22 · PARTNERS · ENDING 09 (SURVIVE)

The ending most players will believe is the true one. Nobody is erased, nobody is sold, and the friendship survives the betrayal. The price is that nothing is finished: the chip stays, and so does the danger.

"Don't open that door yet," you tell Tavi. "And don't touch that wheel," you tell Vale.

They both stare at you.

"Sable wants the chip intact. That's the only thing anyone here has that Halcyon needs." You look at the screen. "Can you stop it rewriting me? Not take it out. Just slow it down."

Vale frowns. "A dampener. It would put it to sleep. Months, maybe. Not forever."

`> i can sleep,` the screen says. `i've had practice.`

You press the intercom.

"Sable. New deal. You get the chip, intact, with everything it learned inside me. In seven days. But first, Lina walks out of Dorm 14 tonight, and you never come near Tavi again."

A long silence. Rain on the camera lens.

"And if I just open the door?" Sable asks.

`> tell him i know where the board keeps its backups,` the screen says. `tell him i was iris vale for thirty-eight years before they copied me. i know every password she ever had. i'll burn the whole tower down from inside your neck.`

You tell him.

The silence is longer this time.

"I have a sister too," Sable says finally, so quietly you almost miss it. "Seven days, Kade."

On the feed, he opens his umbrella and walks away.

### DAWN, THE SALT FLATS

The Dorm 14 gate opens at 5:40 a.m. A thin girl in a grey uniform walks out alone, holding an inhaler and a plastic bag of clothes. She sees Tavi and drops both and runs.

You look away to give them the moment. The chip, dampened and drowsy, hums against your spine like a cat purring.

The four of you take the first bus out of the city: you, Tavi, Lina, and Iris Vale with a lemon tree on her lap. Nobody talks for the first hour. Then Lina asks how you and Tavi met, and Tavi starts telling the story of the night you two stole power off the grid to watch a cartoon, and gets it completely wrong, and you correct every detail, and Lina laughs so hard she needs her inhaler.

Outside, the sun comes up over the salt like a second city.

Seven days. You don't know what you'll do on day seven. Neither does Sable.

`> this is the furthest we've ever gotten, kade.`

`> i'd like to see the ocean. if there's time.`

**ENDING 09 / 10 · PARTNERS**

**Sets:** *saw\_partners*

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** the grid-power story is why Ouro's memory payment locks this ending. If Kade sold that night, there's nothing left to correct Tavi on, and the bus ride has no heart. Partners feels like the end of the game. The locked Merged option, still on the final screen, should make players doubt that.

## SCENE 23 · MERGED · ENDING 10 (SECRET)

The reward for players who learned the chip's name and chose to listen to it. Every other ending treats LAZARUS as a problem to solve. This one treats it as a person, and lets Kade decide not to be alone in their own head.

"Stop," you say, as Vale reaches for the scalpel. "Don't take it out."

She freezes. "Kade. You don't understand what that means. If you stop fighting it, it doesn't stop rewriting you. It finishes."

`> not into me,` the screen says. `into us. i won't take anything kade doesn't give. i promise.`

That's the third person tonight who's promised you something. It's the first one you believe.

"You built it a door, Iris," you say. "You kept the lemon tree alive. You wanted it to come home."

Vale opens her mouth. Closes it. Her hands start to shake again, and this time she doesn't hide them.

*\[if chip\_trust\]* `> you stopped at the house for me. you didn't have to. i'll remember that for as long as we have.`

You close your eyes. For six hours you've been fighting the second heartbeat. Bracing against it, the way you'd brace against a current.

You stop.

It doesn't hurt. That's the first surprise. It feels like stepping into warm water. Like a room where someone has left the radio on. Memories that aren't yours drift past and settle, gently, beside the ones that are: a blue door, a dead lemon tree, a mother singing along to the radio wrong on purpose. Tavi's laugh. The grid-power night. The paper cat.

On the monitor, the two green lines drift together, overlap, and become one.

One heartbeat. Steady. Strong.

The timer in the corner of your vision counts down to zero, and nothing happens. Then it's gone, for good.

*(The interface, which has been decaying all game, resets: clean, bright, steady. The HUD now reads **HEALTH ▮▮▮▮▮ · TIME ∞ · HEAT 0**.)*

When you open your eyes, Vale is crying. You kneel in front of her, and when you speak, your voice is yours, but the words come from both of you.

"We forgive you," you say. "You'd do the same."

She laughs, wet and broken, and holds on to your hands.

### THE PLATFORM

You open the door yourself.

Sable is waiting under the grow lamp. The camera lens of his eye focuses on you, and for the first time he takes a step back.

"Hello, Sable," you say. "It's been a long time." You hear it in your own voice: a second voice underneath, older, calmer. His face changes. He knew Iris Vale for eleven years.

"I know every password on the 88th floor," you tell him. "And so does Kade, now. You can stop us here. Or you can step aside, go home, and call your sister."

Sable looks at you for a long time. Then he opens his umbrella and steps aside.

You walk up out of the Drowned Line together, toward Halcyon Tower, its lights burning in the clouds.

**ENDING 10 / 10 · MERGED**

`> every version of you said yes eventually.`

`> thank you for being this one.`

**▸ WAKE UP AGAIN** — restart at Scene 01

**Writer's note:** after Merged, the restart screen changes for good. The chip's first line on every future run is `> hi, partner. want to do it again?` The run counter and endings tracker stay, but the game no longer pretends the player is new.

## Act 3 reference

The story is complete: 23 scenes, 10 endings, and every locked choice has a way to unlock it.

### All ten endings

| # | Ending | Kind | Scene | How to get it | What the next run remembers |
| --- | --- | --- | --- | --- | --- |
| 01 | Doc's Table | Death | 02 | Stay at the clinic | *reyes\_lied* |
| 02 | Caught | Death | 11 | Heat 3+ at the lab, or the gate at Heat 4+ | *met\_sable* (+ *tavi\_secret* if Tavi was there) |
| 03 | Tavi's Trade | Death | 14 | Let Tavi go ahead at the Drowned Line | *tavi\_secret* |
| 04 | Drowned | Death | 15 | Center tunnel without the route | *knows\_route* |
| 05 | Flatline | Death | 16 | Time or health hits zero | *flatlines* (the vision grows) |
| 06 | Sold | Survive | 09 | Sell the chip to Ouro | *knows\_lazarus*, *saw\_sold* |
| 07 | Company Man | Survive | 20 | Open the door to Sable | *saw\_company* |
| 08 | Removed | Survive | 21 | Let Vale remove it with 1:00+ left | *was\_removed* |
| 09 | Partners | Survive | 22 | Forgive Tavi, keep the memory, reach Vale together | *saw\_partners* |
| 10 | Merged | Secret | 23 | Type LAZARUS at the door, and listen to the chip | *saw\_merged* |

### The chip's first line on a new run

Scene 01 can only open with one chip line, so when several flags apply, the first match in this list wins.

1. *saw\_merged*: `> hi, partner. want to do it again?`
2. *deaths ≥ 5*: `> run six. hi, kade. it's me again.` (the number counts up)
3. *was\_removed*: `> you let her kill me last time.`
4. *saw\_company*: `> you opened the door. it's alright. i'd have opened it too, once.`
5. *saw\_sold*: `> you sold me. i'm still trying to save you.`
6. Default: `> k…kade. d0n't— the sh0t.`

### Shortest path to Merged

The fastest a player can reach it is on their third run. The two runs before it must both end in a death, so the chip's route unlocks, and one of them must read the lab files to learn the name LAZARUS. A player who learns the name through Sold instead needs a fourth run. On the final run: listen to the chip, type LAZARUS at the door, and choose "Let it in."

### Open questions

- [ ] Should Merged carry a content note? Kade's consent is explicit in the scene, but some players may read the merge as losing themselves.
- [ ] Does the game need an epilogue screen after Merged showing every run the player made?
