"use client";

import { habitCollection } from "@/collection/habit";
import { and, eq, gte, lt, useLiveQuery } from "@tanstack/react-db";
import ViewActivities from "./ViewActivities";
import { getDefaultEndDate, getDefaultStartDate } from "../utils/getDates";

export default function ViewHabits({
  activeHabitId,
  onSelectHabit,
}: {
  activeHabitId: string | null;
  onSelectHabit: (id: string) => void;
}) {
  const { data: habits } = useLiveQuery((q) =>
    q.from({ act: habitCollection })
  );

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Habits</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits?.map((habit) => (
            <div
              key={habit.id}
              className={`p-4 bg-white rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105 ${
                habit.id === activeHabitId ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => onSelectHabit(habit.id)}
            >
              <p className="text-lg font-medium text-gray-900">
                {habit.content}
              </p>
              <p className="text-sm text-gray-500 mt-2">ID: {habit.id}</p>
            </div>
          ))}
        </div>
        {activeHabitId ? (
          <ViewActivities
            habitId={activeHabitId}
            endDate={getDefaultEndDate()}
            startDate={getDefaultStartDate()}
          />
        ) : null}
      </div>
    </div>
  );
}
