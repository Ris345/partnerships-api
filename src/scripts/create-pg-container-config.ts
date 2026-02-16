import fs from 'fs';
import path from 'path';

const configFilePath = path.join(
  import.meta.dirname,
  '../../pg-container.config.ts',
);

const configFileContents = `import { createPGContainerConfig } from './src/scripts/pg-container-config-utils';
 
export default createPGContainerConfig({
  dev: {
    dummyPassword: '',
  },
  test: {
    dummyPassword: '',
  },
});
`;

fs.writeFileSync(configFilePath, configFileContents, 'utf-8');
