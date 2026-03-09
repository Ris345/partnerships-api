import path from 'path';
import type { Resolvers } from '../../model/generated/graphql/types';
import fs from 'fs';
import { QueryTreeExtractor } from '../query-tree/query-tree-extractor';

export const resolvers: Resolvers = {
  Query: {
    location: (parent, args, context, info) => {
      fs.writeFileSync(
        path.join(import.meta.dirname, './tree.txt'),
        JSON.stringify(
          new QueryTreeExtractor(info).extractQueryTree(
            info.fieldNodes.find(n => n.name.value === 'location')!,
          ),
          null,
          2,
        ),
        'utf-8',
      );

      return null;
    },
  },
};

// 1. parse field nodes into expected structures - what might these structures look like?
// 2. resolve queries using functions that correspond to output types, which internally use
//    the json function whose type is of the resolver type
// 3. how to handle errors?
