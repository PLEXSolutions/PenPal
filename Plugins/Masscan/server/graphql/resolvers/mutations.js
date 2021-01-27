import PenPal from "meteor/penpal";
import hjson from "hjson";
import _ from "lodash";

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const parseMasscan = async (project_id, jsonData) => {
  console.log("[.] Parsing masscan results");

  let res = {
    status: "Error Uploading Data",
    was_success: false,
    affected_records: []
  };

  let parsedJson = hjson.parse(jsonData.toString());

  console.log("[.] Masscan results:", JSON.stringify(parsedJson, null, 4));

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
    return { ip_address: ip };
  });

  if (hosts.length === 0) {
    return { inserted: [], updated: [], rejected: [] };
  }

  // 1. Upsert Hosts
  let { inserted, updated, rejected } = await PenPal.API.Hosts.UpsertMany(
    project_id,
    hosts
  );

  console.log(`Inserted: ${JSON.stringify(inserted)}`);
  console.log(`Updated: ${JSON.stringify(updated)}`);
  console.log(`Rejected: ${JSON.stringify(rejected)}`);

  // 2. Get IP -> hostID mapping
  //let hostRecords = await PenPal.API.Hosts.Get({
  //  project_id: project_id,
  //  hostIDs: ids
  //});

  // 3. Create proper services insertion for each host and insert...
  //let servicesArray = [];
  //_.each(hostRecords, (host) => {
  //  _.each(ips[host.ipv4].ports, (foundPort) => {
  //    servicesArray.push({
  //      hostID: host._id._str,
  //      port: foundPort.port,
  //      protocol: foundPort.proto
  //    });
  //  });
  //});

  //let servicesResp = await PenPal.API.Services.Upsert({
  //  project_id: project_id,
  //  services: servicesArray
  //});

  //if (servicesResp.affected_records.length > 0) {
  //  res = {
  //    status: "Services Created",
  //    was_success: true,
  //    affected_records: servicesResp.affected_records
  //  };
  //}

  return { inserted, updated, rejected };
};

export default {
  async parseMasscanFile(root, args, context) {
    let res = {
      status: "Error Uploading Data",
      was_success: false,
      affected_records: []
    };
    if (args.submissionDoc.format !== "JSON") {
      res.status = "Please Submit JSON Data";
      return res;
    }
    let jsonData = Buffer.from(args.submissionDoc.base64_content, "base64");
    res = await parseMasscan(args.submissionDoc.project_id, jsonData);
    return res;
  },

  async performMasscan(root, { data: args }, context) {
    console.log(`[.] Starting masscan for ${args.ips}`);

    let ports = "";
    if (args.tcp_ports?.length > 0) {
      ports += args.tcp_ports;
    }
    if (args.udp_ports?.length > 0) {
      const udp_ports = args.udp_ports
        .split(",")
        .map((port) => `U:${port}`)
        .join(",");
      ports += `${ports.length > 0 && ","}${udp_ports}`;
    }

    const command = `masscan bash -c "masscan -oJ res.json --rate=${
      args.scanRate
    } -p${ports}${args.ping && " --ping"} ${
      args.ips
    } 1>&2 2>/dev/null && cat res.json"`;

    await PenPal.Utils.AsyncNOOP();
    let response = {
      status: "Masscan Failed",
      was_success: false
    };
    PenPal.Docker.Exec(command).then((res, err) => {
      if (err) {
        console.log(err);
        return response;
      }
      const buff = Buffer.from(res, "utf-8");
      parseMasscan(args.project_id, buff.toString());
    });
    response.status = "Masscan Started";
    response.was_success = true;
    return response;
  }
};
