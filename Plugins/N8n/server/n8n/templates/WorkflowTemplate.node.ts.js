export default `import {
	OptionsWithUri
} from 'request';

import {
    IHookFunctions,
    IWebhookFunctions,
    IExecuteFunctions,
    IExecuteSingleFunctions,
    ILoadOptionsFunctions,
} from "n8n-core";

import {
    INodeExecutionData,
    INodeParameters,
    INodeType,
    INodeTypeDescription,
    INodeProperties,
    NodeParameterValue
} from "n8n-workflow";

import {
  node,
  executeHandler,
  executeHandlerType
} from "./NODE_NAME_REPLACE_ME-settings.json";

async function penpalGraphqlRequest(
    this:
        IHookFunctions |
        IExecuteFunctions |
        IExecuteSingleFunctions |
        ILoadOptionsFunctions,
    graphql_query: string,
    variables: any = {},
    uri?: string
): Promise<any> {
    // TODO: Add credentials? Maybe running this on loopback is sufficient
    //const credentials = this.getCredentials('penpalApiCredentials');

    let body = {
        query: graphql_query,
        variables
    };

    const options: OptionsWithUri = {
        method: 'POST',
        headers: {
            'Accept': 'applications/json',
        },
        uri: uri || 'http://localhost:3000/graphql',
        json: true,
        body
    };

    let responseData = await this.helpers.request!(options);
    return responseData;
}

export class NODE_NAME_REPLACE_ME implements INodeType {
    description: INodeTypeDescription = {
        displayName: node.displayName,
        name: node.name,
        icon: node.icon,            // file:lambda.png   OR   fa:font-awesome-name
        group: ["transform", "penpal"],
        version: 1,
        description: node.description,
        defaults: {
            name: node.displayName,
            color: "#3471eb"
        },
        inputs: ["main"],
        outputs: ["main"],
        properties: <INodeProperties[]>node.properties
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        let returnData: INodeExecutionData[];
        const items = this.getInputData();

        // Fill in the function later
        console.log(\`Executing \${node.displayName} node\`);

        const executeHandlerEndpoint: string = \`\${executeHandlerType} \${executeHandler}\${executeHandlerType} ($data: JSON!) {
            \${executeHandler}(data: $data) {
                id
            }
        }\`;

        let result = {};
        try {
            result = await penpalGraphqlRequest.call(this, executeHandlerEndpoint, { data: items });
        } catch (e) {
            // Some error occured
            throw e;
        }

        items.push({ json: result });
        returnData = items;
        return this.prepareOutputData(returnData);
    }
}`;
