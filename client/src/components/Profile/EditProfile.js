import React, { useEffect, useCallback, Fragment, useState } from 'react';
import axios from 'axios';
import Spinner from '../Layout/Spinner';
import Navbar from '../Layout/Navbar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCookie, updateUser } from '../Auth/helpers';
import { getCurrentProfile, editProfile } from '../../actions/profile';
import Cropper from 'react-easy-crop';
import { getOrientation } from 'get-orientation/browser';
import { getRotatedImage } from './crop/canvasUtils';
import getCroppedImg from './crop/cropImage';
import { setAlert } from '../../actions/alert';

const EditProfile = ({
  history,
  getCurrentProfile,
  editProfile,
  setAlert,
  profile: { loading, profile },
}) => {
  // cropping
  const [imageSrc, setImageSrc] = React.useState(null);
  const minZoom = 0.4;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // const [croppedImage, setCroppedImage] = useState(null);
  const [load, setLoad] = useState(false);
  const [values, setValues] = useState({
    userpic: '',
  });
  const [m, setM] = useState('');
  const [p, setP] = useState('');
  const [pro, setPro] = useState({
    name: '',
    bio: '',
    web1: '',
    web2: '',
    instagram: '',
    facebook: '',
    twitter: '',
    youtube: '',
  });
  const [k, setK] = useState('');
  const [n, setN] = useState('');
  const { userpic } = values;
  const { name, bio, web1, web2, instagram, facebook, twitter, youtube } = pro;

  useEffect(() => {
    setValues({
      ...values,
      userpic: JSON.parse(localStorage.getItem('user')).avatar,
    });
    setM('');
    setN('');
    // eslint-disable-next-line
  }, [m, n]);

  useEffect(() => {
    if (loading) {
      getCurrentProfile();
    }
    if (!loading) {
      setPro({
        ...pro,
        name: loading || !profile.user.name ? '' : profile.user.name,
        bio: loading || !profile.bio ? '' : profile.bio,
        web1: loading || !profile.websites.web1 ? '' : profile.websites.web1,
        web2: loading || !profile.websites.web2 ? '' : profile.websites.web2,
        instagram:
          loading || !profile.social.instagram ? '' : profile.social.instagram,
        facebook:
          loading || !profile.social.facebook ? '' : profile.social.facebook,
        twitter:
          loading || !profile.social.twitter ? '' : profile.social.twitter,
        youtube:
          loading || !profile.social.youtube ? '' : profile.social.youtube,
      });
    }
    // eslint-disable-next-line
  }, [loading]);

  const onChange = (e) => {
    setPro({ ...pro, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getCookie('token');
      if (name === '') {
        return setAlert('Name is required', 'danger');
      }
      const payload = {
        name,
        avatar: userpic,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('/api/update', payload, config);

      updateUser(response, () => {
        setK('abcd');
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (k) {
      editProfile(pro, history);
      setK('');
    }
    // eslint-disable-next-line
  }, [k]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(
    async (e) => {
      e.preventDefault();
      setLoad(true);
      try {
        const croppedImage = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          rotation
        );
        setImageSrc('');
        updatepic(croppedImage);
      } catch (e) {
        console.error(e);
      }
    },
    [croppedAreaPixels, rotation, imageSrc]
  );

  const updatepic = async (croppedImage) => {
    var blobUrl = croppedImage;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      var recoveredBlob = xhr.response;
      var reader = new FileReader();
      reader.onload = async function () {
        var blobAsDataUrl = reader.result;
        const data = new FormData();
        data.append('file', blobAsDataUrl);
        data.append('upload_preset', 'exodus');
        data.append('cloud_name', 'shaunniee');
        try {
          const res = await axios.post(
            'https://api.cloudinary.com/v1_1/shaunniee/image/upload',
            data
          );
          setP(res.data.url);
        } catch (error) {
          console.log(error);
        }
      };

      reader.readAsDataURL(recoveredBlob);
    };

    xhr.open('GET', blobUrl);
    xhr.send();
  };

  useEffect(() => {
    if (p) {
      async function lol() {
        try {
          const token = getCookie('token');
          const payload = {
            avatar: p,
          };
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.post('/api/update', payload, config);
          updateUser(response, () => {
            console.log(response);
            setM('abcd');
            setLoad(false);
          });
        } catch (error) {
          console.log(error);
        }
      }
      lol();
    }
    // eslint-disable-next-line
  }, [p]);

  const ORIENTATION_TO_ANGLE = {
    3: 180,
    6: 90,
    8: -90,
  };
  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      // apply rotation if needed
      const orientation = await getOrientation(file);
      const rotation = ORIENTATION_TO_ANGLE[orientation];
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
      }

      setImageSrc(imageDataUrl);
    } else {
      setImageSrc('');
    }
  };

  const removePhoto = async (e) => {
    e.preventDefault();

    try {
      const token = getCookie('token');
      const payload = {
        avatar: '',
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('/api/update', payload, config);
      updateUser(response, () => {
        setN('abcd');
        setLoad(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const prof = () => (
    <div className='edit-cont'>
      <form className='profile-update-form'>
        <h1>Edit profile</h1>
        <div className='prev'>
          <div className='prev-1'>
            {load && <Spinner />}
            {userpic && !imageSrc && !load ? (
              <img alt='Profile pic' className='avt' src={userpic}></img>
            ) : null}
            {!userpic && !imageSrc && !load ? (
              <img
                alt='Profile pic'
                className='avt'
                src='https://www.xeus.com/wp-content/uploads/2014/09/One_User_Orange.png'
              ></img>
            ) : null}
            {imageSrc && !load && (
              <Cropper
                minZoom={minZoom}
                image={imageSrc}
                crop={crop}
                rotation={rotation}
                zoom={zoom}
                aspect={1}
                restrictPosition={false}
                cropShape='round'
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className='prev-2'>
            <label htmlFor='file'> Add new Photo</label>
            <input
              onClick={(e) => (e.target.value = null)}
              style={{ visibility: 'hidden', display: 'none' }}
              type='file'
              name='file'
              id='file'
              onChange={onFileChange}
              accept='image/*'
            />
            {imageSrc && (
              <button
                onClick={showCroppedImage}
                variant='contained'
                color='primary'
                className='proupdate'
              >
                Crop and update
              </button>
            )}
            {userpic && !imageSrc && (
              <button onClick={removePhoto}>Remove photo</button>
            )}
            {imageSrc && <button>Remove selection</button>}
          </div>
        </div>
        <div className='form-grp'>
          <span>
            Name <i className='far fa-user'></i>
          </span>
          <input
            placeholder='Full name'
            onChange={onChange}
            name='name'
            type='text'
            value={name}
          />
        </div>
        <div className='form-grp'>
          <span>
            Bio <i className='far fa-user'></i>
          </span>
          <textarea
            placeholder='bio..'
            onChange={onChange}
            name='bio'
            type='text'
            value={bio}
          />
        </div>
        <div className='form-grp'>
          <span>
            Blog <i className='fab fa-blogger'></i>
          </span>

          <input
            placeholder='Blog'
            onChange={onChange}
            name='web1'
            type='text'
            value={web1}
          />
        </div>
        <div className='form-grp'>
          <span>
            Website <i className='fas fa-globe'></i>
          </span>
          <input
            placeholder='website'
            onChange={onChange}
            name='web2'
            type='text'
            value={web2}
          />
        </div>
        <div className='form-grp'>
          <span>
            Facebook <i className='fab fa-facebook-f'></i>
          </span>
          <input
            onChange={onChange}
            name='facebook'
            type='text'
            value={facebook}
            placeholder='facebook'
          />
        </div>
        <div className='form-grp'>
          <span>
            Instagram <i className='fab fa-instagram'></i>
          </span>
          <input
            onChange={onChange}
            name='instagram'
            type='text'
            value={instagram}
            placeholder='instagram'
          />
        </div>
        <div className='form-grp'>
          <span>
            Youtube <i className='fab fa-youtube'></i>
          </span>
          <input
            onChange={onChange}
            name='youtube'
            type='text'
            value={youtube}
            placeholder='youtube'
          />
        </div>
        <div className='form-grp'>
          <span>
            Twitter <i className='fab fa-twitter'></i>
          </span>
          <input
            onChange={onChange}
            name='twitter'
            type='text'
            value={twitter}
            placeholder='Twitter'
          />
        </div>
        <div className='sub'>
          <button onClick={onSubmit}>SUBMIT</button>
        </div>
      </form>
    </div>
  );
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Navbar>{prof()}</Navbar>
    </Fragment>
  );
};

EditProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  editProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  editProfile,
  setAlert,
})(EditProfile);
