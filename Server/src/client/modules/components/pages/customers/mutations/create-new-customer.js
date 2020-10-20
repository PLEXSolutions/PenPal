import gql from "graphql-tag";

export default gql`
  mutation createNewCustomerMutation($name: String!, $industry: Industry!) {
    upsertCustomers(customers: [{ name: $name, industry: $industry }]) {
      id
      name
      industry
    }
  }
`;
