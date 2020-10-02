export default `import { IExecuteFunctions } from "n8n-core";
import {
    INodeExecutionData,
    INodeParameters,
    INodeType,
    INodeTypeDescription,
    INodeProperties,
    NodeParameterValue
} from "n8n-workflow";

import { displayName, name, icon, description, properties } from "./NODE_NAME_REPLACE_ME-settings.json";

export class NODE_NAME_REPLACE_ME implements INodeType {
    description: INodeTypeDescription = {
        displayName: displayName,
        name: name,
        icon: icon,            // file:lambda.png   OR   fa:font-awesome-name
        group: ["transform", "penpal"],
        version: 1,
        description: description,
        defaults: {
            name: displayName,
            color: "#3471eb"
        },
        inputs: ["main"],
        outputs: ["main"],
        properties: <INodeProperties[]>properties
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        let returnData: INodeExecutionData[];
        const items = this.getInputData();

        // Fill in the function later
        console.log(\`Executing \${displayName} node\`);

        returnData = items;
        return this.prepareOutputData(returnData);
    }
}`;
