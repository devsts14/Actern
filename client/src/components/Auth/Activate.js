import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';

const Activate = ({setAlert, match ,history}) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        show: true
    });

    useEffect(() => {
        let token = match.params.token;
        let { name } = jwt.decode(token);
        if (token) {
            setValues({ ...values, name, token });
        }
        // eslint-disable-next-line
    }, []);

    const { name, token} = values;

    const clickSubmit = event => {
        event.preventDefault();
        axios({
            method: 'POST',
            url: "/api/account-activation",
            data: { token }
        })
            .then(response => {
                console.log('ACCOUNT ACTIVATION', response);
                setValues({ ...values});
                // toast.success(response.data.message);
                setAlert(response.data.message,'success')
                history.push('/signin')
            })
            .catch(error => {
                console.log('ACCOUNT ACTIVATION ERROR', error.response.data.error);
                setAlert(error.response.data.error,'danger')
                // toast.error(error.response.data.error);
            });
    };

    const activationLink = () => (
        <div className="text-center cent">
            <h1 className="p-5">Hey {name}, Ready to activate your account?</h1>
            <button className="btn btn-outline-primary" onClick={clickSubmit}>
                Activate Account
            </button>
        </div>
    );

    return (
  
            <div className="col-md-6 offset-md-3 activate">
                {activationLink()}
            </div>
    
    );
};
Activate.propTypes = {
    setAlert: PropTypes.func.isRequired,
  };

export default connect(null, { setAlert })(Activate);
