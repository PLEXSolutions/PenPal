import gql from "graphql-tag";

export const ProjectDetails = `
    id
    name
    customer {
      id
      name
    }
    description
    dates {
      created_at
      start
      end
    }
    scope {
      hostsConnection(first:5) {
        hosts {
          id
          ip_address
          mac_address
          project {
            id
          }
        }
        totalCount
      }
      networksConnection(first:5) {
        networks {
          id
          subnet
          hostsConnection(first:5) {
          	hosts {
              id
              ip_address
              network {
                subnet
              }
            }
            totalCount
          }
        }
        totalCount
      }
    }
`;

export default gql`
  fragment ProjectDetails on Project {
    ${ProjectDetails}
  }
`;
