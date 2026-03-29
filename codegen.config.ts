import { CodegenConfig } from '@graphql-codegen/cli';
import { GQLARRConfig } from 'gqlarr';

const gqlarrConfig: GQLARRConfig = {
  types: {
    DateTime: 'string',
  },
};

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/graphql/**/*.graphql',
  generates: {
    'src/model/generated/graphql/types.ts': {
      plugins: ['gqlarr'],
    },
  },
  config: gqlarrConfig,
};

export default config;
