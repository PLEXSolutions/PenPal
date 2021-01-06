import gql from "graphql-tag";

export default gql`
  query getProjectSummaries(
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    getProjects(first: $first, after: $after, last: $last, before: $before) {
      projects {
        id
        name
        description
        customer {
          id
          name
        }
        dates {
          created_at
          start
          end
        }
        scope {
          hostsConnection {
            totalCount
          }
          networksConnection {
            totalCount
          }
        }
      }
      totalCount
    }
  }
`;
