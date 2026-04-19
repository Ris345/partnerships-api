import { CodegenConfig } from '@graphql-codegen/cli';
import { GQLARRConfig } from 'gqlarr';

const gqlarrConfig: GQLARRConfig = {
  imports: {},
  types: {
    DateTime: 'Date',
  },
};

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/graphql/**/*.graphql',
  generates: {
    'src/model/graphql/generated-types.ts': {
      plugins: ['gqlarr'],
    },
  },
  config: gqlarrConfig,
};

export default config;
