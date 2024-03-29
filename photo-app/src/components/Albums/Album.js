import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Fade,
  Backdrop,
  Tooltip,
} from "@material-ui/core";
import {
  ContainerStyled,
  BoxContainer,
  CardContainer,
  AlbumDiv,
  Title,
  IconButtonStyled,
  StyledCardMedia,
  TitleDiv,
  TextFieldInputStyled,
  InputStyled,
  ModalDiv,
  ImgModal,
  BoxStyled,
  ArrowButtonStyled,
  DeletePhotoButton,
} from "./StylesAlbums";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseSharpIcon from "@material-ui/icons/CloseSharp";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { makeStyles } from "@material-ui/styles";
import { Link, Redirect } from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import Modal from "@material-ui/core/Modal";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
//CONTEXT
import { AuthContext } from "../../Auth";
//BACKEND
import { db } from "../../base";
import { storage } from "../../base";

const useStyles = makeStyles({
  albumButton: {
    fontSize: 30,
    display: "flex",
    padding: 0,
    alignItems: "flex-end",
  },
  modal: {},
});

const Album = (props) => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const albumId = props.match.params.id;
  const albumTitle = props.match.params.title;
  //State for photos
  const [url, setUrl] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState([]);
  const [inviteMember, setInviteMember] = useState([]);
  const [inviteCount, setInviteCount] = useState([]);

  const [openPhoto, setOpenPhoto] = React.useState(false);
  const [clickedPhoto, setClickedPhoto] = useState([]);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [stateRedirect, setStateRedirect] = useState(false);
  //Get photofile
  const getPhotoFile = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const setRedirect = () => {
    setStateRedirect(true);
  };

  const renderRedirect = () => {
    if (stateRedirect) {
      return <Redirect to="/myalbums" />;
    }
  };
  const confirmDelete = () => {
    if (currentUser.id === adminId) {
      var shouldDelete = window.confirm(
        "Do you really want to delete this album?"
      );
      if (shouldDelete) {
        deleteAlbum();
        setRedirect();
      }
    } else {
      alert("You don't have permission to do delete this album!");
    }
  };

  //Get Photos
  useEffect(() => {
    db.collection("photos")
      .where("albumId", "==", albumId)
      .onSnapshot((snapshot) => {
        const newPhotos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPhotos(newPhotos);
      });
  }, []);

  //Invite member to album
  const inviteMemberFunc = (e) => {
    e.preventDefault();
    handleClosedInviteModal();
    const getMemberId = db
      .collection("users")
      .where("username", "==", inviteMember);
    getMemberId.get().then((snapshot) => {
      snapshot.forEach((user) => {
        db.collection("albums")
          .doc(albumId)
          .get()
          .then((doc) => {
            const invited = doc.data().invited || [];
            invited.push(user.id);
            db.collection("albums").doc(albumId).update({ invited: invited });
          });
      });
    });
  };

  db.collection("albums")
    .doc(albumId)
    .onSnapshot((snapshot) => {
      let data = snapshot.data();
      if (data && typeof data.invited !== "undefined") {
        setInviteCount(data.invited.length);
        setAdminId(data.userId);
      }
    });

  //delete albums
  const deleteAlbum = () => {
    db.collection("albums").doc(albumId).delete();
    const deletePhotos = db
      .collection("photos")
      .where("albumId", "==", albumId);
    deletePhotos.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
  };

  //delete photos
  const deletePhoto = (x) => {
    db.collection("photos").doc(x.id).delete();
  };

  //Modals
  const handleOpen = (photoUrl) => {
    setOpenPhoto(true);
    setClickedPhoto(photoUrl);
  };

  const handleClosed = () => {
    setOpenPhoto(false);
  };

  const handleOpenPhotoModal = () => {
    setOpenPhotoModal(true);
  };

  const handleClosedPhotoModal = () => {
    setOpenPhotoModal(false);
  };

  const handleOpenInviteModal = () => {
    setOpenInviteModal(true);
  };

  const handleClosedInviteModal = () => {
    setOpenInviteModal(false);
  };

  //Add photos function
  const addPhotos = (e) => {
    e.preventDefault();
    handleClosedPhotoModal();
    //Upload photofile to firebase storage
    const uploadTask = storage.ref(`photos/${photoFile.name}`).put(photoFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("photos")
          .child(photoFile.name)
          .getDownloadURL()
          .then((url) => {
            //Add url, userId to database
            db.collection("photos").add({
              url: url,
              userId: currentUser.id,
              albumId: albumId,
            });
          });
        setUrl(url);
      }
    );
  };

  const photoCounter = photos.length;

  return (
    <div>
      {renderRedirect()}
      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={openPhoto}
        onClose={handleClosed}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
        }}
      >
        <BoxStyled style={{}}>
          <Fade in={openPhoto}>
            <ImgModal src={clickedPhoto} style={{}} />
          </Fade>
        </BoxStyled>
      </Modal>
      {/* Add Photo Modal */}
      <Modal
        style={{
          display: "flex",

          justifyContent: "center",
          alignItems: "center",
          color: "black",
        }}
        open={openPhotoModal}
        onClose={handleClosedPhotoModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
        }}
      >
        <Fade in={openPhotoModal}>
          <ModalDiv>
            <h2>Add Photo</h2>
            <TextFieldInputStyled>
              Choose File
              <InputStyled type="file" onChange={getPhotoFile} />
            </TextFieldInputStyled>

            <br />
            <div style={{ marginTop: 20 }}>
              <label style={{ paddingTop: "3px" }}>
                {photoFile && photoFile.name}
              </label>
            </div>
            <br />
            <div style={{ marginTop: 5 }}>
              <TextFieldInputStyled
                style={{ margin: 0, paddingTop: "3px" }}
                onClick={addPhotos}
                type="button"
                data-dismiss="modal"
              >
                Add
              </TextFieldInputStyled>
            </div>
          </ModalDiv>
        </Fade>
      </Modal>

      {/* Invite members to Album modal*/}
      <Modal
        style={{
          display: "flex",

          justifyContent: "center",
          alignItems: "center",
          color: "black",
        }}
        open={openInviteModal}
        onClose={handleClosedInviteModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
        }}
      >
        <Fade in={openInviteModal}>
          <ModalDiv>
            <h4>Invite members to album</h4>
            <div style={{ marginBottom: 30 }}>
              <TextField
                error={false}
                required
                label="Username"
                onChange={(e) => {
                  setInviteMember(e.target.value);
                }}
              />
            </div>

            <TextFieldInputStyled
              type="button"
              onClick={inviteMemberFunc}
              data-dismiss="modal"
            >
              Invite member
            </TextFieldInputStyled>
          </ModalDiv>
        </Fade>
      </Modal>

      {/* onClick={addPhotos} should sit inside modal as 'add button' */}

      <ContainerStyled maxWidth="md">
        <ArrowButtonStyled component={Link} to="/myalbums" style={{}}>
          <ArrowBackIcon
            style={{
              color: "#bc5100",
              fontSize: "3.5vh",
            }}
          />
        </ArrowButtonStyled>
        <TitleDiv>
          <Title variant="h5" style={{ fontSize: "3.5vh" }}>
            {albumTitle}
          </Title>
          <div className={classes.albumButton}>
            <Tooltip title="Add Photo" placement="bottom">
              <IconButtonStyled
                aria-label="Add Photo"
                onClick={handleOpenPhotoModal}
              >
                <AddPhotoAlternateIcon
                  style={{ color: "#bc5100", fontSize: "3.5vh" }}
                />
              </IconButtonStyled>
            </Tooltip>
            <Tooltip title="Invite Friend">
              <IconButtonStyled onClick={handleOpenInviteModal}>
                <PersonAddIcon
                  style={{ color: "#bc5100", fontSize: "3.5vh" }}
                />
              </IconButtonStyled>
            </Tooltip>
            <Tooltip title="Delete Album">
              <IconButtonStyled onClick={confirmDelete}>
                <DeleteIcon style={{ color: "#bc5100", fontSize: "3.5vh" }} />
              </IconButtonStyled>
            </Tooltip>
          </div>
        </TitleDiv>
        <Box borderBottom={1} />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h3>Photos: {photoCounter}</h3>
          <h3>Invited: {inviteCount}</h3>
        </div>
      </ContainerStyled>
      <Container style={{ paddingBottom: "60px" }}>
        {/* Box för display flex */}
        <BoxContainer>
          {photos.map((photo, index) => (
            <AlbumDiv key={index}>
              <DeletePhotoButton
                onClick={(e) => {
                  deletePhoto(photo);
                }}
              >
                <CloseSharpIcon style={{ fontSize: 15 }} />
              </DeletePhotoButton>
              <CardContainer>
                <CardActionArea
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  onClick={(e) => {
                    handleOpen(photo.url);
                  }}
                >
                  <StyledCardMedia component="img" src={photo.url} />
                </CardActionArea>
              </CardContainer>
            </AlbumDiv>
          ))}
        </BoxContainer>
      </Container>
    </div>
  );
};
export default Album;
