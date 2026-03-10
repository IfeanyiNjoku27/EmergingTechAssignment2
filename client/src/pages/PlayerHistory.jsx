import { useQuery, useMutation } from '@apollo/client';
import TournamentCard from '../components/TournamentCard';
import { GET_MY_TOURNAMENTS } from '../graphql/queries';
import { LEAVE_TOURNAMENT_MUTATION } from '../graphql/mutations';

const PlayerHistory = () => {
  const { data, loading, refetch } = useQuery(GET_MY_TOURNAMENTS);
  const [leaveTournament] = useMutation(LEAVE_TOURNAMENT_MUTATION, {
    onCompleted: () => refetch(),
  });

  const myTournaments = data?.getMyTournaments || [];
  const completed = myTournaments.filter((t) => t.status === 'Completed');
  const active = myTournaments.filter((t) => t.status !== 'Completed');

  const handleLeave = async (tournamentId) => {
    if (!confirm('Leave this tournament?')) return;
    try {
      await leaveTournament({ variables: { tournamentId } });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading-screen" aria-label="Loading history">Loading tournament history...</div>;

  return (
    <main className="page-content" aria-label="My Tournament History">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-accent">◈</span> MY TOURNAMENT HISTORY
        </h1>
        <p className="page-subtitle">Your battles, past and present.</p>
      </div>

      {myTournaments.length === 0 ? (
        <div className="empty-state" role="status">
          <span aria-hidden="true">⚔️</span>
          <p>You haven't joined any tournaments yet.</p>
          <a href="/player/tournaments" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Browse Tournaments
          </a>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section className="section" aria-label="Active and upcoming tournaments">
              <div className="section-header">
                <h2 className="section-title">Active & Upcoming</h2>
                <span className="section-count">{active.length}</span>
              </div>
              <div className="card-grid" role="list">
                {active.map((t) => (
                  <div key={t.id} role="listitem">
                    <TournamentCard
                      tournament={t}
                      onLeave={handleLeave}
                      isJoined={true}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section className="section" aria-label="Completed tournaments">
              <div className="section-header">
                <h2 className="section-title">Completed</h2>
                <span className="section-count">{completed.length}</span>
              </div>
              <div className="card-grid" role="list">
                {completed.map((t) => (
                  <div key={t.id} role="listitem">
                    <TournamentCard tournament={t} isJoined={true} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default PlayerHistory;
