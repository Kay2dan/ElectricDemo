"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const ViewHabits = dynamic(() => import("./_components/ViewHabits"), {
  ssr: false,
});

export default function Home() {
  const [view, setView] = useState("habit");

  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);

  return (
    <div className="font-sans w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex w-full h-full">
        <section className="nav w-1/6 h-full bg-gray-50 shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Dates App</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  onClick={() => setView("habit")}
                  className={`block p-3 rounded-lg transition-colors ${
                    view === "habit"
                      ? "bg-blue-500 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Habit
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setView("etc")}
                  className={`block p-3 rounded-lg transition-colors ${
                    view === "etc"
                      ? "bg-blue-500 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Etc
                </a>
              </li>
            </ul>
          </div>
        </section>

        <div className="flex-1">
          <section className="habits flex-1 bg-white shadow-lg m-4 rounded-lg overflow-hidden">
            {view === "habit" && (
              <ViewHabits
                activeHabitId={activeHabitId}
                onSelectHabit={setActiveHabitId}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
