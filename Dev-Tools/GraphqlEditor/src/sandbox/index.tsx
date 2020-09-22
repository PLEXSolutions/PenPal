import React, { useState } from "react";
import { render } from "react-dom";
import { style } from "typestyle";
import { Editor, GraphController } from "../src/index";
import * as schemas from "./schema";

export const Full = style({
    backgroundColor: "#444444",
    position: "relative",
    width: "100%",
    height: "100%",
    paddingLeft: 0,
    transition: "padding-left 0.12s linear"
});

export const UiDiagram = style({
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "stretch",
    display: "flex",
    position: "relative"
});
export const UIDiagramFull = style({
    marginLeft: "-100vh"
});
export const Actions = style({
    width: 100,
    height: "100%"
});

export const App = () => {
    const [graph, setGraph] = useState<GraphController>();
    const [hide, setHide] = useState(false);
    return (
        <div className={UiDiagram}>
            {!hide && (
                <Editor
                    onGraphChange={setGraph}
                    initialSizeOfSidebar={"25vw"}
                    schema={{
                        code: schemas.redball_schema,
                        libraries: ""
                    }}
                />
            )}
        </div>
    );
};

render(<App />, document.getElementById("root"));
