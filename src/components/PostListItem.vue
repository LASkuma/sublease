<template>
  <div>
    <img
      class="image"
      v-lazy.post-list="imageUrl" />
    <div class="info">
      <div class="left">
        <h3 class="address">
          {{ post.address }}
        </h3>
        <h3 class="type">
          {{ post.type }} in {{ apartmentType }}
        </h3>
      </div>
      <div class="right">
        <div class="price">
          ${{ post.price }}
        </div>
        <div class="time">
          {{ displayTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  computed: {
    imageUrl() {
      const bucket = process.env.VUE_APP_POST_IMAGE_POOL;
      return `https://s3.amazonaws.com/${bucket}/${this.post.pictureId}_0`;
    },

    apartmentType() {
      if (this.post.bedrooms === 0) {
        return 'Studio';
      }
      return `${this.post.bedrooms}B${this.post.bathrooms}B`;
    },

    displayTime() {
      const from = moment(this.post.from).format('MM/DD');
      if (this.post.to) {
        const to = moment(this.post.to).format('MM/DD');
        return `${from}-${to}`;
      }
      return `From: ${from}`;
    },
  },
};
</script>

<style scoped>
.image {
  width: 100%;
  height: 200px;
}

.info {
  margin: 0 5px;
  display: flex;
}

.left {
  flex-grow: 1;
}

.right {
  flex: none;
  text-align: right;
}

.address {
  font-size: 15px;
  font-weight: 500;
  margin: 0;
}

.type {
  font-size: 12px;
  font-weight: 400;
  color: #606266;
  margin-top: 5px;
}

.time {
  font-size: 12px;
  margin-top: 5px;
  color: #606266;
}
</style>
