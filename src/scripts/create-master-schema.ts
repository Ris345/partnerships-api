import fs from 'fs';
import path from 'path';

const schemasDir = path.join(import.meta.dirname, '../graphql/schema');
const masterSchemaFilepath = path.join(schemasDir, 'schema.graphql');
const schemaFiles = fs
  .readdirSync(path.join(import.meta.dirname, '../graphql/schema'))
  .filter(
    filename => filename.endsWith('.graphql') && filename !== 'schema.graphql',
  );

fs.writeFileSync(masterSchemaFilepath, '', 'utf8');

for (const file of schemaFiles) {
  const schemaPart = fs.readFileSync(path.join(schemasDir, file), 'utf8');
  fs.appendFileSync(masterSchemaFilepath, schemaPart);
}
