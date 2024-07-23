import { gql } from '@apollo/client';


export const CURRENT_USER = gql`
query Query{
    currentUser {
        id
        title
        firstname
        lastname
        email
        phone
        date_of_birth
        gender
        data
        settings
        created_at
  }
}
`;

export const GET_CONFIG = gql`
query Query {
  getConfig
}
`;