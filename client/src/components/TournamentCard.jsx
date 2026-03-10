const statusColors = {
  Upcoming: '#39ff14',
  Ongoing: '#00f5ff',
  Completed: '#888',
};

const TournamentCard = ({ tournament, onJoin, onLeave, isJoined, isAdmin, onDelete, onEdit, onAssign }) => {
  const statusColor = statusColors[tournament.status] || '#888';
  const spotsLeft = tournament.maxPlayers - (tournament.players?.length || 0);

  return (
    <article className="tournament-card" aria-label={`Tournament: ${tournament.name}`}>
      <div className="card-glow" style={{ '--glow-color': statusColor }} aria-hidden="true" />

      <div className="card-header">
        <div>
          <h3 className="card-title">{tournament.name}</h3>
          <p className="card-game">🎮 {tournament.game}</p>
        </div>
        <span
          className="status-badge"
          style={{ color: statusColor, borderColor: statusColor }}
          aria-label={`Status: ${tournament.status}`}
        >
          {tournament.status}
        </span>
      </div>

      <div className="card-stats">
        <div className="stat">
          <span className="stat-label">DATE</span>
          <span className="stat-value">
            {new Date(tournament.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">PLAYERS</span>
          <span className="stat-value">
            {tournament.players?.length || 0}/{tournament.maxPlayers}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">PRIZE</span>
          <span className="stat-value prize">{tournament.prizePool}</span>
        </div>
        <div className="stat">
          <span className="stat-label">SPOTS LEFT</span>
          <span className="stat-value" style={{ color: spotsLeft === 0 ? '#ff2d78' : '#39ff14' }}>
            {spotsLeft === 0 ? 'FULL' : spotsLeft}
          </span>
        </div>
      </div>

      <div className="card-actions">
        {/* Player actions */}
        {!isAdmin && onJoin && !isJoined && tournament.status === 'Upcoming' && spotsLeft > 0 && (
          <button
            className="btn-primary"
            onClick={() => onJoin(tournament.id)}
            aria-label={`Join tournament: ${tournament.name}`}
          >
            JOIN
          </button>
        )}
        {!isAdmin && onLeave && isJoined && (
          <button
            className="btn-danger"
            onClick={() => onLeave(tournament.id)}
            aria-label={`Leave tournament: ${tournament.name}`}
          >
            LEAVE
          </button>
        )}
        {!isAdmin && isJoined && (
          <span className="joined-badge" aria-label="You have joined this tournament">✓ ENROLLED</span>
        )}

        {/* Admin actions */}
        {isAdmin && (
          <>
            {onAssign && (
              <button
                className="btn-secondary"
                onClick={() => onAssign(tournament)}
                aria-label={`Assign player to ${tournament.name}`}
              >
                ASSIGN
              </button>
            )}
            {onEdit && (
              <button
                className="btn-secondary"
                onClick={() => onEdit(tournament)}
                aria-label={`Edit tournament: ${tournament.name}`}
              >
                EDIT
              </button>
            )}
            {onDelete && (
              <button
                className="btn-danger"
                onClick={() => onDelete(tournament.id)}
                aria-label={`Delete tournament: ${tournament.name}`}
              >
                DELETE
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
};

export default TournamentCard;
