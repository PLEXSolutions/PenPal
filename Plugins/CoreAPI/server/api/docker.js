import { execSync } from "child_process";
import PenPal from "meteor/penpal";

const runCommand = async (args) => {
  try {
    let stdout = execSync(`${args}`);
    return stdout.toString().trim();
  } catch {
    return false;
  }
};
export const dockerExec = async (args) => {
  await PenPal.API.AsyncNOOP();
  return runCommand(`sudo docker run --rm ${args}`);
};
export const dockerBuild = async (args) => {
  await PenPal.API.AsyncNOOP();
  const res = runCommand(
    `sudo echo """${args.dockerfile}""" > Dockerfile-${args.name} && sudo docker build -t ${args.name} -f Dockerfile-${args.name} . && sudo rm -f Dockerfile-${args.name}`
  );
  if (res) {
    console.log(`[.] Built image ${args.name}`);
  }
  return res;
};
