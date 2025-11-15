import tsj from "npm:ts-json-schema-generator";

const schema = tsj.createGenerator({ path: "registry.ts", "skipTypeCheck": true, tsconfig: './bin/ts.json' }).createSchema("*")
console.log(schema.definitions)
const definitions = {}
const commands = []
for (const cmd of Object.keys(schema.definitions).filter(c => !c.startsWith('Command<'))) {
  definitions[cmd] = schema.definitions[cmd]
}
for (const cmd of Object.keys(schema.definitions).filter(c => c.startsWith('Command<'))) {
  const {type, payload, doc} = schema.definitions[cmd]?.properties ?? {}
  const spec = {
    type: type.const,
    payload: payload,
    doc: doc.const
  }
  console.log(spec)
  commands.push(spec)
}

Deno.writeTextFileSync("./llms.json", JSON.stringify({ definitions, commands }, null, 1))