import gql from "graphql-tag";

export default gql`
  mutation createProjectMutation(
    $customer: String!
    $name: String!
    $description: String!
    $start_date: Date
    $end_date: Date
    $project_ips: [String]
    $project_networks: [String]
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
    }
  }
`;
