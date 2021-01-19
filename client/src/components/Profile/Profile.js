import React, { useEffect, Fragment, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import Spinner from '../Layout/Spinner';
import Navbar from '../Layout/Navbar';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  getCurrentProfile,
  allUserPosts,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  allPosts,
} from '../../actions/profile';
import Modal from '../Modal/Modal';
import { isAuth} from '../Auth/helpers';

const Profile = ({
  getCurrentProfile,
  allUserPosts,
  deletePost,
  likePost,
  allPosts,
  unlikePost,
  commentPost,

  profile: { loading, profile, posts },
  match,
  history,
}) => {
  const [comment, setComment] = useState('');
  const [lik, setLik] = useState([]);
  const [show, setShow] = useState('');
  const [show1, setShow1] = useState('');
  const [wrap, setWrap] = useState('');

  // get user profile on load
  useEffect(() => {
    getCurrentProfile();
    // eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    allUserPosts();
    allPosts();
    // eslint-disable-next-line
  }, []);

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
    console.log(lik);
  };

  const showDel = () => {
    setShow1('show  delete');
    setWrap('show');
  };

  const hideShow = () => {
    setShow('');
    setShow1('');
    setWrap('');
    setLik('');
  };

  const Posts = () => (
    <div className='pro-container'>
      {posts  &&
        posts.map((p) =>
          p.imageUrl ? (
            <Link key={p._id} to={`${match.url}/${p._id}`}>
              <div
                className='pro-post'
                style={{ backgroundImage: `url(${p.imageUrl})` }}
              ></div>
            </Link>
          ) : (
            <Link key={p._id} to={`${match.url}/${p._id}`}>
              <div className='pro-post'>
                <p>{p.text}</p>
              </div>
            </Link>
          )
        )
       }
       {posts && posts.length ===0 &&(<p className='noposts'>No Posts</p>)}
       
    </div>
  );

  const prof = () => (
    <Fragment>
      <div className='profile-container'>
        <div className='prof-grid'>
          {profile.user.avatar ? (
            <img src={profile.user.avatar} alt='avatar' />
          ) : (
            <img
              src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
              alt='avatar'
            ></img>
          )}
          <div className='prof-det'>
            <div className='prof-1'>
              <p>{profile.user.name}</p>
              <span>
                <Link to='/prof/edit'>Edit Profile</Link>
              </span>
            </div>
            <div className='prof-2'>
              <span>
                <strong>{posts && posts.length}</strong> posts
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => showLike(profile.follower)}
              >
                <strong>{profile.follower.length}</strong> followers
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => showLike(profile.following)}
              >
                <strong>{profile.following.length}</strong> following
              </span>
            </div>
            {profile.bio && (
              <div className='prof-3'>
                <pre>{profile.bio}</pre>
              </div>
            )}
            <div className='prof-4'>
              <div className='websites'>
                {profile.websites.web1 && (
                  <span>
                    <a href={profile.websites.web1}>{profile.websites.web1}</a>
                  </span>
                )}
                {profile.websites.web2 && (
                  <span>
                    <a href={profile.websites.web2}>{profile.websites.web2}</a>
                  </span>
                )}
              </div>
              <div className='social'>
                {profile.social.instagram && (
                  <a href={profile.social.instagram}>
                    <i className='fab fa-instagram'></i>
                  </a>
                )}
                {profile.social.twitter && (
                  <a href={profile.social.twitter}>
                    <i className='fab fa-twitter'></i>
                  </a>
                )}
                {profile.social.facebook && (
                  <a href={profile.social.facebook}>
                    <i className='fab fa-facebook-f'></i>
                  </a>
                )}
                {profile.social.youtube && (
                  <a href={profile.social.youtube}>
                    <i className='fab fa-youtube'></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
  const modal = () => (
    <Route
      path={`${match.url}/:id`}
      render={() => {
      

      
        const params = window.location.pathname.split('/').splice(2, 2);
        const p = posts
          .map((post) => post._id === params[params.length - 1])
          .indexOf(true);

        const del = async () => {
          deletePost(params, history);
          allUserPosts();
          hideShow();
          // try {
          //   const token = getCookie('token');
          //   await axios.delete(`/api/post/${params}`, {
          //     headers: {
          //       Authorization: `Bearer ${token}`,
          //     },
          //   });
          //   allUserPosts();
          //   history.push('/profile');
          // } catch (error) {
          //   console.log(error);
          // }
        };

        return (
          <Modal>
            <div
              className='modal-back'
              onClick={() => {
                // history.push(`${match.url}/${params[params.length -2]?params[params.length -2]:''}`);
                history.push(
                  params[params.length - 2]
                    ? `${match.url}/${params[params.length - 2]}`
                    : match.url
                );
              }}
            ></div>
            <div
              onClick={hideShow}
              className={`like-modal-wrapper ${wrap}`}
            ></div>
            <div className={`like-modal ${show1}`}>
              <span onClick={del}>Confirm delete</span>
              <span onClick={hideShow}>Cancel</span>
            </div>
            
            <div
              onClick={hideShow}
              className={`like-modal-wrapper ${show}`}
            ></div>
            <div className={`like-modal ${show}`}>
              <h1>Likes</h1>
              {lik.length > 0 &&
                lik.map((li) => (
                  <p>
                    <img
                      src={li.avatar}
                      style={{ height: '3.5rem', width: '3.5rem' }}
                      alt='avatar'
                    ></img>
                    {li.name}
                  </p>
                ))}
            </div>

            {posts[p - 1] && (
              <Link to={`${match.url}/${posts[p - 1]._id}`}>
                <i className='fas fa-angle-left'></i>
              </Link>
            )}
            <div className='modal'>
              <div className='mod-1'>
                {posts[p].imageUrl ? (
                  <img src={posts[p].imageUrl} alt='post' />
                ) : (
                  <p
                    className='modal-text'
                    style={{ fontSize: '3rem', lineHeight: '1.3' }}
                  >
                    {posts[p].text}
                  </p>
                )}
              </div>
              <div className='mod-2'>
                <div className='mod-2-top'>
                  {profile.user.avatar ? (
                    <img
                      className='mod-2-top-av'
                      src={profile.user.avatar}
                      alt='avatar'
                      style={{ width: '4.5rem', height: '4.5rem' }}
                    />
                  ) : (
                    <img
                      style={{ width: '4.5rem', height: '4.5rem' }}
                      className='mod-2-top-av'
                      src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                      alt='avatar'
                    ></img>
                  )}
                  <span className='mod-2-top-name'>{posts[p].name}</span>
                  <div className='dropdown' style={{ float: 'right' }}>
                    <i
                      style={{ color: '#931a25',cursor:'pointer' }}
                      className='fas fa-trash'
                      onClick={showDel}
                    ></i>

                    {/* onClick={del} */}
                  </div>
                  <i
                    onClick={() => {
                      // history.push(`${match.url}/${params[params.length -2]?params[params.length -2]:''}`);
                      history.push(
                        params[params.length - 2]
                          ? `${match.url}/${params[params.length - 2]}`
                          : match.url
                      );
                    }}
                    className='fas fa-times la'
                  ></i>
                </div>
                <div className='mod-1 mod-11'>
                  {posts[p].imageUrl ? (
                    <img src={posts[p].imageUrl} alt='post' />
                  ) : (
                    <p
                      className='modal-text'
                      style={{ fontSize: '3rem', lineHeight: '1.3' }}
                    >
                      {posts[p].text}
                    </p>
                  )}
                </div>
                <div className='mod-2-bottom'>
                  <div className='post-in'>
                    {posts[p.description] && (
                      <div className='desc' style={{ marginBottom: '1rem' }}>
                        {posts[p].description}
                      </div>
                    )}
                    <div className='comment-cont'>
                      {posts[p].comments.length > 0 ? (
                        posts[p].comments.map((pop) => (
                          <div
                            key={pop._id}
                            style={{ marginTop: '1rem' }}
                            className='comment1'
                          >
                            {' '}
                            {
                              pop.user.avatar !== ''?
                              <img
                                src={pop.user.avatar}
                                style={{
                                  height: '3rem',
                                  width: '3rem',
                                  borderRadius: '50%',
                                }}
                                alt='avatar'
                              ></img>:
                              <img                        src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'

                              style={{
                                height: '3rem',
                                width: '3rem',
                                borderRadius: '50%',
                              }}
                              alt='avatar'></img>
                            }
                            <p>
                              {<span>{pop.name}</span>} {pop.comment}
                              <br></br>
                              <span
                                style={{ fontSize: '0.8rem', color: 'gray' }}
                              >
                                {moment(pop.date).startOf('minute').fromNow()}
                              </span>
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className='nocomments'>No comments</p>
                      )}
                    </div>
                  </div>

                  {/* {window.location.pathname.split('/').splice(2,2)} */}
                  <div className='mod-static-bottom'>
                    <div className='mod-static-bottom-inf'>
                      <div className='mod-static-bottom-inf-1'>
                        {posts[p].likes
                          .map((pop) => pop.user._id === isAuth()._id)
                          .includes(true) ? (
                          <i
                            onClick={() => unlike(posts[p]._id)}
                            className='fas fa-heart'
                            style={{ color: 'red' }}
                          ></i>
                        ) : (
                          <i
                            className='far fa-heart'
                            onClick={() => like(posts[p]._id)}
                          ></i>
                        )}
                        <span>{posts[p].likes.length}</span>
                      </div>
                      <div className='mod-static-bottom-inf-1'>
                        <i className='far fa-comment'></i>
                        <span>{posts[p].comments.length}</span>
                      </div>
                    </div>
                    <div className='desc-like'>
                      {posts[p].likes.length > 1 ? (
                        <p style={{ marginBottom: '1rem' }}>
                          Liked by{' '}
                          <strong>{`${posts[p].likes[0].name}`} </strong>and{' '}
                          <strong  style={{cursor:'pointer'}} onClick={() => showLike(posts[p].likes)}>
                            {`${posts[p].likes.length - 1}`} others
                          </strong>
                        </p>
                      ) : (
                        posts[p].likes.length > 0 && (
                          <p>
                            Liked by{' '}
                            <strong>{`${posts[p].likes[0].name}`}</strong>
                          </p>
                        )
                      )}
                    </div>
                    <form style={{ marginBottom: '1.5rem' }}>
                      <textarea
                        placeholder='Comment'
                        name='comment'
                        value={comment}
                        onChange={comChange}
                      ></textarea>
                      <span onClick={() => postComment(posts[p]._id)}>
                        Post
                      </span>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {posts[p + 1] && (
              <Link to={`${match.url}/${posts[p + 1]._id}`}>
                <i className='fas fa-angle-right'></i>
              </Link>
            )}
          </Modal>
        );
      }}
    />
  );

  return profile === null ? (
    <Spinner />
  ) : (
    <div>
      <Fragment>
        <Navbar>
          <div
            onClick={hideShow}
            className={`like-modal-wrapper ${show}`}
          ></div>
          <div className={`like-modal ${show}`}>
            {/* <h1>Likes</h1> */}
            {lik.length > 0 &&
              lik.map((li) => (
                <Link
                  key={li.user}
                  to={
                    li.user === isAuth()._id ? `/profile` : `/user/${li.user}`
                  }
                >
                  <p>
                    {li.avatar ? (
                      <img
                        src={li.avatar}
                        style={{ height: '3.5rem', width: '3.5rem' }}
                        alt='avatar'
                      ></img>
                    ) : (
                      <img
                        src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                        alt='avatar'
                        style={{ height: '3.5rem', width: '3.5rem' }}
                      ></img>
                    )}
                    {li.name}
                  </p>
                </Link>
              ))}
          </div>

          {prof()}
          {Posts()}
          {modal()}
        </Navbar>
      </Fragment>
    </div>
  );
};

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  allUserPosts: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  posts: state.posts,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  allUserPosts,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  allPosts,
})(Profile);
