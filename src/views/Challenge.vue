<template>
  <div>
    <div class="input">
      <p class="description">You need to set a new password:</p>
      <mt-field
        placeholder="Enter new password"
        type="password"
        v-model="password"
      />
      <mt-field
        placeholder="Confirm new password"
        type="password"
        v-model="confirm"
      />
    </div>
    <mt-button
      type="primary"
      size="large"
      @click.native="handleSubmit"
     >
      Submit
    </mt-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Toast, Indicator } from 'mint-ui';

export default {
  data() {
    return {
      password: '',
      confirm: '',
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
    ...mapActions(['passwordChallenge']),
    async handleSubmit() {
      if (this.password !== this.confirm) {
        Toast('Password does not match the confirm password');
        return;
      }
      try {
        await this.passwordChallenge({ password: this.password });
        this.$router.push('/');
      } catch (err) {
        Toast(err.message);
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

.input .description {
  font-family: 'Helvetica Neue';
  margin: 0 0 5px 5px;
  color: #333;
}
</style>
