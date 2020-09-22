import React, { useState } from "react";
import _ from "lodash";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";
import { SetupProviders } from "./common.js";
import TreeView from "@material-ui/lab/TreeView";

const explore = storiesOf("UI/Explore", module);

const test_data = [
  {
    _id: "1",
    system_config: { osname: "Fedora 30" },
    network_interfaces: [
      {
        name: "eth0",
        addresses: [
          {
            ip_address: "192.168.1.1"
          }
        ]
      }
    ]
  },
  {
    _id: "2",
    system_config: { osname: "RHEL 7" },
    network_interfaces: [
      {
        name: "eth0",
        addresses: [
          {
            ip_address: "192.168.1.97"
          }
        ]
      }
    ]
  },
  {
    _id: "3",
    system_config: { osname: "Centos 7" },
    network_interfaces: [
      {
        name: "eth0",
        addresses: [
          {
            ip_address: "192.168.1.100"
          }
        ]
      }
    ]
  },
  {
    _id: "4",
    system_config: { osname: "Ubuntu 20.04" },
    network_interfaces: [
      {
        name: "eth0",
        addresses: [
          {
            ip_address: "192.168.1.136"
          }
        ]
      }
    ]
  },
  {
    _id: "5",
    system_config: { osname: "MacOS X" },
    network_interfaces: [
      {
        name: "eth0",
        addresses: [
          {
            ip_address: "192.168.1.145"
          }
        ]
      }
    ]
  },
  {
    _id: "6",
    system_config: { osname: "Debian 10" },
    network_interfaces: [
      {
        name: "eth0",
        addresses: [
          {
            ip_address: "192.168.1.250"
          }
        ]
      }
    ]
  },
  {
    _id: "7",
    system_config: { osname: "Windows 10" },
    network_interfaces: [
      {
        name: "eth0",
        addresses: [
          {
            ip_address: "192.168.1.251"
          }
        ]
      }
    ]
  }
];
explore.add("TaskDrawer", () => {
  const [visible, setVisible] = useState(true);
  const [agentsToTask, setAgentsToTask] = useState(test_data);

  const onRemoveAgent = agent =>
    setAgentsToTask(_.filter(agentsToTask, _agent => agent._id !== _agent._id));

  return (
    <SetupProviders>
      <Components.TaskDrawer
        visible={visible}
        onClose={() => {
          setVisible(false);
          setTimeout(() => setVisible(true), 2000);
        }}
        agents_to_task={agentsToTask}
        onRemoveAgent={onRemoveAgent}
      />
    </SetupProviders>
  );
});

explore.add("DeleteDataAlert", () => {
  const [open, setOpen] = useState(true);
  const onClose = () => {
    setOpen(false);
    setTimeout(() => setOpen(true), 2000);
  };
  const onAccept = () => null;
  const agents = [1, 2, 3, 4];

  return (
    <Components.DeleteDataAlert
      open={open}
      onClose={onClose}
      onAccept={onAccept}
      agents={agents}
    />
  );
});

explore.add("SearchBar", () => {
  const test_types = [
    {
      name: "client",
      description: "test",
      inputFields: [
        { name: "customer_id", description: "test customer_id" },
        { name: "machine_id", description: "test machine_id" },
        { name: "interval", description: "test interval" },
        { name: "version", description: "test version" },
        { name: "created_at", description: "test date" },
        { name: "updated_at", description: "test date" }
      ]
    }
  ];

  const doSomethingWithParsedTokens = tokens => {
    action("Parse success")(tokens);
  };

  return (
    <Components.SearchBar
      types={test_types}
      onParseSuccess={doSomethingWithParsedTokens}
    />
  );
});

explore.add("AgentPreview", () => {
  const test_host = {
    data: {
      getClients: [
        {
          id: "9BxrxxTWk3LJFW3B8",
          machine_id: "79372d8564c8545262975c46157f1482",
          version: "0.9",
          created_at: "2020-06-18T21:09:01.110Z",
          updated_at: "2020-06-18T21:24:03.980Z",
          network_interfaces: [
            {
              name: "lo",
              addresses: [
                {
                  ip_address: "127.0.0.1"
                }
              ]
            },
            {
              name: "tunl0",
              addresses: null
            },
            {
              name: "ip6tnl0",
              addresses: null
            },
            {
              name: "eth0",
              addresses: [
                {
                  ip_address: "192.168.0.5"
                }
              ]
            }
          ],
          system_config: {
            hostname: "232f737bf08a",
            osname: "Fedora 30"
          }
        }
      ]
    }
  };

  const options = {
    autoRefresh: false,
    pollInterval: 0
  };

  return (
    <SetupProviders>
      <Components.AgentPreview
        agent={test_host.data.getClients[0]}
        options={options}
      />
    </SetupProviders>
  );
});

