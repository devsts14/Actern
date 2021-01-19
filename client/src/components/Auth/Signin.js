import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { authenticate, isAuth } from './helpers';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
import Google from './Google';
// import Facebook from './Facebook';

const Signin = ({ setAlert, history }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    buttonText: 'Submit',
  });

  const [eye, setEye] = useState('password');

  const { email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };
  const changeShow = () => {
    if (eye === 'password') {
      setEye('text');
    } else {
      setEye('password');
    }
  };

  const informParent = (response) => {
    authenticate(response, () => {
      // isAuth() && isAuth().role === 'admin'
      //   ? history.push('/admin')
      //   : history.push('/private');
      isAuth() && history.push('/');
      setAlert(`Welcome ${isAuth().name}`, 'success');
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    axios({
      method: 'POST',
      url: `/api/signin`,
      data: { email, password },
    })
      .then((response) => {
        console.log('SIGNIN SUCCESS', response);
        // save the response (user, token) localstorage/cookie
        authenticate(response, () => {
          setValues({
            ...values,
            name: '',
            email: '',
            password: '',
            buttonText: 'Submitted',
          });
          setAlert(`Hey ${response.data.user.name}!`, 'success');
          // toast.success(`Hey ${response.data.user.name}, Welcome back!`);
          // isAuth() && isAuth().role === 'admin'
          //   ? history.push('/admin')
          //   : history.push('/private');
          isAuth() && history.push('/');
        });
      })
      .catch((error) => {
        // console.log('SIGNIN ERROR', error.response.data);
        setValues({ ...values, buttonText: 'Submit' });
        setAlert(error.response.data.error, 'danger');
        // toast.error(error.response.data.error);
      });
  };

  const signinForm = () => (
    <div className='grid-2'>
      <div className='brand-left'>
        <h1>Actern</h1>
      </div>
      <div className='right'>
        <form className='signup-form'>
          <h1 className='brand-mobile'>Actern</h1>
          <h1 className='p-5 text-center'>Signin</h1>
          <Google id='google' informParent={informParent} />

          <div className='form-group'>
            <input
              onChange={handleChange('email')}
              value={email}
              type='email'
              className='form-control'
              placeholder=' '
              required
            />
            <span>Email address</span>
          </div>

          <div className='form-group'>
            <input
              onChange={handleChange('password')}
              value={password}
              type={eye}
              placeholder=' '
              className='form-control'
              required
              minLength='6'
            />
            <span>Password</span>
            {eye === 'password' ? (
              <i className='fas fa-eye show' onClick={changeShow}></i>
            ) : (
              <i className='fas fa-eye-slash show' onClick={changeShow}></i>
            )}
          </div>

          <div className='submit'>
            <button className='signup-submit' onClick={clickSubmit}>
              {buttonText}
            </button>
          </div>

          <div>
            <br />
            <div className='cnt'>
              <p>
                Have no account?<Link to='/signup'>Signup</Link>
              </p>
            </div>
            <div className='forgot'>
              <Link to='/auth/password/forgot' className='forgot-button'>
                Forgot Password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className='signup-container'>
      {isAuth() ? <Redirect to='/' /> : null}
      {/* <Facebook informParent={informParent} /> */}
      {signinForm()}
    </div>
  );
};

Signin.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert })(Signin);
