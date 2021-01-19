import React, { useContext, useState } from 'react';
import {
  Container,
  Row,
  Card,
  CardBody,
  CardTitle,
  Form,
  Input,
  Col,
  Button,
  Alert,
} from 'reactstrap';
import { AuthenticatorContext } from '../../core/authentication';
import Layout from '../../sharedComponents/Layout';
import { useHistory } from 'react-router-dom';

function Login(props) {
  const auth = useContext(AuthenticatorContext);
  const [data, setData] = useState({
    user: '',
    password: '',
    error: null,
    pending: false,
  });

  const history = useHistory();

  function login() {
    setData({ ...data, pending: true });
    auth
      .login(data.user, data.password)
      .then((x) => {
        setData({ ...data, error: null, pending: false });
        history.push('/');
      })
      .catch((x) =>
        setData({
          ...data,
          error:
            (x.response && 'Incorrect user details') || 'Server unreachable',
          pending: false,
          password: '',
        })
      )
      .then((x) => console.log(data));
  }

  return (
    <Layout>
      <Container>
        <Row>
          <Col sm="9" md="7" lg="5" className={'mx-auto mt-5'}>
            <Card>
              <CardBody>
                <CardTitle>Sign in</CardTitle>
                {data.error && <Alert color="danger">{data.error}</Alert>}
                <Form
                  onSubmit={(event) => {
                    event.preventDefault();
                    !data.pending && login();
                  }}
                >
                  <div className="form-group">
                    <Input
                      type="text"
                      name="username"
                      value={data.user}
                      placeholder="Username"
                      onChange={(e) =>
                        setData({ ...data, user: e.target.value })
                      }
                      disabled={data.pending}
                    />
                  </div>

                  <div className="form-group">
                    <Input
                      type="password"
                      name="password"
                      value={data.password}
                      placeholder="Password"
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                      disabled={data.pending}
                    />
                  </div>
                  <Button type="submit" className="w-100 bg-primary">
                    Sign in
                    {data.pending && (
                      <>
                        &nbsp;
                        <div
                          class="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => auth.loginWithProvider('google')}
                    className="w-100 mt-2"
                  >
                    Google Auth
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default Login;
