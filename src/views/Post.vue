<template>
  <div>
    <mt-swipe
      class="image"
      :auto="4000"
    >
      <mt-swipe-item
        v-for="url in imageUrls"
        :key="url"
      >
        <img
          class="image"
          :src="url" />
      </mt-swipe-item>
    </mt-swipe>

    <div class="info">
      <h3 class="address">
        {{ post.address }}
      </h3>
      <h3 class="address">
        {{ post.city }}, {{ post.state }}
      </h3>
      <h3 class="type">
        {{ post.type }} in {{ apartmentType }}
      </h3>
      <div class="price">
        ${{ post.price }}
      </div>
      <div class="time">
        {{ displayTime }}
      </div>
      <p>
        {{ post.description }}
      </p>
      <mt-button
        type="default"
        size="large"
        @click.native="$router.push('/')"
      >
        See more Listings
      </mt-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import * as Posts from '../graphql/posts';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      post: {},
    };
  },

  computed: {
    imageUrls() {
      const result = [];
      const { pictureId, pictureNumber } = this.post;
      const bucket = process.env.VUE_APP_POST_IMAGE_POOL;

      for (let i = 0; i < pictureNumber; i += 1) {
        result.push(`https://s3.amazonaws.com/${bucket}/${pictureId}_${i}`);
      }

      return result;
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

  apollo: {
    post() {
      return {
        ...Posts.helpers.getPostById(this.id),
        update: data => data.postById,
      };
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
  margin: 0 10px;
}

.address {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.type {
  font-size: 15px;
  font-weight: 400;
  color: #606266;
  margin-top: 5px;
  margin-bottom: 5px;
}

.time {
  font-size: 15px;
  margin-top: 5px;
  color: #606266;
}
</style>
