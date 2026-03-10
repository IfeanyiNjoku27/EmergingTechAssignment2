import React, { useState } from "react";
import {
  Container,
  Tab,
  Tabs,
  Card,
  Form,
  Button,
  Table,
  Spinner,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_TOURNAMENTS, GET_PLAYERS } from "../graphql/queries"; 
import {
  CREATE_TOURNAMENT_MUTATION,
  UPDATE_TOURNAMENT_MUTATION,
  DELETE_TOURNAMENT_MUTATION,
  CREATE_USER_MUTATION,
  ASSIGN_PLAYER_MUTATION,
} from "../graphql/mutations";

const AdminDashboard = () => {
  const [key, setKey] = useState("tournaments");
  const [tourneyData, setTourneyData] = useState({
    name: "",
    game: "",
    date: "",
    status: "Upcoming",
  });
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Player",
  });
  const [assignData, setAssignData] = useState({
    playerId: "",
    tournamentId: "",
  });

  // edit state
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    game: "",
    date: "",
    status: "",
  });

  //  Apollo Hooks 
  const { loading: tourneyLoading, data: tourneyDataRes } = useQuery(GET_TOURNAMENTS);
  const { loading: userLoading, data: userDataRes } = useQuery(GET_USERS);
  const { loading: playerLoading, data: playerDataRes } = useQuery(GET_PLAYERS);


  const [createTournament] = useMutation(CREATE_TOURNAMENT_MUTATION, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
  const [updateTournament] = useMutation(UPDATE_TOURNAMENT_MUTATION, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
  const [deleteTournament] = useMutation(DELETE_TOURNAMENT_MUTATION, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [{ query: GET_USERS }],
  });
  const [assignPlayer] = useMutation(ASSIGN_PLAYER_MUTATION);

  // functions
  const handleTourneySubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date(tourneyData.date).toISOString(); 
      await createTournament({
        variables: {
          ...tourneyData,
          date: formattedDate,
        },
      });
      setTourneyData({
        name: "",
        game: "",
        date: "",
        status: "Upcoming",
      });
      alert("Tournament Created!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      try {
        await deleteTournament({ variables: { id } });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditOpen = (tourney) => {
    setEditData({
      id: tourney.id,
      name: tourney.name,
      game: tourney.game,
      // Format date 
      date: new Date(Number(tourney.date) || tourney.date)
        .toISOString()
        .split("T")[0],
      status: tourney.status,
    });
    setShowEdit(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date(editData.date).toISOString();
      await updateTournament({
        variables: {
          ...editData,
          date: formattedDate,
        },
      });
      setShowEdit(false);
      alert("Tournament Updated!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ variables: { ...userData } });
      setUserData({ username: '', email: '', password: '', role: 'Player' });
      alert('User Registered!');
    } catch (err) { console.error(err); }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignPlayer({ variables: { ...assignData } });
      setAssignData({ playerId: '', tournamentId: '' });
      alert('Player Assigned!');
    } catch (err) { console.error(err); }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-light mb-4">Nexus Admin Override</h2>
      <Card className="bg-dark text-light border-info">
        <Card.Body>
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-4 custom-tabs"
          >
            {/* --- TOURNAMENTS TAB --- */}
            <Tab eventKey="tournaments" title="Manage Tournaments">
              <h5 className="text-info mt-3">Deploy New Tournament</h5>
              <Form onSubmit={handleTourneySubmit} className="mb-5">
                <Row className="mb-2">
                  <Col md={3}>
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      value={tourneyData.name}
                      onChange={(e) =>
                        setTourneyData({ ...tourneyData, name: e.target.value })
                      }
                      required
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="text"
                      placeholder="Game"
                      value={tourneyData.game}
                      onChange={(e) =>
                        setTourneyData({ ...tourneyData, game: e.target.value })
                      }
                      required
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="date"
                      value={tourneyData.date}
                      onChange={(e) =>
                        setTourneyData({ ...tourneyData, date: e.target.value })
                      }
                      required
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={tourneyData.status}
                      onChange={(e) =>
                        setTourneyData({
                          ...tourneyData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </Form.Select>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Button
                      variant="outline-info"
                      type="submit"
                      className="w-100"
                    >
                      Create Tournament
                    </Button>
                  </Col>
                </Row>
              </Form>

              <h5 className="text-info">Active Grids</h5>
              {tourneyLoading && <Spinner animation="border" variant="info" />}
              {tourneyDataRes && (
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Game</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourneyDataRes.getTournaments.map((t) => (
                      <tr key={t.id}>
                        <td>{t.name}</td>
                        <td>{t.game}</td>
                        {/* Safe date rendering */}
                        <td>
                          {new Date(
                            Number(t.date) || t.date,
                          ).toLocaleDateString() !== "Invalid Date"
                            ? new Date(
                                Number(t.date) || t.date,
                              ).toLocaleDateString()
                            : t.date}
                        </td>
                        <td>{t.status}</td>
                        <td>
                          <Button
                            variant="sm btn-outline-info me-2"
                            onClick={() => handleEditOpen(t)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="sm btn-outline-danger"
                            onClick={() => handleDelete(t.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>

            {/* --- USERS TAB --- */}
           {/* --- USERS & ASSIGNMENTS TAB --- */}
            <Tab eventKey="users" title="Users & Assignments">
              <h5 className="text-info mt-3">Register System User</h5>
              <Form onSubmit={handleUserSubmit} className="mb-4">
                 <Row>
                  <Col md={3}><Form.Control type="text" placeholder="Username" value={userData.username} onChange={(e) => setUserData({...userData, username: e.target.value})} required /></Col>
                  <Col md={3}><Form.Control type="email" placeholder="Email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} required /></Col>
                  <Col md={3}><Form.Control type="password" placeholder="Password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} required /></Col>
                  <Col md={2}>
                    <Form.Select value={userData.role} onChange={(e) => setUserData({...userData, role: e.target.value})}>
                      <option value="Player">Player</option>
                      <option value="Admin">Admin</option>
                    </Form.Select>
                  </Col>
                  <Col md={1}><Button variant="outline-info" type="submit" className="w-100">+</Button></Col>
                 </Row>
              </Form>

              <h5 className="text-info mt-4">Assign Player to Tournament</h5>
              <Form onSubmit={handleAssignSubmit} className="mb-5">
                <Row>
                  <Col md={5}>
                    <Form.Select value={assignData.playerId} onChange={(e) => setAssignData({...assignData, playerId: e.target.value})} required>
                      <option value="">Select Player...</option>
                      {/* Mapping through getPlayers instead of getUsers */}
                      {playerDataRes?.getPlayers?.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.user ? p.user.username : 'Unknown'}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={5}>
                    <Form.Select value={assignData.tournamentId} onChange={(e) => setAssignData({...assignData, tournamentId: e.target.value})} required>
                      <option value="">Select Tournament...</option>
                      {/* Using optional chaining to safely map the getTournaments array */}
                      {tourneyDataRes?.getTournaments?.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}><Button variant="outline-info" type="submit" className="w-100">Assign</Button></Col>
                </Row>
              </Form>

              <h5 className="text-info">System Users</h5>
              {userLoading && <Spinner animation="border" variant="info" />}
              {userDataRes && (
                <Table striped bordered hover variant="dark">
                  <thead><tr><th>Username</th><th>Email</th><th>Role</th></tr></thead>
                  <tbody>
                    {/* Safely mapping out the user list */}
                    {userDataRes?.getUsers?.map(u => (
                      <tr key={u.id}><td>{u.username}</td><td>{u.email}</td><td>{u.role}</td></tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* --- EDIT MODAL --- */}
      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        className="bg-dark text-light"
        data-bs-theme="dark"
      >
        <Modal.Header closeButton className="border-info">
          <Modal.Title className="text-info">Edit Tournament Data</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Game</Form.Label>
              <Form.Control
                type="text"
                value={editData.game}
                onChange={(e) =>
                  setEditData({ ...editData, game: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
            <Button variant="outline-info" type="submit" className="w-100">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
