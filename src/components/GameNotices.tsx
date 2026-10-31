import type { LoadStatus } from '../engine'
import './GameNotices.css'

type Props = {
  loadStatus: LoadStatus
  saveFailed: boolean
}

/** Plain notices for things that are not part of the story: problems reading or saving progress. */
function GameNotices({ loadStatus, saveFailed }: Props) {
  return (
    <div className="game-notices" role="status">
      {loadStatus === 'corrupted' && <p>Your saved progress couldn't be read, so this is a fresh start.</p>}
      {(loadStatus === 'unavailable' || saveFailed) && <p>Progress can't be saved in this browser.</p>}
    </div>
  )
}

export default GameNotices
