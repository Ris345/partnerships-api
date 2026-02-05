import * as fs from "fs";
import * as path from "path";

createMigration();

function createMigration() {
  const migrationId = createMigrationId();
  const migrationName = process.argv[2].trim();
  if (!migrationName) {
    throw new Error(
      "Please provide a migration name. Example usage: npm run create-migration -- my-first-migration",
    );
  }

  const filename = `${migrationId}_${migrationName}.sql`;
  const migrationsDirectoryPath = path.join(__dirname, "../db/migrations");
  const filepath = path.join(migrationsDirectoryPath, filename);
  fs.writeFileSync(filepath, "");
}

function createMigrationId() {
  const now = new Date();
  const year = convertNumberToPaddedString(now.getFullYear(), 4);
  // getMonth returns a zero-based month, so add 1 to avoid confusion
  const month = convertNumberToPaddedString(now.getMonth() + 1, 2);
  const date = convertNumberToPaddedString(now.getDate(), 2);
  const hours = convertNumberToPaddedString(now.getHours(), 2);
  const minutes = convertNumberToPaddedString(now.getMinutes(), 2);
  const seconds = convertNumberToPaddedString(now.getSeconds(), 2);
  const milliseconds = convertNumberToPaddedString(now.getMilliseconds(), 3);
  return `${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}`;
}

function convertNumberToPaddedString(num: number, maxLength: number) {
  return num.toString().padStart(maxLength, "0");
}
