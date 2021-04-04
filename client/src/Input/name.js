import { Grid, TextField } from "@material-ui/core";
import React from "react";

class NameInput extends React.Component {
  render() {
    const {
      variant,
      first: { firstName, firstNameError, firstNameHelper },
      last: { lastName, lastNameError, lastNameHelper },
      onChange,
      onBlur,
    } = this.props;

    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant={variant}
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              error={firstNameError}
              helperText={firstNameError && firstNameHelper}
              value={firstName}
              onChange={onChange}
              onBlur={onBlur}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant={variant}
              name="lastName"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              error={lastNameError}
              helperText={lastNameError && lastNameHelper}
              value={lastName}
              onChange={onChange}
              onBlur={onBlur}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default NameInput;
