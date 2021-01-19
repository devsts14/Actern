import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { Link, withRouter } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getCurrentProfile,
  allUserPosts,
  deletePost,
  allPosts,
  likePost,
  unlikePost,
  commentPost,
  allProfiles,
  filterContacts,
  clearFilter,
} from '../actions/profile';
import moment from 'moment';
import axios from 'axios';
import { isAuth, getCookie } from '../components/Auth/helpers';
const App = ({
  allPosts,
  likePost,
  unlikePost,
  commentPost,
  allProfiles,
  filterContacts,
  clearFilter,
  profile: { allP, filtered },
  history,
}) => {
  const [comment, setComment] = useState('');
  const [lik, setLik] = useState([]);
  const [show, setShow] = useState('');
  const search = useRef('');
  const [text, setText] = useState('');

  useEffect(() => {
    allProfiles();
    allPosts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (filtered === null) {
      search.current.value = '';
    }
    // eslint-disable-next-line
  });

  const onChange = (e) => {
    if (search.current.value !== '') {
      filterContacts(e.target.value);
    } else {
      clearFilter();
    }
  };

  const like = async (id) => {
    likePost(id);
  };

  const unlike = async (id) => {
    unlikePost(id);
  };

  const comChange = (e) => {
    setComment(e.target.value);
  };

  const postComment = (id) => {
    commentPost(id, { comment });
    setComment('');
  };

  const showLike = (likes) => {
    setShow('show');
    setLik(likes);
  };

  const hideShow = () => {
    setShow('');
    setLik('');
  };
  const changeText = (e) => {
    setText(e.target.value);
  };

  const postIt = async (e) => {
    e.preventDefault();
    try {
      const token = getCookie('token');
      const payload = {
        text: text,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post('/api/post/text', payload, config);
      allPosts();
      history.push('/');
      setText('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar>
      <div className='search'>
        <input
          className='confil1'
          ref={search}
          type='text'
          placeholder='Search ...'
          onChange={onChange}
        ></input>
        <div className='dropdownit'>
          {filtered &&
            filtered.map((item) =>
              item.user._id !== isAuth()._id ? (
                <Link key={item.user._id} to={`/user/${item.user._id}`}>
                  {item.user.avatar ? (
                    <img
                      style={{
                        height: '4.5rem',
                        width: '4.5rem',
                        borderRadius: '50%',
                      }}
                      src={item.user.avatar}
                      alt='Profile'
                    />
                  ) : (
                    <img
                      src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                      style={{
                        height: '4.5rem',
                        width: '4.5rem',
                        borderRadius: '50%',
                      }}
                      alt='Profile'
                    ></img>
                  )}
                  <p>
                    <span>{item.user.name}</span>
                    <span>{item.user.email}</span>
                  </p>
                </Link>
              ) : (
                <Link key={item.user._id} to={`/profile`}>
                  {item.user.avatar ? (
                    <img
                      style={{
                        height: '4.5rem',
                        width: '4.5rem',
                        borderRadius: '50%',
                      }}
                      src={item.user.avatar}
                      alt='avatar'
                    />
                  ) : (
                    <img
                      src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                      style={{
                        height: '4.5rem',
                        width: '4.5rem',
                        borderRadius: '50%',
                      }}
                      alt='Avatar'
                    ></img>
                  )}
                  <p>
                    <span>{item.user.name}</span>
                    <span>{item.user.email}</span>
                  </p>
                </Link>
              )
            )}
        </div>
      </div>
      <div className='whatsupp'>
        <form onSubmit={postIt}>
          <textarea
            value={text}
            name='text'
            onChange={changeText}
            placeholder='Whats Up?'
            minLength='10'
            required
            maxLength='300'
          ></textarea>
          <label htmlFor='sub'>
            {' '}
            <i className='far fa-paper-plane'></i>
          </label>
          <input id='sub' name='sub' type='submit' value='Post' />
        </form>
      </div>
      {allP && allP.length <1 && <p className='noposts'>Follow users to view their posts</p>}

      {allP &&
        allP.map((p) => (
          <div key={Math.random()} className='postt'>
            <div
              onClick={hideShow}
              className={`like-modal-wrapper ${show}`}
            ></div>
            <div className={`like-modal ${show}`}>
              <h1>Likes</h1>
              {lik.length > 0 &&
                lik.map((li) => (
                  <Link
                    key={li.user._id}
                    to={
                      li.user._id !== isAuth()._id ? `/user/${li.user}` : `/profile`
                    }
                  >
                    <p>
                      {li.user.avatar ? (
                        <img
                          src={li.user.avatar}
                          style={{ height: '3.5rem', width: '3.5rem' }}
                          alt='avatar'
                        ></img>
                      ) : (
                        <img
                          style={{ height: '3.5rem', width: '3.5rem' }}
                          src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                          alt='avatar'
                        ></img>
                      )}
                      {li.name}
                    </p>
                  </Link>
                ))}
            </div>
            <div className='postt-head'>
              {p.user.avatar ? (
                <img
                  src={p.user.avatar}
                  style={{
                    height: '4.5rem',
                    width: '4.5rem',
                    borderRadius: '50%',
                  }}
                  alt='avatar'
                />
              ) : (
                <img
                  src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                  style={{
                    height: '4.5rem',
                    width: '4.5rem',
                    borderRadius: '50%',
                  }}
                  alt='avatar'
                ></img>
              )}
              <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                {p.user._id !== isAuth()._id ? (
                  <Link to={`/user/${p.user._id}`}>{p.user.name}</Link>
                ) : (
                  <Link to='/profile'>{p.user.name}</Link>
                )}
              </span>
            </div>
            <div className='postt-body'>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt='post' />
              ) : (
                <p className='postt-text'>{p.text}</p>
              )}
            </div>
            <div className='postt-tail'>
              <div className='postt-tail-lop'>
                <div className='postt-tail-lop-1'>
                  {p.likes
                    .map((pop) => pop.user._id === isAuth()._id)
                    .includes(true) ? (
                    <i
                      onClick={() => unlike(p._id)}
                      className='fas fa-heart'
                      style={{ color: 'red' }}
                    ></i>
                  ) : (
                    <i className='far fa-heart' onClick={() => like(p._id)}></i>
                  )}

                  <span>{p.likes.length}</span>
                </div>
                <div className='postt-tail-lop-1'>
                  <i className='far fa-comment'></i>
                  <span>{p.comments.length}</span>
                </div>
              </div>
            </div>
            <section className='post-info'>
              <div>
                {p.likes.length > 1 ? (
                  <p style={{ marginBottom: '1rem' }}>
                    Liked by
                    <Link
                      to={
                        p.likes[0].user !== isAuth()._id
                          ? `/user/${p.likes[0].user}`
                          : `/profile`
                      }
                    >
                      <strong>{`${p.likes[0].name}`} </strong>
                    </Link>{' '}
                    and{' '}
                    <strong
                      style={{ cursor: 'pointer' }}
                      onClick={() => showLike(p.likes)}
                    >
                      {`${p.likes.length - 1}`} others{' '}
                    </strong>
                  </p>
                ) : (
                  p.likes.length > 0 && (
                    <p>
                      Liked by{' '}
                      <strong>
                        <Link
                          to={
                            p.likes[0].user._id !== isAuth()._id
                              ? `/user/${p.likes[0].user._id}`
                              : `/profile`
                          }
                        >{`${p.likes[0].name}`}</Link>
                      </strong>
                    </p>
                  )
                )}
              </div>
              <div style={{ marginBottom: '1rem' }}>{p.description}</div>

              {p.comments.length > 2 ? (
                <div style={{ marginBottom: '1rem' }}>
                  <Link
                    className='frontpage-job'
                    to={{
                      pathname: `/p/${p._id}`,
                      about: { modal: true },
                    }}
                  >
                    {`View all ${p.comments.length} comments`}
                  </Link>
                </div>
              ) : (
                p.comments.map((pop) => (
                  <div key={Math.random()} className='comment'>
                    {' '}
                    {pop.user.avatar ? (
                      <img
                        src={pop.user.avatar}
                        style={{
                          height: '3rem',
                          width: '3rem',
                          borderRadius: '50%',
                        }}
                        alt='avatar'
                      ></img>
                    ) : (
                      <img
                        style={{
                          height: '3rem',
                          width: '3rem',
                          borderRadius: '50%',
                        }}
                        alt='avatar'
                        src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                      ></img>
                    )}
                    <p>
                      {
                        <Link
                          to={
                            pop.user._id !== isAuth()._id
                              ? `/user/${pop.user._id}`
                              : `/profile`
                          }
                        >
                          <span>{pop.name}</span>
                        </Link>
                      }{' '}
                      {pop.comment}
                      <br></br>
                      <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                        {moment(pop.date).startOf('minute').fromNow()}
                      </span>
                    </p>
                  </div>
                ))
              )}
              <div className='postt-tail-com'>
                <form style={{ marginBottom: '1.5rem' }}>
                  <textarea
                    placeholder='Comment'
                    name='comment'
                    value={comment}
                    onChange={comChange}
                  ></textarea>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => postComment(p._id)}
                  >
                    Post
                  </span>
                </form>

                <div>{moment(p.date).startOf('minute').fromNow()}</div>
              </div>
            </section>
            {!allP && allP.length ===0&& <p className='nocomments'>Follow users to view posts</p>}
          </div>

        ))}
      <Link to='/createpost'>
        <i className='fas fa-plus-circle addpost'></i>
      </Link>
    </Navbar>
  );
};

App.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  allUserPosts: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  posts: state.posts,
  allP: state.allPosts,
});

export default withRouter(
  connect(mapStateToProps, {
    getCurrentProfile,
    allUserPosts,
    deletePost,
    allPosts,
    likePost,
    unlikePost,
    commentPost,
    allProfiles,
    filterContacts,
    clearFilter,
  })(App)
);
