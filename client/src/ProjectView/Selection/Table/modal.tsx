import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Trash2, UserPlus, Edit2, CornerLeftUp } from "react-feather";
import {
  isProjectActionProtected,
  isProjectActionTrivial,
  projectAction,
  ProjectActionProtected,
  ProjectActionTrivial,
} from "../../../../../.shared/src/types";

interface ModalProps {
  show: boolean;
  type: projectAction;
  closeModal: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  input: string;
  inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  modalSuccess: (event?: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const Modal: React.FC<ModalProps> = ({
  show,
  type,
  closeModal,
  input,
  inputChange,
  modalSuccess,
}) => {
  const onClose = (
    event: React.MouseEvent<HTMLButtonElement>,
    reason: "backdropClick" | "escapeKeyDown"
  ) => closeModal(event);

  if (isProjectActionProtected(type)) {
    switch (ProjectActionProtected[type]) {
      case ProjectActionProtected.SHARE:
        return (
          <Dialog
            open={show}
            onClose={onClose}
            aria-labelledby="share-dialog-title"
            aria-describedby="share-dialog-description"
          >
            <DialogTitle id="share-dialog-title">Share</DialogTitle>
            <DialogContent>
              <DialogContentText id="share-dialog-description">
                To share this project, please enter your desired collaborator's
                username.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Username"
                type="username"
                value={input}
                onChange={inputChange}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} variant="outlined" color="primary">
                Cancel
              </Button>
              <Button
                onClick={modalSuccess}
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
      case ProjectActionProtected.DELETE:
        return (
          <Dialog
            open={show}
            onClose={onClose}
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
                onClick={closeModal}
                variant="contained"
                color="primary"
                autoFocus
              >
                Cancel
              </Button>
              <Button
                onClick={modalSuccess}
                startIcon={<Trash2 />}
                color="primary"
                variant="outlined"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        );
      case ProjectActionProtected.CHANGE_NAME:
        return (
          <Dialog
            open={show}
            onClose={onClose}
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
                value={input}
                onChange={inputChange}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} variant="outlined" color="primary">
                Cancel
              </Button>
              <Button
                onClick={modalSuccess}
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
      case ProjectActionProtected.RESTORE:
        return (
          <Dialog
            open={show}
            onClose={onClose}
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
              <Button onClick={closeModal} color="primary" variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={modalSuccess}
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
      default:
        return <h1>BLARGH</h1>;
    }
  } else if (isProjectActionTrivial(type)) {
    switch (ProjectActionTrivial[type]) {
      case ProjectActionTrivial.STAR:
        if (show) modalSuccess();
        return <></>;
      default:
        return <h1>BLARGH</h1>;
    }
  } else {
    return <h1>what</h1>;
  }
};

export default Modal;
