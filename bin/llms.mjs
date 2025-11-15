import tsj from "npm:ts-json-schema-generator";

const schema = tsj.createGenerator({
  path: "llms.ts",
  "skipTypeCheck": true,
  tsconfig: "./bin/ts.json",
}).createSchema("*");
const definitions = {};
const commands = [];

function collectDefinitions(obj) {
  if (!obj || typeof obj !== "object") {
    return;
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      collectDefinitions(item);
    }
    return;
  }

  if (obj.$ref) {
    const defName = obj.$ref.replace("#/definitions/", "");
    if (schema.definitions[defName] && !definitions[defName]) {
      const definition = schema.definitions[defName];
      // Add definition before recursing to handle circular dependencies
      definitions[defName] = definition;
      collectDefinitions(definition);
    }
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      collectDefinitions(obj[key]);
    }
  }
}

for (
  const cmd of Object.keys(schema.definitions).filter((c) =>
    c.startsWith("Command<")
  )
) {
  const { type, payload, comment } = schema.definitions[cmd]?.properties ?? {};
  collectDefinitions(payload);
  const spec = {
    type: type.const,
    payload: payload,
    doc: comment.const,
  };
  commands.push(spec);
}

Deno.writeTextFileSync(
  "./llms.json",
  JSON.stringify({ definitions, commands }, null, 1),
);
