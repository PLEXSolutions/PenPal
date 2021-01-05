import faker from "faker";
import _ from "lodash";
import GetProjectSummariesQuery from "../../client/modules/components/pages/projects/queries/get-project-summaries.js";

const PROJECT_COUNT = 20;

const projects = _.range(PROJECT_COUNT).map((i) => ({
  id: `test-project-id-${i}`,
  name: `${faker.commerce.product()} Pentest`,
  description: "A pentest for the product",
  customer: {
    id: "test-customer-id",
    name: `${faker.company.companyName()}`
  },
  dates: {
    created_at: faker.date.recent(),
    start: null,
    end: null
  },
  scope: {
    hostsConnection: {
      totalCount: 6
    },
    networksConnection: {
      totalCount: 2
    }
  }
}));

const get_projects_generator = ({ variables: { first, after } = {} }) => {
  if (first !== undefined) {
    if (after !== undefined) {
      const start = _.findIndex(projects, (project) => project.id === after);
      if (start !== -1) {
        return projects.slice(start, start + first);
      } else {
        return null;
      }
    } else {
      return projects.slice(0, first);
    }
  } else {
    return projects;
  }
};

const variable_combos = [
  { first: 5 },
  { first: 10 },
  { first: 25 },
  { first: -1 }
];

export default variable_combos.map((variables) => ({
  request: {
    query: GetProjectSummariesQuery,
    variables
  },
  result: {
    data: {
      getProjects: get_projects_generator({ variables })
    }
  }
}));
