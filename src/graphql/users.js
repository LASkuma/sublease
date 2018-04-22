import gql from 'graphql-tag';

export const helpers = {
  signup: gql`
    mutation Signup($email: String!) {
      register(email: $email)
    }
  `,
};
