import gql from "graphql-tag";

export default gql`
  query getProjectSummaries {
    getProjects(first: 10) {
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
