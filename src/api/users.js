const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: process.env.VUE_APP_USER_POOL,
  ClientId: process.env.VUE_APP_CLIENT_ID,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export default {
  login(Username, Password) {
    const authenticationData = { Username, Password };

    const authDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const userData = {
      Pool: userPool,
      Username,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: result =>
          resolve({
            status: 1,
            data: result.getIdToken().getJwtToken(),
          }),
        onFailure: err => reject(err),
        newPasswordRequired: (userAttributes, requiredAttributes) =>
          resolve({
            status: 2,
            data: {
              userAttributes,
              requiredAttributes,
              cognitoUser,
            },
          }),
      });
    });
  },

  passwordChallenge(cognitoUser, password, userAttributes) {
    return new Promise((resolve, reject) => {
      cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
        onSuccess: result => resolve(result.getIdToken().getJwtToken()),
        onFailure: err => reject(err),
      });
    });
  },

  authenticate() {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();

      if (!cognitoUser) {
        return reject(new Error('No user in local storage'));
      }

      cognitoUser.getSession((err, session) => {
        if (err) {
          return reject(err);
        }

        if (!session.isValid()) {
          const refreshToken = session.getRefreshToken().getToken();
          cognitoUser.refreshSession(refreshToken, (e, result) => {
            if (e) {
              return reject(new Error('Session cannot be refreshed'));
            }
            return resolve(result.getIdToken().getJwtToken());
          });
        }
        return resolve(session.getIdToken().getJwtToken());
      });

      return true;
    });
  },

  logout() {
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
  },
};
