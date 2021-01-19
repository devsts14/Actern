import React, { Fragment, useState, useCallback, useEffect } from 'react';
import Spinner from '../Layout/Spinner';
import Navbar from '../Layout/Navbar';
import axios from 'axios';
import { getCookie } from '../Auth/helpers';
import Cropper from 'react-easy-crop';
import { getOrientation } from 'get-orientation/browser';
import { getRotatedImage } from './crop/canvasUtils';
import getCroppedImg from './crop/cropImage';

const CreatePost = ({ history }) => {
  // cropping
  const [imageSrc, setImageSrc] = React.useState(null);
  const minZoom = 0.4;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // const [croppedImage, setCroppedImage] = useState(null);
  const [load, setLoad] = useState(false);
  // const [values, setValues] = useState({
  //   userpic: '',
  // });
  const [p, setP] = useState('');
  const [pro, setPro] = useState({
    desc: '',
  });
  // const { userpic } = values;
  const { desc } = pro;

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const clearSelection = () => {
    setImageSrc('');
  };

  const onChange = (e) => {
    setPro({ ...pro, [e.target.name]: e.target.value });
  };

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
            imageUrl: p,
            description: desc,
          };
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          await axios.post('/api/post', payload, config);
          history.push('/');
        } catch (error) {
          console.log(error);
        }
      }
      lol();
    }
    // eslint-disable-next-line
  }, [p]);

  const post = () => (
    <div className='post-container'>
      <div className='post-image'>
        {load && <Spinner className='spin' />}
        {imageSrc && (
          <i onClick={clearSelection} className='fas fa-arrow-left'></i>
        )}
        {imageSrc && !load && (
          <Cropper
            minZoom={minZoom}
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={1}
            restrictPosition={false}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        )}

        {!imageSrc && (
          <Fragment>
            <label htmlFor='file'>
              <i className='fas fa-plus-circle'></i>
            </label>
            <input
              onClick={(e) => (e.target.value = null)}
              style={{ visibility: 'hidden', display: 'none' }}
              type='file'
              name='file'
              id='file'
              onChange={onFileChange}
              accept='image/*'
            />
          </Fragment>
        )}
      </div>
      <div className='post-details'>
        <textarea
          placeholder='Description'
          onChange={onChange}
          type='text'
          name='desc'
          value={desc}
        />
      </div>
      <div className='postbtn'>
        <button onClick={showCroppedImage} variant='contained' color='primary'
        disabled={!imageSrc || !desc ?true : false }
        >
          Post
        </button>
      </div>
    </div>
  );

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

  return <Navbar>{post()}</Navbar>;
};

export default CreatePost;
