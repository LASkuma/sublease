<template>
  <div>
    <mt-cell
      id="logout"
      title="Logout"
      @click.native="handleLogout"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { Toast } from 'mint-ui';

export default {
  methods: {
    ...mapActions(['logout']),

    handleLogout() {
      this.logout();
      Toast('You have logged out');
      this.$emit('logout');
    },
  },
};
</script>

<style>
#logout .mint-cell-title {
  text-align: center;
}

#logout .mint-cell-text {
  color: #f56c6c;
}
</style>
