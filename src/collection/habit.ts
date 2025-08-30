"use client";

import { z } from "zod";
import { createCollection, createOptimisticAction } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { ELECTRIC_SHAPE_URL } from "./index";
import { pgDateParser } from "./pgDateParser";

export const SchemaHabit = z.object({
  id: z.string(),
  order: z.number(),
  content: z.string(),
  ownerId: z.string(),
  goalBoardId: z.string(),
  createdAt: z.coerce.date(),
  goalId: z.string().nullish(),
  habitParentId: z.string().nullish(),
});

function getHabitKey(habit: z.infer<typeof SchemaHabit>): string {
  return habit.id;
}

export const habitCollection = createCollection(
  electricCollectionOptions({
    id: "habit-collection",
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_URL}`,
      params: {
        table: "Habit",
        columns: [
          "id",
          "order",
          "goalId",
          "ownerId",
          "content",
          "createdAt",
          "goalBoardId",
          "habitParentId",
        ],
      },
      // Parse Postgres date/timestamp columns into JS Date objects
      parser: pgDateParser,
    },
    schema: SchemaHabit,
    getKey: getHabitKey,
  })
);
