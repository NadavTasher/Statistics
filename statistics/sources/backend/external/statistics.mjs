/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Statistics/
 **/

// Import libraries
import UDP from "dgram";

// Import utilities
import { File } from "../internal/utilities.mjs";

// Import configuration
import { Tags, Endpoints } from "./configuration.mjs";

// Setup log server
let logServer = UDP.createSocket("udp4");

// Create statistic files
const tagsFile = new File("tags");
const endpointsFile = new File("endpoints");

// Create updating function
const Update = (file, name) => {
    // Read the file
    let value = file.read({});

    // Make sure the value exists
    if (!value.hasOwnProperty(name))
        value[name] = 0;

    // Increment by one
    value[name] += 1;

    // Write new data
    file.write(value);

    // Return count
    return value[name];
};

logServer.on("message", (message) => {
    try {
        // Parse the log line
        let json = JSON.parse(message.toString());

        // Make sure the request is valid
        if (!json.hasOwnProperty("request"))
            return;

        // Parse request
        let request = json.request;

        // Make sure the URL exists
        if (!Endpoints.hasOwnProperty(request.host))
            return;

            // Make sure the URI is correct
        if (request.uri !== "/")
            return;

        // Update the statistics
        Update(endpointsFile, Endpoints[request.host]);
    } catch (e) {
    }
});

logServer.bind(9000);

// Export routes
export const Routes = {
    tag: {
        update: {
            handler: (parameters) => {
                if (!Tags.hasOwnProperty(parameters.tag))
                    throw new Error("Invalid tag");

                return Update(tagsFile, Tags[parameters.tag]);
            },
            parameters: {
                tag: "string"
            }
        },
        fetch: {
            handler: (parameters) => {
                return tagsFile.read({});
            },
            parameters: {}
        }
    },
    endpoint: {
        fetch: {
            handler: (parameters) => {
                return endpointsFile.read({});
            },
            parameters: {}
        }
    }
};