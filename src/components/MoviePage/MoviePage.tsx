import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button, Container, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


import axios from 'axios';
import BasicTabs from './Tabs/BasicTabs';

import styles from './MoviePage.module.scss';

type Props = {}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 500,
  color: 'black',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  transition: '0.3s',
  p: 4,
};

const MoviePage = (props: Props) => {

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);


  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [open, setOpen] = useState(false);

  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [typeOfSnackBarMessage, setTypeOfSnackBarMessage] = useState('success');

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        Закрыть
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


  const id = useParams().id;

  type Movie = {
    name: string,
    genres: Array<{
      name: string,
    }>,
    countries: Array<{
      name: string,
    }>,
    persons: Array<Object>,
    id: number,
    year: number,
    description: string,
    rating: {
      kp: number,
    }
    poster: {
      _id: string,
      url: string,
      previewUrl: string
    },
  }

  const [movie, setMovie] = useState<Movie | null>(null);

  const rating = Number(movie?.rating?.kp.toFixed(1));

  let movies = localStorage.getItem('movies') || '';

  async function getMovieInfo() {
    try {
      const response = await axios.get(`https://api.kinopoisk.dev/movie?token=KNPB2YP-RW0MH46-H4RVRAZ-CCFGZVF&search=${id}&field=id`)

      setMovie(response.data);

      console.log(response.data);
    }
    catch (error) {
      alert("Error" + error.message)
    }
  }
  async function createRoom() {
    alert('hello world')
  }
  async function addToFavorite() {

    if (movies.indexOf(String(id)) > -1) {
      setSnackBarMessage(prev => 'Фильм уже добавлен в избранное! :c')
      handleClick();
    }

    else {
      localStorage.setItem('movies', (localStorage.getItem('movies') || '') + `${id}.`);
      setSnackBarMessage(prev => 'Фильм добавлен в избранное!')
      handleClick();
    }
  }


  async function addToPlayNext() {
    alert('hello world')
  }
  async function shareFilm() {
    alert('hello world')
  }

  useEffect(() => {
    getMovieInfo();
  }, [])

  return (
    <div className={styles['movie-page']}>
      <div className={styles['movie-information']}>

        <div>
          <h1>{movie?.name}</h1>
          <div className={styles['movie-year']}>
            <div>
              {movie?.countries[0]?.name} {movie?.year}
            </div>
          </div>

          <p className={styles.description}>
            {movie?.description}
          </p>

          <div>
            {movie?.genres.map((genre, i) => {
              return <span key={i} className={styles.genre}>{genre?.name.toUpperCase()}</span>;
            })}
          </div>

          <div>
            <Button variant="contained" sx={{ background: "linear-gradient(155deg, rgba(255,183,0,1) 0%, rgba(187,0,130,1) 100%)", marginTop: "3em" }} size="large" className={styles['create-room-button']}
              onClick={handleOpenModal}
            >
              Создать комнату
            </Button>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <center><h2 className={styles['create-room-title']}>Создание комнаты</h2></center>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <div className={styles['enter-name']}>
                    <h3>Введите ваше имя:</h3>
                    <TextField variant='filled'></TextField>
                  </div>

                  <div style={{marginTop: "3em"}}>
                    <h3>Выберите тип комнаты</h3>
                    <div>
                      <BasicTabs />
                    </div>

                    <div className={styles['create-room']}>
                      <Button variant="outlined">Создать комнату</Button>
                    </div>
                  </div>
                </Typography>
              </Box>
            </Modal>
          </div>

          <div className={styles.favorite}>
            <TurnedInIcon fontSize="large" className={movies.indexOf(String(id)) > -1 ? 'addedToFavorite' : 'info'} onClick={addToFavorite} />
            <QueuePlayNextIcon fontSize="large" onClick={addToPlayNext} />
            <ShareIcon fontSize="large" onClick={shareFilm} />
            <div>
              <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                  {snackBarMessage}
                </Alert>
              </Snackbar>
            </div>
          </div>
        </div>

        <img style={{ boxShadow: `0px 0px 85px #fff` }} className={styles['movie-poster']} src={movie?.poster?.url} alt="Movie Poster" height="800" width="auto" />
      </div>
    </div>
  )
}

export default MoviePage; 