import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout } from '../Auth/helpers';
import { connect } from 'react-redux';
import { clearProf } from '../../actions/profile';

const Layout = ({ clearProf, children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { backgroundColor: '#145374' };
    }
    // } else {
    //   return { backgroundColor: '#10375c' };
    // }
  };

  function openNav() {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('overlay').style.width = '100%';
  }

  function closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('overlay').style.width = '0';
    document.body.style.backgroundColor = 'white';
  }

  const nav = () => (
    <ul className='nav'>
      <div className='nav-cont'>
        <li className='brand'>
          <Link to='/'>Actern</Link>
        </li>
        <div className='right-nav'>
          <li style={isActive('/profile')}>
            <Link to='/profile'>
              <i className='far fa-user-circle'></i>
            </Link>
          </li>
         
          <li>
            <i onClick={openNav} className='fas fa-bars'></i>
          </li>
          
        </div>
      </div>
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      <div id='mySidenav' className='sidenav'>
        <Link to='' className='closebtn' onClick={closeNav}>
          &times;
        </Link>
        <span
          onClick={() => {
            signout(() => {
              history.push('/signin');
              clearProf();
            });
          }}
        >
          <i className='fas fa-sign-out-alt'></i>Logout
        </span>
      </div>
      <div className='overlay' id='overlay' onClick={closeNav}></div>
      <div className='container'>{children}</div>
    </Fragment>
  );
};

export default withRouter(connect(null, { clearProf })(Layout));
