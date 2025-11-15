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
    const defName = decodeURIComponent(obj.$ref.replace("#/definitions/", ""));
    obj.$ref = decodeURIComponent(obj.$ref);
    if (schema.definitions[defName] && !definitions[defName]) {
      const definition = schema.definitions[defName];
      // Add definition before recursing to handle circular dependencies
      definitions[defName] = definition;
      Object.assign(obj, definition);
      delete obj.$ref;
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
    doc: comment.const,
    payload: payload,
  };
  commands.push(spec);
}

Deno.writeTextFileSync(
  "./llms.json",
  JSON.stringify({ commands }, null, 1),
);
