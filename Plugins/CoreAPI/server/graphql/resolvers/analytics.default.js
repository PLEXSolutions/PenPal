import PenPal from "meteor/penpal";
import _ from "lodash";

export default {
  CoreAPIAnalytics: {
    totalProjects: async () => {
      let pipeline = [];
      pipeline.push({ $count: "totalProjects" });

      const results = await PenPal.MongoCollections.CoreAPIProjects.rawCollection()
        .aggregate(pipeline)
        .toArray();

      const result = {
        title: "Total Projects",
        value: 0,
        delta: 0,
        since: new Date()
      };

      if (results.length > 0) {
        result.value = results[0].totalProjects;
      }

      return result;
    },

    totalCustomers: async () => {
      let pipeline = [];
      pipeline.push({ $count: "totalCustomers" });

      const results = await PenPal.MongoCollections.CoreAPICustomers.rawCollection()
        .aggregate(pipeline)
        .toArray();

      const result = {
        title: "Total Customers",
        value: 0,
        delta: 0,
        since: new Date()
      };

      if (results.length > 0) {
        result.value = results[0].totalCustomers;
      }

      return result;
    },

    totalHosts: async () => {
      let pipeline = [];
      pipeline.push({ $count: "totalHosts" });

      const results = await PenPal.MongoCollections.CoreAPIHosts.rawCollection()
        .aggregate(pipeline)
        .toArray();

      const result = {
        title: "Total Hosts",
        value: 0,
        delta: 0,
        since: new Date()
      };

      if (results.length > 0) {
        result.value = results[0].totalHosts;
      }

      return result;
    },

    totalServices: async () => {
      let pipeline = [];
      pipeline.push({ $count: "totalServices" });

      const results = await PenPal.MongoCollections.CoreAPIServices.rawCollection()
        .aggregate(pipeline)
        .toArray();

      const result = {
        title: "Total Services",
        value: 0,
        delta: 0,
        since: new Date()
      };

      if (results.length > 0) {
        result.value = results[0].totalServices;
      }

      return result;
    }

    /*
    customerBreakdown: async ({ id }) => {
      let pipeline = id === ANALYTICS_ID ? [] : [{ $match: { customer: id } }];
      pipeline = pipeline.concat([
        {
          $lookup: {
            from: "tectix_customers",
            localField: "customer",
            foreignField: "_id",
            as: "customer"
          }
        },
        {
          $unwind: "$customer"
        },
        {
          $group: {
            _id: "$customer._id",
            customer_name: { $first: "$customer.name" },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            customer_id: "$_id",
            customer_name: 1,
            count: 1
          }
        },
        {
          $sort: { customer_name: 1 }
        }
      ]);

      const results = await Clients.rawCollection()
        .aggregate(pipeline)
        .toArray();

      return results;
    },

    osBreakdown: async ({ id }) => {
      let pipeline = id === ANALYTICS_ID ? [] : [{ $match: { customer: id } }];
      pipeline = pipeline.concat([
        {
          $lookup: {
            from: "tectix_system_config",
            localField: "system_config",
            foreignField: "_id",
            as: "system_config"
          }
        },
        {
          $unwind: "$system_config"
        },
        {
          $group: {
            _id: "$system_config.osname",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            osname: "$_id",
            count: 1
          }
        },
        {
          $sort: { osname: 1 }
        }
      ]);

      const results = await Clients.rawCollection()
        .aggregate(pipeline)
        .toArray();

      return results;
    }*/
  }
};
