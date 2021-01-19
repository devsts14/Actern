import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
const Forgot = ({ setAlert, history }) => {
  const [values, setValues] = useState({
    email: '',
    buttonText: 'Request password reset link',
  });

  const { email, buttonText } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    axios({
      method: 'PUT',
      url: `/api/forgot-password`,
      data: { email },
    })
      .then((response) => {
        console.log('FORGOT PASSWORD SUCCESS', response);
        // toast.success(response.data.message);
        setValues({ ...values, buttonText: 'Requested' });

        setAlert(response.data.message, 'success');
        history.push('/signin');
      })
      .catch((error) => {
        console.log('FORGOT PASSWORD ERROR', error.response.data);
        // toast.error(error.response.data.error);
        setValues({ ...values, buttonText: 'Request password reset link' });
        setAlert(error.response.data.error, 'danger');
      });
  };

  const passwordForgotForm = () => (
    <div className='forgot-container'>
      <div
        className='bg-img'
        style={{
          backgroundImage:
            'url("https://res.cloudinary.com/shaunniee/image/upload/v1599842531/Forgot_password-bro_ke9gmu.svg")',
        }}
      ></div>
      {/* <img src="https://res.cloudinary.com/shaunniee/image/upload/v1599842531/Forgot_password-bro_ke9gmu.svg" alt=""/> */}
      <form>
        <h1 className='p-5 text-center'>Forgot password</h1>
        <div className='form-group'>
          <input
            onChange={handleChange('email')}
            value={email}
            type='email'
            className='form-control'
            placeholder='Email address'
          />
          <i className='fas fa-envelope mail'></i>
        </div>

        <div>
          <button className='btn-reset' onClick={clickSubmit}>
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className='main'>
      <div className='top'>
        <span>Actern</span>
        <div>
          <Link to='/signup'>Signup</Link>
          <Link to='/signin'>Signin</Link>
        </div>
      </div>

      {passwordForgotForm()}
    </div>
  );
};
Forgot.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert })(Forgot);
