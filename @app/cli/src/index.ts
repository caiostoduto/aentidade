#! /usr/bin/env bun
import { join } from "node:path";
import { program } from "commander"; // https://www.npmjs.com/package/programmer

import ParseAction from "./commands/parse";

// https://www.npmjs.com/package/commander#description-and-summary
program
	.name("aen")
	.description("CLI to some JavaScript string utilities")
	.version((await Bun.file(join(__dirname, "../package.json")).json()).version);

// https://www.npmjs.com/package/commander#commands
program
	.command("parse")
	.summary("parse certificates")
	.description("Create PDF certificates from a SVG template and a CSV file")

	.requiredOption("-t, --template <path>", "[required] path to SVG template")
	.requiredOption("-c, --csv <path>", "[required] path to CSV sheet")
	.requiredOption("-o, --output <path>", "[required] path to output folder")
	.requiredOption("--p12 <path>", "[required]  path to P12 file")

	.option("-p, --password <string>", "(optional) P12 password", "")

	.action(ParseAction);

program.parse(process.argv);
