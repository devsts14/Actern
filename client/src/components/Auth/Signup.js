import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Google from './Google';
import { authenticate, isAuth } from './helpers';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';

const Signup = ({ setAlert, history }) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    buttonText: 'Submit',
  });

  const [eye, setEye] = useState('password');

  const { name, email, password, password2, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const informParent = (response) => {
    authenticate(response, () => {
      // isAuth() && isAuth().role === 'admin'
      //   ? history.push('/admin')
      //   : history.push('/private');
      isAuth && history.push('/')
    });
  };

  const changeShow = () => {
    if (eye === 'password') {
      setEye('text');
    } else {
      setEye('password');
    }
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      setValues({ ...values, buttonText: 'Submitting' });
      axios({
        method: 'POST',
        url: `/api/signup`,
        data: { name, email, password },
      })
        .then((response) => {
          console.log('SIGNUP SUCCESS', response);
          setValues({
            ...values,
            name: '',
            email: '',
            password: '',
            password2: '',
            buttonText: 'Submitted',
          });
          setAlert(response.data.message, 'danger');
          // toast.success(response.data.message);
        })
        .catch((error) => {
          console.log('SIGNUP ERROR', error.response.data);
          setValues({ ...values, buttonText: 'Submit' });
          setAlert(error.response.data.error, 'danger');
          // toast.error(error.response.data.error);
        });
    }
  };

  const signupForm = () => (
    <div className='grid-2'>
      <div id='parallax' className='brand-left'>
        <h1>Actern</h1>
      </div>
      <div className='right'>
        <form className='signup-form'>
          <h1 className="brand-mobile">Actern</h1>
          <h1 className='p-5 text-center'>Signup</h1>
          <Google id='google' informParent={informParent} />
          <div className='form-group'>
            <input
              onChange={handleChange('name')}
              value={name}
              type='text'
              className='form-control'
              placeholder=' '
              required
            />

            <span>Name</span>
            <i className='far fa-check-circle valid'></i>
            <i className='far fa-times-circle invalid'></i>
          </div>

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
            <i className='far fa-check-circle valid'></i>
            <i className='far fa-times-circle invalid'></i>
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
            <i className='far fa-check-circle valid'></i>
            <i className='far fa-times-circle invalid'></i>
            {eye === 'password' ? (
              <i className='fas fa-eye show' onClick={changeShow}></i>
            ) : (
              <i className='fas fa-eye-slash show' onClick={changeShow}></i>
            )}
          </div>

          <div className='form-group'>
            <input
              onChange={handleChange('password2')}
              value={password2}
              type={eye}
              placeholder=' '
              className='form-control'
              required
              minLength='6'
            />
            <span>Confirm Password</span>

            {password === password2 &&
            password.length > 0 &&
            password2.length > 5 ? (
              <i class='far fa-check-circle valid1'></i>
            ) : (
              password2.length > 0 && (
                <i class='far fa-times-circle invalid1'></i>
              )
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
                Already got an account?<Link to='/signin'>Signin</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className='signup-container'>
      {isAuth() ? <Redirect to='/' /> : null}
      {signupForm()}
    </div>
  );
};

Signup.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert })(Signup);
