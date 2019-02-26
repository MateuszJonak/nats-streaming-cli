#!/usr/bin/env node

var program = require("commander");
var NATSStreamingClient = require("./NATSStreamingClient");

program
  .version("0.1.0")
  .command("pub <clusterId> <subject> <message>")
  .option("-c, --clientId", "Client Id")
  .option("-s, --server", "Server")
  .action(async (clusterId, subject, message, options) => {
    const natsStreamingClient = new NATSStreamingClient();
    const clientId = options.clientId || "cli-client";
    const server = options.server || "nats://localhost:4222";

    try {
      await natsStreamingClient.connect(clusterId, clientId, server);
      const guid = await natsStreamingClient.client.publish(subject, message);
      console.log("published message with guid: " + guid);
    } catch (error) {
      console.log(error);
    }
  });

program.on("command:*", function() {
  console.error(
    "Invalid command: %s\nSee --help for a list of available commands.",
    program.args.join(" ")
  );
  process.exit(1);
});

program.parse(process.argv);
