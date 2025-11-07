import PersonCard from "./PersonCard";
import { useRouter } from "next/router";

export default function CoupleBlock({ husband, wife, highlightId }) {
  const router = useRouter();

  const go = (id) => router.push(`/tree/${id}`);

  return (
    <div className="flex flex-col items-center">

      <div className="flex items-center gap-4">

        {/* Муж */}
        {husband && (
          <div
            onClick={() => go(husband.id)}
            className={`
              cursor-pointer p-2 rounded-2xl transition transform
              ${Number(husband.id) === Number(highlightId)
                ? "ring-4 ring-blue-500 scale-110 bg-blue-50"
                : "ring-2 ring-blue-300 hover:scale-105 bg-blue-100"
              }
            `}
          >
            <PersonCard person={husband} />
            <p className="text-center text-blue-700 font-semibold mt-1">
              👨 Чоловік
            </p>

            {Number(husband.id) === Number(highlightId) && (
              <p className="text-center text-blue-600 font-bold mt-1">
                ⭐ Головний персонаж
              </p>
            )}
          </div>
        )}

        {/* Соединительная линия */}
        <div className="w-12 h-1 bg-gray-400 rounded"></div>

        {/* Жена */}
        {wife && (
          <div
            onClick={() => go(wife.id)}
            className={`
              cursor-pointer p-2 rounded-2xl transition transform
              ${Number(wife.id) === Number(highlightId)
                ? "ring-4 ring-pink-500 scale-110 bg-pink-50"
                : "ring-2 ring-pink-300 hover:scale-105 bg-pink-100"
              }
            `}
          >
            <PersonCard person={wife} />
            <p className="text-center text-pink-700 font-semibold mt-1">
              👩 Дружина
            </p>

            {Number(wife.id) === Number(highlightId) && (
              <p className="text-center text-pink-600 font-bold mt-1">
                ⭐ Головний персонаж
              </p>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
