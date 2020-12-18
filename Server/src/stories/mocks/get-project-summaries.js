import GetProjectSummariesQuery from "../../client/modules/components/pages/projects/queries/get-project-summaries.js";

export default [
  {
    request: {
      query: GetProjectSummariesQuery
    },
    result: {
      data: {
        getProjects: {
          __typename: "ProjectsConnection",
          projects: [
            {
              __typename: "Project",
              id: "test-project-id",
              name: "Test Project",
              description: "Test Description",
              customer: {
                __typename: "Customer",
                id: "test-customer-id",
                name: "Test Customer"
              },
              dates: {
                __typename: "ProjectDates",
                created_at: "2020-12-15T16:45:35.843Z",
                start: null,
                end: null
              },
              scope: {
                __typename: "ProjectScope",
                hostsConnection: {
                  __typename: "HostsConnection",
                  totalCount: 6
                },
                networksConnection: {
                  __typename: "NetworksConnection",
                  totalCount: 2
                }
              }
            }
          ],
          totalCount: 1
        }
      }
    }
  }
];
