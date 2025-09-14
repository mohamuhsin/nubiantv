"use client";

interface Nominee {
  _id: string;
  name: string;
  voteCount?: number;
}

interface ResultsListProps {
  nominees: Nominee[];
  loading: boolean;
}

export default function ResultsList({ nominees, loading }: ResultsListProps) {
  if (loading) {
    return (
      <ul className="space-y-2" aria-busy="true" role="list">
        {[...Array(4)].map((_, i) => (
          <li
            key={i}
            role="listitem"
            className="flex justify-between px-4 py-2"
          >
            <div className="h-4 w-3/5 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-wave" />
            <div className="h-4 w-1/5 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-wave" />
          </li>
        ))}
      </ul>
    );
  }

  if (!nominees?.length) {
    return (
      <p className="text-gray-500 text-center py-3 text-sm sm:text-base">
        No nominees yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      {/* Header Row */}
      <div className="flex justify-between px-4 py-2 bg-gray-100 font-semibold text-gray-700 text-sm sm:text-base sticky top-0 z-10">
        <span className="truncate w-3/5">Nominees</span>
        <span className="w-1/5 text-right">Votes</span>
      </div>

      {/* Nominee List */}
      <ul role="list" className="divide-y divide-gray-200">
        {nominees
          .slice()
          .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
          .map((nominee, index) => (
            <li
              key={nominee._id}
              role="listitem"
              className={`flex justify-between items-center px-4 py-2 transition-colors duration-200 rounded-sm ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <span
                title={nominee.name}
                className="truncate font-medium text-gray-800 w-3/5"
              >
                {nominee.name}
              </span>
              <span
                aria-label={`${nominee.voteCount || 0} votes`}
                className="font-semibold text-gray-700 w-1/5 text-right"
              >
                {nominee.voteCount || 0}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