const test_files = [
  {
    _id: "qcpsgLRjimKjgMsXP",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/",
    name: "/",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-20T19:13:47.952Z")
  },
  {
    _id: "geeB7DhXANxSJnMA6",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/.dockerenv",
    name: ".dockerenv",
    size: 0,
    sha1sum: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    filetype: "FILE",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.369Z")
  },
  {
    _id: "nmDEFqmr9ccZAXCB4",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/bin",
    name: "bin",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.370Z")
  },
  {
    _id: "57PLWJSgxbwyCW7kT",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/boot",
    name: "boot",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.371Z")
  },
  {
    _id: "cmio4ZHeKiLYTENTc",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/dev",
    name: "dev",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.372Z")
  },
  {
    _id: "agYCw6dnQXWznS97B",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/etc",
    name: "etc",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.373Z")
  },
  {
    _id: "5mdLwLPMsdaETE5zC",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/go",
    name: "go",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.374Z")
  },
  {
    _id: "ojH65Z86N7zQNDueG",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/home",
    name: "home",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.375Z")
  },
  {
    _id: "WeW9tWtFSLPHSiqSg",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/lib",
    name: "lib",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.375Z")
  },
  {
    _id: "68y3KGNXvPFbkcZAX",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/lib64",
    name: "lib64",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.376Z")
  },
  {
    _id: "e4gmzkvqcatKyfYwq",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/media",
    name: "media",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.377Z")
  },
  {
    _id: "ccW3rbCyKhvyHuHsB",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/mnt",
    name: "mnt",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.378Z")
  },
  {
    _id: "hkFF5XTohg9Ed3H3f",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/opt",
    name: "opt",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.379Z")
  },
  {
    _id: "XRstqryt534Y8QQjz",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/proc",
    name: "proc",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.380Z")
  },
  {
    _id: "au7raDLc3Ro9rLQFa",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/root",
    name: "root",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.380Z")
  },
  {
    _id: "WjMdyGkfQbgMjQsKf",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/run",
    name: "run",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.381Z")
  },
  {
    _id: "CPEbAsJ6QiAdxq45p",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/sbin",
    name: "sbin",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.382Z")
  },
  {
    _id: "j7f3hGHfNDYCDBD2z",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/srv",
    name: "srv",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.383Z")
  },
  {
    _id: "jsYZwdLLRTgwHaJzC",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/sys",
    name: "sys",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.384Z")
  },
  {
    _id: "rXFhQ6LyKqn6bNixq",
    client: "HN9uJAiiLwB5NW8hj",
    parent_path: "/",
    install_path: "/tmp",
    name: "tmp",
    size: 0,
    sha1sum: "",
    filetype: "DIRECTORY",
    parent: "29iicvvwXwNvjs5p2",
    updated_at: new Date("2020-07-21T01:15:22.386Z")
  }
];

explore.add("AgentFileView", () => {
  return (
    <SetupProviders>
      <Components.AgentFileView cwd="/" files={test_files} />
    </SetupProviders>
  );
});

explore.add("Treeview", () => (
  <TreeView
    defaultExpanded={["1"]}
    defaultCollapseIcon={<Components.TreeMinusSquare />}
    defaultExpandIcon={<Components.TreePlusSquare />}
    defaultEndIcon={<Components.TreeCloseSquare />}
  >
    <Components.StyledTreeItem nodeId="1" label="Main">
      <Components.StyledTreeItem nodeId="2" label="Hello" />
      <Components.StyledTreeItem nodeId="3" label="Subtree with children">
        <Components.StyledTreeItem nodeId="6" label="Hello" />
        <Components.StyledTreeItem nodeId="7" label="Sub-subtree with children">
          <Components.StyledTreeItem nodeId="9" label="Child 1" />
          <Components.StyledTreeItem nodeId="10" label="Child 2" />
          <Components.StyledTreeItem nodeId="11" label="Child 3" />
        </Components.StyledTreeItem>
        <Components.StyledTreeItem nodeId="8" label="Hello" />
      </Components.StyledTreeItem>
      <Components.StyledTreeItem nodeId="4" label="World" />
      <Components.StyledTreeItem nodeId="5" label="Something something" />
    </Components.StyledTreeItem>
  </TreeView>
));
