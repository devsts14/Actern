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
  getSingleProfile,
  getSingleUserPosts,
  followUser,
  unfollowUser,
} from '../../actions/profile';
import Modal from '../Modal/Modal';
import { isAuth } from '../Auth/helpers';

const Profile = ({
  getCurrentProfile,
  allUserPosts,
  deletePost,
  likePost,
  allPosts,
  unlikePost,
  commentPost,
  getSingleProfile,
  getSingleUserPosts,
  followUser,
  unfollowUser,
  profile: { loading, posts, singleprof, singlePosts },
  match,
  history,
}) => {
  // get user profile on load
  useEffect(() => {
    // getCurrentProfile();
    if (match.params.id) {
      getSingleProfile(match.params.id);
    }
    // eslint-disable-next-line
  }, [loading, match.params.id]);
  useEffect(() => {
    if (match.params.id) {
      getSingleUserPosts(match.params.id);
    }
    allUserPosts();
    allPosts();
    // eslint-disable-next-line
  }, [match.params.id]);
  const [comment, setComment] = useState('');
  const [lik, setLik] = useState([]);
  const [show, setShow] = useState('');
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
    if (
      singleprof[0].follower.map((p) => p.user === isAuth()._id).includes(true)
    ) {
      setShow('show');
      setLik(likes);
    }
  };

  const hideShow = () => {
    setShow('');
    setLik('');
  };
  const follow = async () => {
    followUser(match.params.id);
  };
  const unfollow = async () => {
    unfollowUser(match.params.id);
  };

  const Posts = () => (
    <Fragment>
      {singlePosts && (
        <div className='pro-container'>
          {singlePosts.map((p) =>
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
          )}
        </div>
      )}
      {singlePosts && singlePosts.length === 0 && (
        <p className='noposts'>No posts</p>
      )}
    </Fragment>
  );

  const prof = () => (
    <Fragment>
      <div className='profile-container'>
        <div className='prof-grid'>
          {singleprof[0].user.avatar ? (
            <img src={singleprof[0].user.avatar} alt='avatar' />
          ) : (
            <img
              src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
              alt='avatar'
            ></img>
          )}
          <div className='prof-det'>
            <div className='prof-1'>
              <p>{singleprof[0].user.name}</p>

              {singleprof[0].follower
                .map((p) => p.user === isAuth()._id)
                .includes(true) ? (
                <Fragment>
                  <span className='following'>following</span>
                  <span className='unfollow' onClick={unfollow}>
                    Unfollow
                  </span>
                </Fragment>
              ) : (
                <span className='follow' onClick={follow}>
                  follow
                </span>
              )}
            </div>
            <div className='prof-2'>
              <span>
                <strong>{singlePosts && singlePosts.length}</strong> posts
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => showLike(singleprof[0].follower)}
              >
                <strong>{singleprof[0].follower.length}</strong> followers
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => showLike(singleprof[0].following)}
              >
                <strong>{singleprof[0].following.length}</strong> following
              </span>
            </div>
            {singleprof[0].bio && (
              <div className='prof-3'>
                <pre>{singleprof[0].bio}</pre>
              </div>
            )}
            <div className='prof-4'>
              <div className='websites'>
                {singleprof[0].websites.web1 && (
                  <span>
                    <a href={singleprof[0].websites.web1}>
                      {singleprof[0].websites.web1}
                    </a>
                  </span>
                )}
                {singleprof[0].websites.web2 && (
                  <span>
                    <a href={singleprof[0].websites.web2}>
                      {singleprof[0].websites.web2}
                    </a>
                  </span>
                )}
              </div>
              <div className='social'>
                {singleprof[0].social.instagram && (
                  <a href={singleprof[0].social.instagram}>
                    <i className='fab fa-instagram'></i>
                  </a>
                )}
                {singleprof[0].social.twitter && (
                  <a href={singleprof[0].social.twitter}>
                    <i className='fab fa-twitter'></i>
                  </a>
                )}
                {singleprof[0].social.facebook && (
                  <a href={singleprof[0].social.facebook}>
                    <i className='fab fa-facebook-f'></i>
                  </a>
                )}
                {singleprof[0].social.youtube && (
                  <a href={singleprof[0].social.youtube}>
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
        const p = singlePosts
          .map((post) => post._id === params[1])
          .indexOf(true);
        // console.log(p);
        // const del = async () => {
        //   deletePost(params, history);
        //   try {
        //     const token = getCookie('token');
        //     await axios.delete(`/api/post/${params}`, {
        //       headers: {
        //         Authorization: `Bearer ${token}`,
        //       },
        //     });
        //     allUserPosts();
        //     history.push('/profile');
        //   } catch (error) {
        //     console.log(error);
        //   }
        // };

        return (
          <Modal>
            <div
              className='modal-back'
              onClick={() => {
                // history.push(`${match.url}/${params[params.length -2]?params[params.length -2]:''}`);
                history.push(match.url);
              }}
            ></div>

            <div
              onClick={hideShow}
              className={`like-modal-wrapper ${show}`}
            ></div>
            <div className={`like-modal ${show}`}>
              <h1>Likes</h1>
              {lik.length > 0 &&
                lik.map((li) => (
                  <p key={li.user}>
                    {li.avatar ? (
                      <img
                        src={li.avatar}
                        style={{ height: '3.5rem', width: '3.5rem' }}
                        alt='avatar'
                      ></img>
                    ) : (
                      <img
                        style={{ height: '3.5rem', width: '3.5rem' }}
                        alt='avatar'
                        src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                      ></img>
                    )}
                    {li.name}
                  </p>
                ))}
            </div>

            {singlePosts[p - 1] && (
              <Link to={`${match.url}/${singlePosts[p - 1]._id}`}>
                <i className='fas fa-angle-left'></i>
              </Link>
            )}
            <div className='modal'>
              <div className='mod-1'>
                {singlePosts[p].imageUrl ? (
                  <img src={singlePosts[p].imageUrl} alt='avatar' />
                ) : (
                  <p
                    className='modal-text'
                    style={{ fontSize: '3rem', lineHeight: '1.3' }}
                  >
                    {singlePosts[p].text}
                  </p>
                )}
              </div>
              <div className='mod-2'>
                <div className='mod-2-top'>
                  {singleprof[0].user.avatar ? (
                    <img
                      className='mod-2-top-av'
                      src={singleprof[0].user.avatar}
                      alt='avatar'
                      style={{ width: '4.5rem', height: '4.5rem' }}
                    />
                  ) : (
                    <img
                      src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                      alt='avatar'
                      style={{ width: '4.5rem', height: '4.5rem' }}
                      className='mod-2-top-av'
                    ></img>
                  )}
                  <span className='mod-2-top-name'>{singlePosts[p].name}</span>
                  <div className='dropdown' style={{ float: 'right' }}>
                    <button className='dropbtn'></button>
                    {/* <div class='dropdown-content'>
                            <a onClick={del} href='#'>Delete</a>
                          </div> */}
                  </div>
                  <i
                    onClick={() => {
                      // history.push(`${match.url}/${params[params.length -2]?params[params.length -2]:''}`);
                      history.push(match.url);
                    }}
                    className='fas fa-times la'
                  ></i>
                </div>
                <div className='mod-1 mod-11'>
                  {singlePosts[p].imageUrl ? (
                    <img src={singlePosts[p].imageUrl} alt='post' />
                  ) : (
                    <p
                      className='modal-text'
                      style={{ fontSize: '3rem', lineHeight: '1.3' }}
                    >
                      {singlePosts[p].text}
                    </p>
                  )}
                </div>
                <div className='mod-2-bottom'>
                  <div className='post-in'>
                    {singlePosts[p.description] && (
                      <div className='desc' style={{ marginBottom: '1rem' }}>
                        {singlePosts[p].description}
                      </div>
                    )}
                    <div className='comment-cont'>
                      {singlePosts[p].comments.length > 0 &&
                        singlePosts[p].comments.map((pop) => (
                          <Link
                            key={pop._id}
                            to={
                              pop.user !== isAuth()._id
                                ? `/user/${pop.user}`
                                : `/profile`
                            }
                          >
                            <div
                              style={{ marginTop: '1rem' }}
                              className='comment1'
                            >
                              {' '}
                              {pop.avatar ? (
                                <img
                                  src={pop.avatar}
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
                                  <span
                                    style={{
                                      color:
                                        pop.user === isAuth()._id && '#1aa6b7',
                                    }}
                                  >
                                    {pop.name}
                                  </span>
                                }{' '}
                                {pop.comment}
                                <br></br>
                                <span
                                  style={{ fontSize: '0.8rem', color: 'gray' }}
                                >
                                  {moment(pop.date).startOf('minute').fromNow()}
                                </span>
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>

                  {/* {window.location.pathname.split('/').splice(2,2)} */}
                  <div className='mod-static-bottom'>
                    <div className='mod-static-bottom-inf'>
                      <div className='mod-static-bottom-inf-1'>
                        {singlePosts[p].likes
                          .map((pop) => pop.user._id === isAuth()._id)
                          .includes(true) ? (
                          <i
                            onClick={() => unlike(singlePosts[p]._id)}
                            className='fas fa-heart'
                            style={{ color: 'red' }}
                          ></i>
                        ) : (
                          <i
                            className='far fa-heart'
                            onClick={() => like(singlePosts[p]._id)}
                          ></i>
                        )}
                        <span>{singlePosts[p].likes.length}</span>
                      </div>
                      <div className='mod-static-bottom-inf-1'>
                        <i className='far fa-comment'></i>
                        <span>{singlePosts[p].comments.length}</span>
                      </div>
                    </div>
                    <div className='desc-like'>
                      {singlePosts[p].likes.length > 1 ? (
                        <p style={{ marginBottom: '1rem' }}>
                          Liked by{' '}
                          <strong>{`${singlePosts[p].likes[0].name}`} </strong>
                          and{' '}
                          <strong
                            style={{ cursor: 'pointer' }}
                            onClick={() => showLike(singlePosts[p].likes)}
                          >
                            {`${singlePosts[p].likes.length - 1}`} others
                          </strong>
                        </p>
                      ) : (
                        singlePosts[p].likes.length > 0 && (
                          <p>
                            Liked by{' '}
                            <strong>{`${singlePosts[p].likes[0].name}`}</strong>
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
                      <span onClick={() => postComment(singlePosts[p]._id)}>
                        Post
                      </span>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {singlePosts[p + 1] && (
              <Link to={`${match.url}/${singlePosts[p + 1]._id}`}>
                <i className='fas fa-angle-right'></i>
              </Link>
            )}
          </Modal>
        );
      }}
    />
  );

  return singleprof === null ? (
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
                  onClick={hideShow}
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
          {singleprof[0].follower
            .map((p) => p.user === isAuth()._id)
            .includes(true) ? (
            Posts()
          ) : (
            <p className='private'>
              <i className='fas fa-lock'></i> Follow user to view posts
            </p>
          )}
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
  getSingleProfile,
  getSingleUserPosts,
  followUser,
  unfollowUser,
})(Profile);
