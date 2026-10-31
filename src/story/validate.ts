import { FLATLINE_SCENE_ID, START_SCENE_ID } from '../engine/constants'

export type ValidationOptions = {
  placeholderSceneIds: string[]
  flagsSetByLaterActs: string[]
}

const BLOCK_TYPES = ['text', 'chip', 'system']
const ENDING_KINDS = ['death', 'survive', 'secret']
const STAT_NAMES = ['time', 'health', 'heat', 'deaths', 'flatlines']
const EFFECT_KEYS = ['time', 'health', 'heat', 'setRunFlags', 'setMemoryFlags', 'addItem', 'useItem', 'blur']

type Record_ = Record<string, unknown>

function isRecord(value: unknown): value is Record_ {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isTextList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

/** What the scenes use and provide, gathered while checking, then cross-checked at the end. */
type Facts = {
  flagsUsed: Map<string, string>
  flagsSet: Set<string>
  itemsUsed: Map<string, string>
  itemsAdded: Set<string>
  gotos: { from: string; where: string; target: string }[]
}

/**
 * Checks story data the way the engine will use it, and returns every problem found
 * as a readable sentence. An empty list means the story is sound. It takes `unknown`
 * because JSON imports are only trusted once this has passed.
 */
export function validateStory(files: unknown[], options: ValidationOptions): string[] {
  const problems: string[] = []
  const facts: Facts = {
    flagsUsed: new Map(),
    flagsSet: new Set(),
    itemsUsed: new Map(),
    itemsAdded: new Set(),
    gotos: [],
  }
  const sceneIds = new Set<string>()
  const endingIds = new Map<string, string>()
  const endingNumbers = new Map<number, string>()

  function checkCondition(value: unknown, where: string): void {
    if (!isRecord(value)) return void problems.push(`${where}: a condition must be an object`)
    if (typeof value.flag === 'string') facts.flagsUsed.set(value.flag, where)
    else if (typeof value.item === 'string') facts.itemsUsed.set(value.item, where)
    else if (value.blurred === true) return
    else if ('not' in value) checkCondition(value.not, where)
    else if (Array.isArray(value.all)) value.all.forEach((part) => checkCondition(part, where))
    else if (Array.isArray(value.any)) value.any.forEach((part) => checkCondition(part, where))
    else if (typeof value.stat === 'string') {
      if (!STAT_NAMES.includes(value.stat)) problems.push(`${where}: unknown stat "${value.stat}"`)
      for (const bound of ['gte', 'lte']) {
        if (bound in value && typeof value[bound] !== 'number') problems.push(`${where}: ${bound} must be a number`)
      }
    } else problems.push(`${where}: unrecognised condition ${JSON.stringify(value)}`)
  }

  function checkEffect(value: unknown, where: string): void {
    if (!isRecord(value)) return void problems.push(`${where}: an effect must be an object`)
    for (const key of Object.keys(value)) {
      if (!EFFECT_KEYS.includes(key)) problems.push(`${where}: unknown effect field "${key}"`)
    }
    for (const key of ['time', 'health', 'heat']) {
      if (key in value && !Number.isInteger(value[key])) problems.push(`${where}: ${key} must be a whole number`)
    }
    for (const key of ['setRunFlags', 'setMemoryFlags']) {
      if (!(key in value)) continue
      if (isTextList(value[key])) value[key].forEach((flag) => facts.flagsSet.add(flag))
      else problems.push(`${where}: ${key} must be a list of text`)
    }
    if (typeof value.addItem === 'string') facts.itemsAdded.add(value.addItem)
    if (typeof value.useItem === 'string') facts.itemsUsed.set(value.useItem, where)
    if ('blur' in value && value.blur !== true) problems.push(`${where}: blur can only be true`)
  }

  function checkText(text: string, where: string, isChip: boolean): void {
    if (text.trim() === '') problems.push(`${where}: text is empty`)
    // Script markup that should never reach the player.
    for (const leak of ['[if', '\\_', '\\[', "Writer's note", '▸']) {
      if (text.includes(leak)) problems.push(`${where}: script markup "${leak}" leaked into the text`)
    }
    if (isChip && text.startsWith('> ')) problems.push(`${where}: chip text must not start with "> " (the chip line adds it)`)
  }

  function checkScene(scene: unknown, index: number): void {
    if (!isRecord(scene) || typeof scene.id !== 'string') {
      return void problems.push(`scene #${index + 1}: needs a text id`)
    }
    const id = scene.id
    if (sceneIds.has(id)) problems.push(`${id}: scene id is used twice`)
    sceneIds.add(id)

    if (![1, 2, 3].includes(scene.act as number)) problems.push(`${id}: act must be 1, 2 or 3`)
    if (typeof scene.title !== 'string' || scene.title === '') problems.push(`${id}: needs a title`)

    const blocks = Array.isArray(scene.blocks) ? scene.blocks : (problems.push(`${id}: blocks must be a list`), [])
    blocks.forEach((block, position) => {
      const where = `${id} › block ${position + 1}`
      if (!isRecord(block) || !BLOCK_TYPES.includes(block.type as string) || typeof block.text !== 'string') {
        return void problems.push(`${where}: needs a type (text, chip or system) and text`)
      }
      checkText(block.text, where, block.type === 'chip')
      if ('when' in block) checkCondition(block.when, where)
    })

    const choices = Array.isArray(scene.choices) ? scene.choices : (problems.push(`${id}: choices must be a list`), [])
    const choiceIds = new Set<string>()
    choices.forEach((choice, position) => {
      if (!isRecord(choice) || typeof choice.id !== 'string') {
        return void problems.push(`${id} › choice ${position + 1}: needs a text id`)
      }
      const where = `${id} › choice "${choice.id}"`
      if (choiceIds.has(choice.id)) problems.push(`${where}: choice id is used twice in this scene`)
      choiceIds.add(choice.id)
      if (typeof choice.label !== 'string' || choice.label === '') problems.push(`${where}: needs a label`)
      if (typeof choice.text === 'string') checkText(choice.text, where, false)
      if (typeof choice.goto === 'string') facts.gotos.push({ from: id, where, target: choice.goto })
      else problems.push(`${where}: needs a goto`)
      for (const key of ['requires', 'hiddenUnless']) {
        if (key in choice) checkCondition(choice[key], `${where} ${key}`)
      }
      if ('effect' in choice) checkEffect(choice.effect, `${where} effect`)
      if (Array.isArray(choice.gotoIf)) {
        choice.gotoIf.forEach((branch: unknown) => {
          if (!isRecord(branch) || typeof branch.goto !== 'string') {
            return void problems.push(`${where}: each gotoIf branch needs a when and a goto`)
          }
          checkCondition(branch.when, `${where} gotoIf`)
          facts.gotos.push({ from: id, where: `${where} gotoIf`, target: branch.goto })
        })
      }
    })

    if (Array.isArray(scene.onEnter)) {
      scene.onEnter.forEach((entry: unknown, position: number) => {
        const where = `${id} › onEnter ${position + 1}`
        if (!isRecord(entry)) return void problems.push(`${where}: must be an object`)
        if ('when' in entry) checkCondition(entry.when, where)
        checkEffect(entry.effect, `${where} effect`)
      })
    }

    if (scene.ending === undefined) {
      if (choices.length === 0) problems.push(`${id}: has no choices and is not an ending, so the player would be stuck`)
      return
    }
    const ending = scene.ending
    if (!isRecord(ending) || typeof ending.id !== 'string' || !ENDING_KINDS.includes(ending.kind as string) || !Number.isInteger(ending.number)) {
      return void problems.push(`${id}: ending needs an id, a kind (death, survive or secret) and a whole number`)
    }
    if (choices.length > 0) problems.push(`${id}: an ending scene must not have choices`)
    const earlierId = endingIds.get(ending.id)
    if (earlierId) problems.push(`${id}: ending id "${ending.id}" is already used by ${earlierId}`)
    endingIds.set(ending.id, id)
    const earlierNumber = endingNumbers.get(ending.number as number)
    if (earlierNumber) problems.push(`${id}: ending number ${String(ending.number)} is already used by ${earlierNumber}`)
    endingNumbers.set(ending.number as number, id)
  }

  files.forEach((file, fileNumber) => {
    if (!Array.isArray(file)) return void problems.push(`story file #${fileNumber + 1}: must be a list of scenes`)
    file.forEach(checkScene)
  })

  // Cross-checks, now that every scene is known.
  const { placeholderSceneIds, flagsSetByLaterActs } = options
  for (const { where, target } of facts.gotos) {
    if (!sceneIds.has(target) && !placeholderSceneIds.includes(target)) {
      problems.push(`${where}: goto "${target}" does not exist`)
    }
  }
  for (const placeholder of placeholderSceneIds) {
    if (sceneIds.has(placeholder)) problems.push(`placeholder "${placeholder}" now exists, so remove it from PLACEHOLDER_SCENE_IDS`)
  }
  for (const required of [START_SCENE_ID, FLATLINE_SCENE_ID]) {
    if (!sceneIds.has(required) && !placeholderSceneIds.includes(required)) {
      problems.push(`the engine needs a scene "${required}"`)
    }
  }

  for (const [flag, where] of facts.flagsUsed) {
    if (!facts.flagsSet.has(flag) && !flagsSetByLaterActs.includes(flag)) {
      problems.push(`${where}: flag "${flag}" is used but never set anywhere`)
    }
  }
  for (const flag of flagsSetByLaterActs) {
    if (facts.flagsSet.has(flag)) problems.push(`flag "${flag}" is now set in the story, so remove it from FLAGS_SET_BY_LATER_ACTS`)
  }
  for (const [item, where] of facts.itemsUsed) {
    if (!facts.itemsAdded.has(item)) problems.push(`${where}: item "${item}" is used but never added anywhere`)
  }

  // Every scene should be reachable: from the start, or from the engine's flatline redirect.
  const reached = new Set<string>()
  const queue = [START_SCENE_ID, FLATLINE_SCENE_ID]
  while (queue.length > 0) {
    const current = queue.pop()
    if (current === undefined || reached.has(current)) continue
    reached.add(current)
    facts.gotos.filter((link) => link.from === current).forEach((link) => queue.push(link.target))
  }
  for (const id of sceneIds) {
    if (!reached.has(id)) problems.push(`${id}: no choice leads here, so no one can reach it`)
  }

  return problems
}
