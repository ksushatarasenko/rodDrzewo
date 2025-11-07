import Link from "next/link";

export default function PersonCard({ person }) {
  return (
    <div className="w-40 text-center">
      <img
        src={person.фото}
        className="w-32 h-32 object-cover rounded-full mx-auto shadow"
      />

      <p className="mt-2 font-semibold">{person.имя}</p>

      <Link href={`/person/${person.id}/full`}>
        <button className="mt-3 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm">
          Біографія
        </button>
      </Link>
    </div>
  );
}
