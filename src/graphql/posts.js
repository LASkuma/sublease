import gql from 'graphql-tag';

export const fragments = {
  post: gql`
    fragment SimplePost on Post {
      id
      user
      address
      building
      state
      city
      description
      price
      from
      to
      bedrooms
      bathrooms
      pictureId
      pictureNumber
      type
      status
      updatedAt
      createdAt
    }
  `,
};

export const queries = {
  posts: gql`
    query Posts {
      posts {
        ...SimplePost
      }
    }
    ${fragments.post}
  `,

  postById: gql`
    query GetPostById($id: ID!) {
      postById(id: $id) {
        ...SimplePost
      }
    }
    ${fragments.post}
  `,
};

export const mutations = {
  createPost: gql`
    mutation CreatePost($lease: LeaseInput!) {
      createPost(lease: $lease) {
        ...SimplePost
      }
    }
    ${fragments.post}
  `,
};

export const helpers = {
  getPostById(id) {
    return {
      query: queries.postById,
      variables: {
        id,
      },
    };
  },
};
