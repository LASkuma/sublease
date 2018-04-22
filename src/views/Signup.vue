<template>
  <div>
    <div class="input">
      <mt-field
        placeholder="Please enter your email"
        type="email"
        v-model="email"
      />
    </div>
    <mt-button
      type="primary"
      size="large"
      @click.native="handleSignup"
    >
      Signup
    </mt-button>
  </div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui';
import * as users from '../graphql/users';

export default {
  data() {
    return {
      email: '',
    };
  },

  computed: {
    loading() {
      return this.$apollo.loading;
    },
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
    async handleSignup() {
      const { email } = this;
      this.email = '';

      try {
        const result = await this.$apollo.mutate({
          mutation: users.helpers.signup,
          variables: {
            email,
          },
        });
        Toast(result.data.register);
        this.$router.push('/login');
      } catch (err) {
        Toast(err.message);
        this.email = email;
      }
    },
  },
};
</script>

<style scoped>
.input {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
