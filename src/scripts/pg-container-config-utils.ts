export interface CreatePGContainerConfigOptions {
  dev: {
    containerName?: string;
    volumeName?: string;
    port?: number;
    dummyPassword: string;
  };
  test: { containerName?: string; port?: number; dummyPassword: string };
}

export type PGContainerConfig = {
  dev: Required<CreatePGContainerConfigOptions['dev']>;
  test: Required<CreatePGContainerConfigOptions['test']>;
};

export function createPGContainerConfig(
  options: CreatePGContainerConfigOptions,
): PGContainerConfig {
  return {
    dev: {
      containerName: 'partnerships-api-postgres--dev',
      volumeName: 'partnerships-api-postgres--dev-volume',
      port: 8888,
      ...options.dev,
    },
    test: {
      containerName: 'partnerships-api-postgres--test',
      port: 8889,
      ...options.test,
    },
  };
}
