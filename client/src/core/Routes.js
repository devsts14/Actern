import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';

// Auth routes
import Alert from '../components/Layout/Alert';
import Home from './Home';
import Signup from '../components/Auth/Signup';
import Activate from '../components/Auth/Activate';
import Signin from '../components/Auth/Signin';
import Reset from '../components/Auth/Reset';
import Forgot from '../components/Auth/Forgot';

// profile Routes
import Profile from '../components/Profile/Profile';
import EditProfile from '../components/Profile/EditProfile';
import SingleProfile from '../components/Profile/SingleProfile';
// private and admin routes
import PrivateRoute from '../components/Auth/PrivateRoute.js';
// import AdminRoute from '../components/Auth/AdminRoute.js';

// post routes
import CreatePost from '../components/post/CreatePost';

// modal
import Modal from './Modal';


// Redux
import { Provider } from 'react-redux';
import store from './store';

const Routes = ({ location }) => {
  const [previousLocation, setPreviousLocation] = useState(location);

  useEffect(() => {
    if (!(location && location.about)) {
      // const [previousLocation,setPreviousLocation]=useState(location)
      setPreviousLocation(location);
    }
  }, [location]);


  const isModal = location && location.about && previousLocation !== location;

  return (
    <Provider store={store}>
      {/* <BrowserRouter> */}

      <Alert />
      <Switch location={isModal ? previousLocation : location}>
        <PrivateRoute exact path='/' component={Home} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/auth/activate/:token' component={Activate} />
        <Route exact path='/signin' component={Signin} />
        <Route exact path='/auth/password/reset/:token' component={Reset} />
        <Route path='/auth/password/forgot' exact component={Forgot} />
        <PrivateRoute path='/profile' component={Profile} />
        <PrivateRoute exact path='/prof/edit' component={EditProfile} />
        <PrivateRoute exact path='/createpost' component={CreatePost} />
        <PrivateRoute path='/user/:id' component={SingleProfile} />

        <PrivateRoute exact path='/p/:id'>
          <Modal isModal={isModal} />
        </PrivateRoute>
      </Switch>
      {isModal ? (
        <PrivateRoute exact path='/p/:id'>
          <Modal isModal={isModal} />
        </PrivateRoute>
      ) : null}
      {/* </BrowserRouter> */}
    </Provider>
  );
};

export default withRouter(Routes);
