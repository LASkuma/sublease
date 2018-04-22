import AWS from 'aws-sdk';

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: process.env.VUE_APP_USER_POOL,
  ClientId: process.env.VUE_APP_CLIENT_ID,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const setCredentials = (idToken) => {
  const region = process.env.VUE_APP_AWS_REGION;
  const identityPool = process.env.VUE_APP_IDENTITY_POOL;
  const key = `cognito-idp.${region}.amazonaws.com/${poolData.UserPoolId}`;

  AWS.config.update({
    region,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPool,
      Logins: {
        [key]: idToken,
      },
    }),
  });
};

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
        onSuccess: (result) => {
          const idToken = result.getIdToken().getJwtToken();

          setCredentials(idToken);
          resolve({
            status: 1,
            data: idToken,
          });
        },

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
        onSuccess: (result) => {
          const idToken = result.getIdToken().getJwtToken();
          setCredentials(idToken);
          resolve(idToken);
        },
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
            const idToken = result.getIdToken().getJwtToken();
            setCredentials(idToken);
            return resolve(idToken);
          });
        }
        const idToken = session.getIdToken().getJwtToken();
        setCredentials(idToken);
        return resolve(idToken);
      });

      return true;
    });
  },

  logout() {
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
  },
};
