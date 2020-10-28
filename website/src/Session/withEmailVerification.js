/*
  ***********************************************************************************
  *                    The code in here should remain untouched!                    *
  *               Under NO CIRCUMSTANCES should this code be changed!               *
  ***********************************************************************************
*/

import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {

    constructor(props) {
      super(props);
      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase.doSendEmailVerification();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => needsEmailVerification(authUser)
            ?
            (
              <div className="text-container">
                <h1>Verify your email</h1>
                {this.state.isSent
                  ?
                  (
                    <p>
                      Email confirmation sent: Check you emails (Spam folder included) for a confirmation email. Refresh this page once you confirmed your email.
                    </p>
                  )
                  :
                  (
                    <div>
                      <p>
                        Check you emails (Spam folder included) for a confirmation email or send another confirmation email.
                      </p>
                      <button type="button" onClick={this.onSendEmailVerification} disabled={this.state.isSent} className={"form-btn semibold" + (this.state.isSent ? "" : " isValid")}>
                        Send confirmation email
                      </button>
                    </div>
                  )}
              </div>
            )
            :
            (<Component {...this.props} />)}
        </AuthUserContext.Consumer>
      );
    }
  }
  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
