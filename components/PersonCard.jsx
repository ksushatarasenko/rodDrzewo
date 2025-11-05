import Link from "next/link";

export default function PersonCard({ person }) {
  return (
    <Link
      href={`/person/${person.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg p-4 transition text-center"
    >
      {person.фото && (
        <img
          src={person.фото}
          alt={person.имя}
          className="w-24 h-24 object-cover rounded-full mx-auto mb-2 border"
        />
      )}
      <h3 className="font-semibold">{person.имя}</h3>
      <h3 className="font-semibold">{person.девечья_фамилия}</h3>
      <p className="text-gray-600 text-sm">
        {person.год_рождения}
        {person.год_смерти ? ` — ${person.год_смерти}` : ""}
      </p>
    </Link>
  );
}
