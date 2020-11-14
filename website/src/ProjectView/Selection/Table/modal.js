import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button
} from "@material-ui/core";
import { Trash2, UserPlus, Edit2, CornerLeftUp } from "react-feather";

export default function Modal(props) {
  switch (props.type) {
    case "share":
      return (
        <Dialog
          open={props.show}
          onClose={props.onClose}
          aria-labelledby="share-dialog-title"
          aria-describedby="share-dialog-description"
        >
          <DialogTitle id="share-dialog-title">Share</DialogTitle>
          <DialogContent>
            <DialogContentText id="share-dialog-description">
              To share this project, please enter your desired collaborator's email address.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              value={props.input}
              onChange={props.inputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button
              onClick={props.modalSuccess}
              startIcon={<UserPlus />}
              color="primary"
              variant="contained"
              autoFocus
            >
              Share
            </Button>
          </DialogActions>
        </Dialog>
      );
    case "delete":
      return (
        <Dialog
          open={props.show}
          onClose={props.onClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Are you sure you want to delete this project?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Deleting this project will move it to your trash, where you can
              choose to permanently delete it or restore it.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={props.onClose}
              variant="contained"
              color="primary"
              autoFocus
            >
              Cancel
            </Button>
            <Button
              onClick={props.modalSuccess}
              startIcon={<Trash2 />}
              color="primary"
              variant="outlined"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      );
    case "delete-forever":
      return (
        <Dialog
          open={props.show}
          onClose={props.onClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Are you sure you want to permanently delete this project? You will not be able to restore it in the future.
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Permanently deleting this project will remove it from your trash, and it won't be accessible again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={props.onClose}
              variant="contained"
              color="primary"
              autoFocus
            >
              Cancel
            </Button>
            <Button
              onClick={props.modalSuccess}
              startIcon={<Trash2 />}
              color="primary"
              variant="outlined"
            >
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>
      );
    case "change-name":
      return (
        <Dialog
          open={props.show}
          onClose={props.onClose}
          aria-labelledby="change-name-dialog-title"
          aria-describedby="change-name-dialog-description"
        >
          <DialogTitle id="change-name-dialog-title">Rename</DialogTitle>
          <DialogContent>
            <DialogContentText id="change-name-dialog-description">
              Enter a new name for your project.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              value={props.input}
              onChange={props.inputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button
              onClick={props.modalSuccess}
              startIcon={<Edit2 />}
              color="primary"
              variant="contained"
              autoFocus
            >
              Change
            </Button>
          </DialogActions>
        </Dialog>
      );
    case "restore":
      return (
        <Dialog
          open={props.show}
          onClose={props.onClose}
          aria-labelledby="restore-dialog-title"
          aria-describedby="restore-dialog-description"
        >
          <DialogTitle id="restore-dialog-title">
            Are you sure you want to restore this project?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="restore-dialog-description">
              IDK man.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose} color="primary" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={props.modalSuccess}
              startIcon={<CornerLeftUp />}
              variant="contained"
              color="primary"
              autoFocus
            >
              Restore
            </Button>
          </DialogActions>
        </Dialog>
      );
    case "star":
      if (props.show) props.modalSuccess({preventDefault: () => {}});
      return (
        <></>
      );
    default:
      return <h1>BLARGH</h1>;
  }
}
