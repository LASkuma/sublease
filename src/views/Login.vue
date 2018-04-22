<template>
  <div>
    <div class="input">
      <mt-field
        placeholder="Please enter your email"
        type="email"
        v-model="user.email"
      />
      <mt-field
        placeholder="Please enter your password"
        type="password"
        v-model="user.password"
      />
    </div>
    <mt-button
      id="login-btn"
      type="primary"
      size="large"
      @click.native="handleLogin"
    >
      Login
    </mt-button>
    <mt-button
      type="default"
      size="large"
      @click.native="handleSignup"
    >
      Signup
    </mt-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Toast, Indicator } from 'mint-ui';

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
    };
  },
  computed: {
    ...mapState({
      loading: state => state.user.loading,
    }),
  },
  watch: {
    loading(newVal) {
      if (newVal) {
        Indicator.open();
      } else {
        Indicator.close();
      }
    },
  },
  methods: {
    ...mapActions(['login']),

    async handleLogin() {
      try {
        const result = await this.login(this.user);
        if (result === 1) {
          this.$router.push('/');
        } else if (result === 2) {
          this.$router.push('/challenge');
        }
      } catch (e) {
        Toast(e.message);
      }
    },

    handleSignup() {
      this.$router.push('/signup');
    },
  },
};
</script>

<style scoped>
.input {
  margin-top: 20px;
  margin-bottom: 20px;
}

#login-btn {
  margin-bottom: 10px;
}
</style>
