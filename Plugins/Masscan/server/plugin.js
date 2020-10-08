import { types, resolvers, loaders } from "./graphql";

const settings = {
  docker: {
    name: "masscan",
    dockerfile: `
FROM ubuntu:14.04

# Set locales
RUN locale-gen en_GB.UTF-8
ENV LANG en_GB.UTF-8
ENV LC_CTYPE en_GB.UTF-8

# Fix sh
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install dependencies
RUN apt-get update
RUN apt-get install -y git build-essential curl wget libpcap-dev

# Clone masscan git repo
RUN git clone https://github.com/robertdavidgraham/masscan /opt/masscan
WORKDIR /opt/masscan

# Make masscan
RUN make -j

# Copy binary
RUN cp /opt/masscan/bin/masscan /usr/local/bin

# Launch Bash
CMD ["/bin/bash"]
  `,
  },
  n8n: {
    workflow_nodes: [
      {
        executeHandler: "performMasscan",
        executeHandlerType: "mutation",
        variables: ["projectID", "ips", "ports", "scanRate"],
        fields: ["was_success"],
        node: {
          displayName: "Masscan",
          name: "MasscanPlugin",
          icon: "fa:question-circle",
          description: "Perform masscan for specified host(s)",
          properties: [
            {
              displayName: "Project ID",
              name: "projectID",
              type: "string",
              default: "",
              description: "Project ID of Host to Masscan",
              required: true,
            },
            {
              displayName: "IP Addresses",
              name: "ips",
              type: "string",
              default: "",
              description: "A comma seperated list of IPv4 addresses to scan",
              required: true,
            },
            {
              displayName: "Ports",
              name: "ports",
              type: "string",
              default: "80,443",
              description:
                "A comma seperated list of ports to scan on each host",
              required: true,
            },
            {
              displayName: "Scan Rate",
              name: "scanRate",
              type: "number",
              default: "1000",
              description:
                "Rate of scan to perform (provided in packets per second (pps))",
              required: true,
            },
            {
              displayName: "Successful",
              name: "was_success",
              type: "boolean",
              default: true,
              description:
                "Masscan tasked successfully",
              required: true,
            },
          ],
        },
      },
    ],
  },
};

const MasscanPlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings,
    };
  },
};

export default MasscanPlugin;
