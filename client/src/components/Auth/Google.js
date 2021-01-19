import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

const Google = ({ informParent = f => f }) => {
    const responseGoogle = response => {
        axios({
            method: 'POST',
            url: `/api/google-login`,
            data: { idToken: response.tokenId }
        })
            .then(response => {
                informParent(response);
            })
            .catch(error => {
                console.log('GOOGLE SIGNIN ERROR', error.response);
            });
    };
    return (
        <div className="google">
            <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                render={renderProps => (
                    <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="btn btn-danger btn-lg btn-block"
                    >
                        <i className="fab fa-google pr-2"></i> Login with Google
                    </button>
                )}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};

export default Google;
