import React, { useContext } from 'react';
import { Button, Row, Container } from 'reactstrap';
import { AuthenticatorContext } from '../../../../core/authentication';
import { DispatchContext } from '../../contexts';

function UserConfig(props) {
  const auth = useContext(AuthenticatorContext);
  const dispatch = useContext(DispatchContext);
  return (
    <Container>
      <Row>
        <Button className="col-xs-6 m-2" onClick={() => auth.logout()}>
          Logout
        </Button>
        <Button
          className="col-xs-6 m-2"
          onClick={() =>
            dispatch({ type: 'ADD_PLAYER', payload: { name: 'Player X' } })
          }
        >
          AddUser
        </Button>
      </Row>
    </Container>
  );
}

export default UserConfig;
