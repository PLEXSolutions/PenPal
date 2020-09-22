import gql from "graphql-tag";

export default gql`
  {
    __schema {
      types {
        name
        description
        kind
        fields {
          name
          type {
            name
          }
        }
        inputFields {
          name
          description
          type {
            name
          }
        }
      }
      queryType {
        name
        fields {
          name
          description
        }
      }
      mutationType {
        name
        fields {
          name
          description
        }
      }
    }
  }
`;
