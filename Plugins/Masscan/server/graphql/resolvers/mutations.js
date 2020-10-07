import PenPal from "meteor/penpal";
import hjson from "hjson";
import _ from "lodash";

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function parseMasscan(projectID, jsonData) {
  let res = {
    status: "Error Uploading Data",
    was_successful: false,
    affected_records: [],
  };
  let parsedJson = hjson.parse(jsonData.toString());
  const ips = _.reduce(
    parsedJson,
    (result, value) => {
      if (result[value.ip] === undefined) {
        result[value.ip] = value;
      } else {
        _.mergeWith(result[value.ip], value, customizer);
      }
      return result;
    },
    {}
  );
  let hosts = _.map(ips, ({ ip }) => {
    return { ipv4: ip };
  });
  // 1. Upsert Hosts
  let upsertHostResp = await PenPal.API.Hosts.Upsert({
    projectID: projectID,
    hosts: hosts,
  });
  let ids = [];
  console.log(upsertHostResp);
  _.each(upsertHostResp.affected_records, (record) => {
    if (typeof record._str !== "undefined") {
      ids.push(record._str);
    } else {
      ids.push(record);
    }
  });
  // 2. Get IP -> hostID mapping
  let hostRecords = await PenPal.API.Hosts.Get({
    projectID: projectID,
    hostIDs: ids,
  });
  // 3. Create proper services insertion for each host and insert...
  let servicesArray = [];
  _.each(hostRecords, (host) => {
    _.each(ips[host.ipv4].ports, (foundPort) => {
      servicesArray.push({
        hostID: host._id._str,
        port: foundPort.port,
        protocol: foundPort.proto,
      });
    });
  });
  let servicesResp = await PenPal.API.Services.Upsert({
    projectID: projectID,
    services: servicesArray,
  });
  if (servicesResp.affected_records.length > 0) {
    res = {
      status: "Services Created",
      was_successful: true,
      affected_records: servicesResp.affected_records,
    };
  }
  return res;
}

export default {
  async parseMasscanFile(root, args, context) {
    let res = {
      status: "Error Uploading Data",
      was_successful: false,
      affected_records: [],
    };
    if (args.submissionDoc.format !== "JSON") {
      res.status = "Please Submit JSON Data";
      return res;
    }
    let jsonData = Buffer.from(args.submissionDoc.base64_content, "base64");
    res = await parseMasscan(args.submissionDoc.projectID, jsonData);
    return res;
  },
  async performMasscan(root, args, context) {
    await delay(0);
    let response = {
      status: "Masscan Failed",
      was_successful: false,
    };
    let { ips, ports, rate } = args.data;
    if (!ips || !ports || !rate || !args.projectID) {
      return response;
    }
    PenPal.API.Docker.Exec(
      `masscan bash -c "masscan -oJ res.json --rate=${rate} -p${ports} ${ips} 1>&2 2>/dev/null && cat res.json"`
    ).then((res, err) => {
      if (err) {
        console.log(err);
        return response;
      }
      const buff = Buffer.from(res, "utf-8");
      parseMasscan(args.projectID, buff.toString());
    });
    response.status = "Masscan Started";
    response.was_successful = true;
    return response;
  },
};
