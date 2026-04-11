import React, { useState } from 'react';
import { Container, Tab, Tabs, Card, Button, Row, Col, Spinner, Table } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_UPCOMING_TOURNAMENTS, GET_MY_TOURNAMENTS } from '../graphql/queries';
import { JOIN_TOURNAMENT_MUTATION } from '../graphql/mutations';

// FIX: Corrected spelling error in dashboard welcome header

const PlayerDashboard = () => {
  const [key, setKey] = useState('upcoming');

  //  hooks
  const { loading: upcomingLoading, error: upcomingError, data: upcomingData } = useQuery(GET_UPCOMING_TOURNAMENTS);
  const { loading: historyLoading, data: historyData } = useQuery(GET_MY_TOURNAMENTS);
  
  // join mutation. Refetch the history query so the UI updates instantly
  const [joinTournament] = useMutation(JOIN_TOURNAMENT_MUTATION, {
    refetchQueries: [{ query: GET_MY_TOURNAMENTS }] 
  });

  const handleJoin = async (id) => {
    try {
      await joinTournament({ variables: { tournamentId: id } });
      alert('Successfully joined the arena!');
      setKey('history'); // Flip to history tab
    } catch (err) {
      console.error(err);
      alert('Failed to join. You might already be registered!');
    }
  };

  // function to parse dates
  const formatDate = (dateValue) => {
    const parsed = new Date(Number(dateValue) || dateValue);
    return parsed.toLocaleDateString() !== 'Invalid Date' ? parsed.toLocaleDateString() : dateValue;
  };

  return (
    <Container className="mt-5">
      <h2 className="text-light mb-4">Player Hub</h2>
      <Card className="bg-dark text-light border-danger">
        <Card.Body>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4 custom-tabs">
            
            {/* --- UPCOMING TOURNAMENTS TAB --- */}
            <Tab eventKey="upcoming" title="Available Arenas">
              {upcomingLoading && <Spinner animation="border" variant="danger" className="mt-3" />}
              {upcomingError && <p className="text-danger mt-3">Failed to load arenas.</p>}
              
              <Row className="mt-3">
                {upcomingData?.getUpcomingTournaments?.map(tourney => (
                  <Col md={4} key={tourney.id} className="mb-3">
                    <Card className="bg-secondary text-white border-0 h-100">
                      <Card.Body>
                        <Card.Title className="text-danger">{tourney.name}</Card.Title>
                        <Card.Text>
                          <strong>Game:</strong> {tourney.game} <br />
                          <strong>Date:</strong> {formatDate(tourney.date)} <br/>
                        </Card.Text>
                        <Button variant="outline-danger" onClick={() => handleJoin(tourney.id)}>
                          Join Roster
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
                {upcomingData?.getUpcomingTournaments?.length === 0 && <p>No upcoming arenas available.</p>}
              </Row>
            </Tab>

            {/* --- COMBAT LOG (HISTORY) TAB --- */}
            <Tab eventKey="history" title="Combat Log">
               <h5 className="text-danger mt-3">Your Registrations</h5>
               {historyLoading && <Spinner animation="border" variant="danger" />}
               
               {!historyLoading && historyData?.getMyTournaments?.length === 0 && (
                 <p className="mt-3">You have not joined any arenas yet.</p>
               )}
               
               {historyData?.getMyTournaments?.length > 0 && (
                 <Table striped bordered hover variant="dark" className="mt-3">
                   <thead>
                     <tr>
                       <th>Tournament Name</th>
                       <th>Game</th>
                       <th>Date</th>
                       <th>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {historyData.getMyTournaments.map(tourney => (
                       <tr key={tourney.id}>
                         <td>{tourney.name}</td>
                         <td>{tourney.game}</td>
                         <td>{formatDate(tourney.date)}</td>
                         <td>
                           <span className={`badge ${tourney.status === 'Completed' ? 'bg-secondary' : 'bg-danger'}`}>
                             {tourney.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </Table>
               )}
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlayerDashboard;