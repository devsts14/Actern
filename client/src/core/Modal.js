import React, { useEffect, useState, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
// import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import moment from 'moment';
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
} from '../actions/profile';
import { isAuth } from '../components/Auth/helpers';

const Modal = ({
  allPosts,
  likePost,
  unlikePost,
  commentPost,
  profile: { loading, allP },
  match,
  history,
  isModal,
}) => {
  const [p, setP] = useState(null);
  const [comment, setComment] = useState('');
  const [lik, setLik] = useState([]);
  const [show, setShow] = useState('');
  const { id } = match.params;

  useEffect(() => {
    allPosts();
    if (!loading) {
      const params = id;
      setP(allP.map((post) => post._id === params).indexOf(true));
    }
    // eslint-disable-next-line
  }, [loading]);

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

  // constructor() {
  //   super();
  //   this.modalRef = React.createRef();
  // }

  // componentDidMount() {
  //   const { isModal } = this.props;

  //   if (isModal) {
  //     disableBodyScroll(this.modalRef.current);
  //   }
  // }

  // componentWillUnmount() {
  //   enableBodyScroll(this.modalRef.current);
  // }

  if (isModal) {
    return (
      p !== null && (
        <Fragment>
          <div
            // ref={this.modalRef}
            className='modal-wrapper'
            onClick={() => history.goBack()}
          >
            {/* <div className="modal1" onClick={e => e.stopPropagation()}> */}
            <div className='modal' onClick={(e) => e.stopPropagation()}>
              <div
                onClick={hideShow}
                className={`like-modal-wrapper ${show}`}
              ></div>
              <div className={`like-modal ${show}`}>
                <h1>Likes</h1>
                {lik.length > 0 &&
                  lik.map((li) => (
                    <Link key={li.user} to={li.user._id !== isAuth()._id ?`/user/${li.user._id}`:`/profile`}>
                    <p >
                      {li.user.avatar ? (
                        <img
                          src={li.user.avatar}
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
                    </Link>
                  ))}
              </div>
              <div className='mod-1'>
                {allP[p].imageUrl ? (
                  <img src={allP[p].imageUrl} alt='avatar' />
                ) : (
                  <p
                    className='modal-text'
                    style={{ fontSize: '3rem', lineHeight: '1.3' }}
                  >
                    {allP[p].text}
                  </p>
                )}
              </div>
              <div className='mod-2'>
                <div className='mod-2-top'>
                  {allP[p].user.avatar ? (
                    <img
                      className='mod-2-top-av'
                      src={allP[p].user.avatar}
                      alt='avatar'
                      style={{ width: '4.5rem', height: '4.5rem' }}
                    />
                  ) : (
                    <img
                      className='mod-2-top-av'
                      src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                      alt='avatar'
                      style={{ width: '4.5rem', height: '4.5rem' }}
                    ></img>
                  )}
                  <Link
                    to={
                      allP[p].user._id !== isAuth()._id
                        ? `/user/${allP[p].user._id}`
                        : '/profile'
                    }
                  >
                    <span className='mod-2-top-name'>{allP[p].user.name}</span>
                  </Link>
                  <div className='dropdown' style={{ float: 'right' }}>
                    <button className='dropbtn'></button>

                    {/* <div class='dropdown-content'>
                            <a onClick={del} href='#'>Delete</a>
                          </div> */}
                  </div>
                  <i
                    onClick={() => history.goBack()}
                    className='fas fa-times la'
                  ></i>
                </div>
                <div className='mod-1 mod-11'>
                  {allP[p].imageUrl ? (
                    <img src={allP[p].imageUrl} alt='post' />
                  ) : (
                    <p
                      className='modal-text'
                      style={{ fontSize: '3rem', lineHeight: '1.3' }}
                    >
                      {allP[p].text}
                    </p>
                  )}
                </div>
                <div className='mod-2-bottom'>
                  <div className='post-in'>
                    {allP[p.description] && (
                      <div className='desc' style={{ marginBottom: '1rem' }}>
                        {allP[p].description}
                      </div>
                    )}
                    <div className='comment-cont'>
                      {allP[p].comments.length > 0 ? (
                        allP[p].comments.map((pop) => (
                          <Link
                            key={pop._id}
                            to={
                              pop.user._id !== isAuth()._id
                                ? `/user/${pop.user._id}`
                                : `/profile`
                            }
                          >
                            <div
                              key={pop._id}
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
                                {<span>{pop.name}</span>} {pop.comment}
                                <br></br>
                                <span
                                  style={{ fontSize: '0.8rem', color: 'gray' }}
                                >
                                  {moment(pop.date).startOf('minute').fromNow()}
                                </span>
                              </p>
                            </div>
                          </Link>
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
                        {allP[p].likes
                          .map((pop) => pop.user._id === isAuth()._id)
                          .includes(true) ? (
                          <i
                            onClick={() => unlike(allP[p]._id)}
                            className='fas fa-heart'
                            style={{ color: 'red' }}
                          ></i>
                        ) : (
                          <i
                            className='far fa-heart'
                            onClick={() => like(allP[p]._id)}
                          ></i>
                        )}
                        <span>{allP[p].likes.length}</span>
                      </div>
                      <div className='mod-static-bottom-inf-1'>
                        <i className='far fa-comment'></i>
                        <span>{allP[p].comments.length}</span>
                      </div>
                    </div>
                    <div className='desc-like'>
                      {allP[p].likes.length > 1 ? (
                        <p style={{ marginBottom: '1rem' }}>
                          Liked by{' '}
                          <Link
                            to={
                              allP[p].likes.user._id !== isAuth()._id
                                ? `/user/${allP[p].likes.user._id}`
                                : `/profile`
                            }
                          >
                            {' '}
                            <strong>{`${allP[p].likes[0].name}`} </strong>
                          </Link>
                          and{' '}
                          <strong
                            style={{ cursor: 'pointer' }}
                            onClick={() => showLike(allP[p].likes)}
                          >
                            {`${allP[p].likes.length - 1}`} others
                          </strong>
                        </p>
                      ) : (
                        allP[p].likes.length > 0 && (
                          <p>
                            Liked by{' '}
                            <strong>{`${allP[p].likes[0].name}`}</strong>
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
                      <span onClick={() => postComment(allP[p]._id)}>Post</span>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )
    );
  } else {
    return (
      p !== null && (
        <Fragment>
          <div
            // ref={this.modalRef}
            className='modal-wrapper'
            onClick={() => history.goBack()}
          >
            {/* <div className="modal1" onClick={e => e.stopPropagation()}> */}
            <div className='modal' onClick={(e) => e.stopPropagation()}>
              <div
                onClick={hideShow}
                className={`like-modal-wrapper ${show}`}
              ></div>
              <div className={`like-modal ${show}`}>
                <h1>Likes</h1>
                {lik.length > 0 &&
                  lik.map((li) => (
                    <Link key={li.user} to={li.user !== isAuth()._id ?`/user/${li.user}`:`/profile`}>
                    <p >
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
                    </Link>
                  ))}
              </div>
              <div className='mod-1'>
                {allP[p].imageUrl ? (
                  <img src={allP[p].imageUrl} alt='avatar' />
                ) : (
                  <p
                    className='modal-text'
                    style={{ fontSize: '3rem', lineHeight: '1.3' }}
                  >
                    {allP[p].text}
                  </p>
                )}
              </div>
              <div className='mod-2'>
                <div className='mod-2-top'>
                  {allP[p].user.avatar ? (
                    <img
                      className='mod-2-top-av'
                      src={allP[p].user.avatar}
                      alt='avatar'
                      style={{ width: '4.5rem', height: '4.5rem' }}
                    />
                  ) : (
                    <img
                      className='mod-2-top-av'
                      src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
                      alt='avatar'
                      style={{ width: '4.5rem', height: '4.5rem' }}
                    ></img>
                  )}
                  <Link
                    to={
                      allP[p].user._id !== isAuth()._id
                        ? `/user/${allP[p].user._id}`
                        : '/profile'
                    }
                  >
                    <span className='mod-2-top-name'>{allP[p].user.name}</span>
                  </Link>
                  <div className='dropdown' style={{ float: 'right' }}>
                    <button className='dropbtn'></button>

                    {/* <div class='dropdown-content'>
                            <a onClick={del} href='#'>Delete</a>
                          </div> */}
                  </div>
                  <i
                    onClick={() => history.goBack()}
                    className='fas fa-times la'
                  ></i>
                </div>
                <div className='mod-1 mod-11'>
                  {allP[p].imageUrl ? (
                    <img src={allP[p].imageUrl} alt='post' />
                  ) : (
                    <p
                      className='modal-text'
                      style={{ fontSize: '3rem', lineHeight: '1.3' }}
                    >
                      {allP[p].text}
                    </p>
                  )}
                </div>
                <div className='mod-2-bottom'>
                  <div className='post-in'>
                    {allP[p.description] && (
                      <div className='desc' style={{ marginBottom: '1rem' }}>
                        {allP[p].description}
                      </div>
                    )}
                    <div className='comment-cont'>
                      {allP[p].comments.length > 0 ? (
                        allP[p].comments.map((pop) => (
                          <Link
                            key={pop._id}
                            to={
                              pop.user !== isAuth()._id
                                ? `/user/${pop.user}`
                                : `/profile`
                            }
                          >
                            <div
                              key={pop._id}
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
                                {<span>{pop.name}</span>} {pop.comment}
                                <br></br>
                                <span
                                  style={{ fontSize: '0.8rem', color: 'gray' }}
                                >
                                  {moment(pop.date).startOf('minute').fromNow()}
                                </span>
                              </p>
                            </div>
                          </Link>
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
                        {allP[p].likes
                          .map((pop) => pop.user === isAuth()._id)
                          .includes(true) ? (
                          <i
                            onClick={() => unlike(allP[p]._id)}
                            className='fas fa-heart'
                            style={{ color: 'red' }}
                          ></i>
                        ) : (
                          <i
                            className='far fa-heart'
                            onClick={() => like(allP[p]._id)}
                          ></i>
                        )}
                        <span>{allP[p].likes.length}</span>
                      </div>
                      <div className='mod-static-bottom-inf-1'>
                        <i className='far fa-comment'></i>
                        <span>{allP[p].comments.length}</span>
                      </div>
                    </div>
                    <div className='desc-like'>
                      {allP[p].likes.length > 1 ? (
                        <p style={{ marginBottom: '1rem' }}>
                          Liked by{' '}
                          <Link
                            to={
                              allP[p].likes.user !== isAuth()._id
                                ? `/user/${allP[p].likes.user}`
                                : `/profile`
                            }
                          >
                            {' '}
                            <strong>{`${allP[p].likes[0].name}`} </strong>
                          </Link>
                          and{' '}
                          <strong
                            style={{ cursor: 'pointer' }}
                            onClick={() => showLike(allP[p].likes)}
                          >
                            {`${allP[p].likes.length - 1}`} others
                          </strong>
                        </p>
                      ) : (
                        allP[p].likes.length > 0 && (
                          <p>
                            Liked by{' '}
                            <strong>{`${allP[p].likes[0].name}`}</strong>
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
                      <span onClick={() => postComment(allP[p]._id)}>Post</span>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )
    );
  }
};
Modal.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  allUserPosts: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  posts: state.posts,
});
// export default withRouter(Modal);
export default withRouter(
  connect(mapStateToProps, {
    getCurrentProfile,
    allUserPosts,
    deletePost,
    allPosts,
    likePost,
    unlikePost,
    commentPost,
  })(Modal)
);
