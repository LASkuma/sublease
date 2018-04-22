import users from '../../api/users';

const state = {
  type: 'Owner',
  authenticated: 0,
  loading: false,
  challengeData: {},
};

const mutations = {
  SELECT_USER_TYPE(state, { type }) {
    state.type = type;
  },

  LOGIN_REQUEST(state) {
    state.loading = true;
  },

  LOGIN_SUCCESS(state) {
    state.loading = false;
    state.authenticated = 1;
  },

  LOGIN_FAILURE(state) {
    state.loading = false;
    state.authenticated = 0;
  },

  LOGOUT(state) {
    state.authenticated = 0;
  },

  USER_LOGIN_PASS_CHALLENGE_NEEDED(state, { data }) {
    state.loading = false;
    state.authenticated = 2;
    delete data.userAttributes.email_verified;
    delete data.userAttributes.email;
    state.challengeData = data;
  },

  USER_LOGIN_PASS_CHALLENGE_REQUEST(state) {
    state.loading = true;
    state.challengeData.cognitoUser = null;
  },

  USER_LOGIN_PASS_CHALLENGE_SUCCESS(state) {
    state.loading = false;
    state.authenticated = 1;
  },

  USER_LOGIN_PASS_CHALLENGE_FAILURE(state, { cognitoUser }) {
    state.challengeData.cognitoUser = cognitoUser;
    state.loading = false;
  },
};

const actions = {
  async login({ commit }, { email, password, remember }) {
    commit('LOGIN_REQUEST');
    try {
      const response = await users.login(email, password, remember);
      if (response.status === 1) {
        commit('LOGIN_SUCCESS');
        // TODO: set Header
      } else if (response.status === 2) {
        commit('USER_LOGIN_PASS_CHALLENGE_NEEDED', { data: response.data });
      }
      return response.status;
    } catch (e) {
      commit('LOGIN_FAILURE');
      throw e;
    }
  },

  async passwordChallenge({ commit, state }, { password }) {
    const { cognitoUser } = state.challengeData;
    commit('USER_LOGIN_PASS_CHALLENGE_REQUEST');
    try {
      const userAttributes = { ...state.challengeData.userAttributes };
      const response = await users.passwordChallenge(cognitoUser, password, userAttributes);
      commit('USER_LOGIN_PASS_CHALLENGE_SUCCESS');
      return response;
    } catch (e) {
      commit('USER_LOGIN_PASS_CHALLENGE_FAILURE', { cognitoUser });
      throw e;
    }
  },

  async authenticate({ commit }) {
    commit('LOGIN_REQUEST');
    try {
      await users.authenticate();
      commit('LOGIN_SUCCESS');
    } catch (e) {
      commit('LOGIN_FAILURE');
      throw e;
    }
  },

  logout({ commit }) {
    users.logout();
    commit('LOGOUT');
  },
};

export default {
  state,
  mutations,
  actions,
};
