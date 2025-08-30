'use client';

import { z } from 'zod';
import { createCollection } from '@tanstack/react-db';
import { electricCollectionOptions } from '@tanstack/electric-db-collection';
import { ELECTRIC_SHAPE_URL, UPDATE_PROFILE_URL } from './index';
import { pgDateParser } from './pgDateParser';

export interface GetUserCollectionProps extends Record<string, string> {
  identifier: string;
}

export const SchemaUser = z.object({
  id: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  teamBanUntil: z.coerce.date().nullish(),
  subscriptionTier: z.enum(['FREE', 'PREMIUM']),
});

function getUserKey(user: z.infer<typeof SchemaUser>): string {
  return user.id;
}

export const userCollection = createCollection(
  electricCollectionOptions({
    id: 'user-collection',
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_URL}`,
      params: {
        // identifier,
        table: 'user',
        columns: ['id', 'firstName', 'lastName', 'teamBanUntil', 'subscriptionTier'],
      },
      // Parse Postgres date/timestamp columns into JS Date objects
      parser: pgDateParser,
    },
    schema: SchemaUser,
    getKey: getUserKey,
    onUpdate: async ({ transaction }) => {
      console.log('transaction: ', transaction);
      const { original, modified } = transaction.mutations[0];
      console.log('--->  ', original, modified);
      const resp = await fetch(`${UPDATE_PROFILE_URL}`, {
        method: 'PUT',
        body: JSON.stringify(modified),
      }).then(resp => resp.json());
      console.log('resp: ', resp);
      return { txid: resp.txid };
    },
  })
);
