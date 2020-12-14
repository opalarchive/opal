/*
  ***********************************************************************************
  *                    The code in here should remain untouched!                    *
  *               Under NO CIRCUMSTANCES should this code be changed!               *
  ***********************************************************************************
  * In order to use AuthUserContext, import it as
  ```
  import { AuthUserContext } from '../Session';
  ```
  and use the starter code
  ```
  class YourPage extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              You can do what you want with your user. Right now, all that's stored is their username {authUser.username} and email. You can add more functions by customizing the sign up code.
            </div>
          )}
        </AuthUserContext.Consumer>
      );
    }
  }
  ```
  * withAuthentication should not need to be used - please never import it (because there may be severe security compromises if you do so).
  * withAuthorization can be used by importing it as
  ```
  import { withAuthorization } from '../Session';
  ```
  and then using it by changing the bottom
  ```
  export default YourPage;
  ```
  to
  ```
  const condition = authUser => !!authUser && !!authUser.roles[ROLES.ADMIN];
  export default withAuthorization(condition)(yourPage);
  ```
  * Note that if you already have one operation (such as withEmailVerification), change it from
  ```
  export default withEmailVerification(YourPage);
  ```
  to
  ```
  const condition = authUser => !!authUser && !!authUser.roles[ROLES.ADMIN];
  export default compose(
    withAuthorization(condition),
    withEmailVerification)(YourPage);
  ```
  (needs to also include `import compose from 'recompose';` before the class).
  * The condition can be changed to what you want. To check roles, I suggest to include all roles from the lowest to highest hierarchy.
  * To use withEmailVerification (which should be used if withAuthorization is), use
  ```
  import { withEmailVerification } from '../Session';
  ```
  and then in the bottom, change
  ```
  export default YourPage;
  ```
  to
  ```
  export default withEmailVerification(yourPage);
  ```
*/

import AuthUserContext from './context';
import withAuthentication from './withAuthentication';
import withAuthorization from './withAuthorization';
import withEmailVerification from './withEmailVerification.js';

export { AuthUserContext, withAuthentication, withAuthorization, withEmailVerification };
