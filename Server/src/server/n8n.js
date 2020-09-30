import PenPal from "meteor/penpal";
import { spawnSync, spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import template_ts_file from "./n8n/WorkflowTemplate.node.ts.js";

const N8N_DIR = "/n8n";
const N8N_NODES_DIR = "/home/node/custom-n8n-nodes/";

const generateNodes = async () => {
  for (let key of Object.keys(PenPal.LoadedPlugins)) {
    const { settings: { n8n } = {} } = PenPal.LoadedPlugins[key];
    if (n8n === undefined) continue;

    const output_ts_file = path.join(
      N8N_NODES_DIR,
      n8n.name,
      `${n8n.name}.node.ts`
    );

    const output_json_file = path.join(
      N8N_NODES_DIR,
      n8n.name,
      "settings.json"
    );

    try {
      await fs.mkdir(output_dir);
    } catch (e) {}

    console.log(`[.] Generating n8n node ${n8n.name}`);

    try {
      const data = template_ts_file.replace("NODE_NAME_REPLACE_ME", n8n.name);
      await fs.writeFile(output_ts_file, data);
      await fs.writeFile(output_json_file, JSON.stringify(n8n, null, 4));
    } catch (e) {
      console.error(e);
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
  console.log("[.] Starting N8n server");
  console.log();
  spawn("npm run start", {
    stdio: "inherit",
    shell: true,
    cwd: N8N_DIR
  });
};

export default async () => {
  killOldServer();
  await generateNodes();
  buildNodes();
  startN8nServer();
};
