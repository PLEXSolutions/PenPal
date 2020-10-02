import PenPal from "meteor/penpal";
import { spawnSync, spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import fetch from "node-fetch";

import template_workflow_ts_file from "./n8n/WorkflowTemplate.node.ts.js";
import template_trigger_ts_file from "./n8n/TriggerTemplate.node.ts.js";

const N8N_DIR = "/n8n";
const N8N_NODES_DIR = "/home/node/custom-n8n-nodes/";

const generateNode = async (node, is_trigger_node) => {
  const output_dir = path.join(N8N_NODES_DIR, node.name);

  const output_ts_file = path.join(
    N8N_NODES_DIR,
    node.name,
    `${node.name}.node.ts`
  );

  const output_json_file = path.join(
    N8N_NODES_DIR,
    node.name,
    `${node.name}-settings.json`
  );

  try {
    await fs.mkdir(output_dir);
  } catch (e) {}

  console.log(`[.] Generating n8n node ${node.name}`);

  try {
    const template_file = is_trigger_node
      ? template_trigger_ts_file
      : template_workflow_ts_file;
    const data = template_file.replace(/NODE_NAME_REPLACE_ME/gi, node.name);
    await fs.writeFile(output_ts_file, data);
    await fs.writeFile(output_json_file, JSON.stringify(node, null, 4));
  } catch (e) {
    console.error(e);
  }
};

const generateNodes = async () => {
  for (let key of Object.keys(PenPal.LoadedPlugins)) {
    const { settings: { n8n } = {} } = PenPal.LoadedPlugins[key];
    if (n8n === undefined) continue;

    const { workflow_nodes = [], trigger_nodes = [] } = n8n;

    for (let node of workflow_nodes) {
      await generateNode(node, false);
    }

    for (let node of trigger_nodes) {
      await generateNode(node, true);
    }
  }
};

const buildNodes = () => {
  console.log("[.] Building static n8n nodes");

  spawnSync(`n8n-node-dev build`, {
    stdio: "inherit",
    shell: true,
    cwd: N8N_NODES_DIR
  });

  console.log();
  console.log("[.] Building dynamic n8n nodes");

  spawnSync(
    `for d in ./*/; do echo; echo "Building $d"; (cd $d && n8n-node-dev build); done`,
    {
      stdio: "inherit",
      shell: true,
      cwd: N8N_NODES_DIR
    }
  );
};

const killOldServer = () => {
  console.log();
  console.log("[.] Killing old n8n server if still running");
  spawnSync(`ps -ef | grep "n8n" | awk '{print $2}' | xargs kill -9`, {
    stdio: "ignore",
    shell: true
  });
};

const startN8nServer = () => {
  console.log();
  console.log("[.] Starting N8n server");
  spawn("npm run start", {
    stdio: "inherit",
    shell: true,
    cwd: N8N_DIR
  });
};

export const executeWebhook = async (url, args = {}) => {
  console.log(`[.] Executing webhook: ${url}`);
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(args),
    headers: { "Content-Type": "application/json" }
  });
  return await result.json();
};

export default async () => {
  killOldServer();
  await generateNodes();
  buildNodes();
  startN8nServer();
};
