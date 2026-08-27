import { h } from "preact";
import { WindowConfig } from "../types";
import { InspectorView } from "./views/InspectorView";
import { LogsView } from "./views/LogsView";
import ExampleApp from "./Example";

export const config: WindowConfig = {
    id: "custom-window",
    title: "Custom d",
    type: "sidebar",
    // component: h(ExampleApp, null),
    draggable: true,
    width: "600px",
    height: "450px",
    views: [
        {
            id: "inspector",
            label: "Inspector",
            icon: "ph:magnifying-glass-bold",
            component: h(InspectorView, null),
        },
        {
            id: "logs",
            label: "Logs",
            icon: "ph:list-bullets-bold",
            component: h(LogsView, null),
        },
    ],
};
