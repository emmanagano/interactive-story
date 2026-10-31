import type { LoadStatus } from '../engine'
import './GameNotices.css'

type Props = {
  loadStatus: LoadStatus
  saveFailed: boolean
  reachedUnwrittenScene: boolean
}

/** Plain notices for things that are not part of the story: saving problems and unwritten Act 2. */
function GameNotices({ loadStatus, saveFailed, reachedUnwrittenScene }: Props) {
  return (
    <div className="game-notices" role="status">
      {loadStatus === 'corrupted' && <p>Your saved progress couldn't be read, so this is a fresh start.</p>}
      {(loadStatus === 'unavailable' || saveFailed) && <p>Progress can't be saved in this browser.</p>}
      {reachedUnwrittenScene && <p>That road leads into part of the story that isn't written yet. Choose another.</p>}
    </div>
  )
}

export default GameNotices
