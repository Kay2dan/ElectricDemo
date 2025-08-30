"use client";

import { z } from "zod";
import { createCollection, createOptimisticAction } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { ELECTRIC_SHAPE_URL } from "./index";
import { pgDateParser } from "./pgDateParser";

export const SchemaHabitActivity = z.object({
  id: z.string(),
  forDate: z.date(),
  completedOn: z.date(),
  habitId: z.string(),
  output: z.number().nullish(),
});

function getHabitActivityKey(
  habitActivity: z.infer<typeof SchemaHabitActivity>
): string {
  return habitActivity.id;
}

export const habitActivityCollection = createCollection(
  electricCollectionOptions({
    id: "habitActivity-collection",
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_URL}`,
      params: {
        table: "HabitActivity",
        columns: ["id", "forDate", "completedOn", "output", "habitId"],
      },
      parser: pgDateParser, // Ensure all date/timestamp columns arrive as JS Date objects from Electric.
    },
    schema: SchemaHabitActivity,
    getKey: getHabitActivityKey,
  })
);
