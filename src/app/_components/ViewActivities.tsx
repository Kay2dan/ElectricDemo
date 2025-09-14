import { habitActivityCollection } from "@/collection/habitActivity";
import { and, eq, gte, lt, useLiveQuery } from "@tanstack/react-db";

export default function ViewActivities({
  habitId,
  startDate,
  endDate,
}: {
  habitId: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const { data: activities } = useLiveQuery(
    (q) =>
      q
        .from({ act: habitActivityCollection })
        .where(({ act }) => eq(act.habitId, habitId))
        .where(({ act }) =>
          and(gte(act.forDate, startDate), lt(act.forDate, endDate))
        ),
    [habitId, startDate, endDate]
  );

  console.log("activity for habitId: ", habitId, activities);

  return (
    <div className="p-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">
        Past 6 days activities for habit: {habitId}
      </h4>
      <div className="space-y-2">
        {activities?.map((activity) => (
          <div key={activity.id} className="px-1">
            <p className="text-sm text-gray-900">{activity.output}</p>
            <p className="text-sm text-gray-900">
              Completed: {activity.completedOn?.toString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
