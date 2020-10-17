import gql from "graphql-tag";

export default gql`
  {
    getCustomers {
      id
      name
      industry
    }
  }
`;
