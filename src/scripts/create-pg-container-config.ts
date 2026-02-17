import fs from 'fs';
import path from 'path';
import cryptoRandomString from 'crypto-random-string';

const configFilePath = path.join(
  import.meta.dirname,
  '../../pg-container.config.ts',
);

const dummyPasswords = {
  dev: cryptoRandomString({ length: 8, type: 'alphanumeric' }),
  test: cryptoRandomString({ length: 8, type: 'alphanumeric' }),
};

const configFileContents = `import { createPGContainerConfig } from './src/scripts/pg-container-config-utils';
 
export default createPGContainerConfig({
  dev: {
    dummyPassword: '${dummyPasswords.dev}',
  },
  test: {
    dummyPassword: '${dummyPasswords.test}',
  },
});
`;

fs.writeFileSync(configFilePath, configFileContents, 'utf-8');
