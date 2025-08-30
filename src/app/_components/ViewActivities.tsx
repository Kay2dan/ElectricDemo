import { habitActivityCollection } from "@/collection/habitActivity";
import { and, eq, gte, lt, useLiveQuery } from "@tanstack/react-db";

function getDefaultStartDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getDefaultEndDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(23, 59, 59, 999);
  return d;
}

export default function ViewActivities({
  habitId,
  startDate,
  endDate,
}: {
  habitId: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const start = startDate || getDefaultStartDate();
  const end = endDate || getDefaultEndDate();

  const { data: activities } = useLiveQuery((q) =>
    q
      .from({ act: habitActivityCollection })
      .where(({ act }) => eq(act.habitId, habitId))
      .where(({ act }) => and(gte(act.forDate, start), lt(act.forDate, end)))
  );

  console.log("activity for habitId: ", habitId, activities);

  return (
    <div className="p-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">
        Activities for Habit {habitId}
      </h4>
      <div className="space-y-2">
        {activities?.map((activity) => (
          <div key={activity.id} className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-900">{activity.output}</p>
            <p className="text-base text-black mt-1">
              Completed: {activity.completedOn?.toString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
