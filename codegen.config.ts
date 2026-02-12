import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/graphql/**/*.graphql',
  generates: {
    'src/model/generated/graphql/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default config;
