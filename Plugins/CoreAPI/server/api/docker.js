import { exec } from "child_process";
import PenPal from "meteor/penpal";

const runCommand = async (args) => {
  return new Promise((resolutionFunc, rejectionFunc) => {
    try {
      exec(`${args}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          rejectionFunc("YEET");
        }
        resolutionFunc(`${stdout}`);
      });
    } catch (e) {
      console.log(e);
      rejectionFunc("YEET");
    }
  });
};
export const dockerExec = async (args) => {
  await PenPal.API.AsyncNOOP();
  let res = await runCommand(`sudo docker run --rm ${args}`);
  return res;
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
