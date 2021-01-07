import gql from "graphql-tag";

export default gql`
  mutation createProjectMutation(
    $customer: ID!
    $name: String!
    $description: String!
    $start_date: Date
    $end_date: Date
    $project_ips: [IPAddress]
    $project_networks: [IPSubnet]
  ) {
    createProject(
      project: {
        customer: $customer
        name: $name
        description: $description
        dates: { start: $start_date, end: $end_date }
        scope: { hosts: $project_ips, networks: $project_networks }
      }
    ) {
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
  }
`;
