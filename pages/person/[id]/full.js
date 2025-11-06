import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import family from "../../../data/family.json";

export default function FullPersonPage() {
  const router = useRouter();
  const { id } = router.query;
  const person = family.find((p) => p.id === Number(id));

  if (!person) return <Layout>Человек не найден</Layout>;

  // Форматирование даты
  const formatDate = (dateStr, yearFallback) => {
    if (!dateStr) return yearFallback || "";
    const date = new Date(dateStr);
    return isNaN(date) ? yearFallback || "" : date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const birthDate = formatDate(person.дата_рождения, person.год_рождения);
  const deathDate = formatDate(person.дата_смерти, person.год_смерти);

  // Биография
  const bioParagraphs = [
    person.биография1,
    person.биография2,
    person.биография3,
    person.биография4,
    person.биография5,
  ].filter((p) => p && p.trim() !== "");

  // Дополнительные фото
  const photos = [
    person.фото1,
    person.фото2,
    person.фото3,
    person.фото4,
    person.фото5,
  ].filter((p) => p && p.trim() !== "");

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/person/${person.id}`}
          className="text-blue-600 underline block mb-6"
        >
          ← Назад
        </Link>

        {/* Основная информация */}
        <div className="flex flex-col items-center text-center mb-8">
          {person.фото && (
            <img
              src={person.фото}
              alt={person.имя}
              className="w-48 h-48 object-cover rounded-full border mb-4 shadow-md"
            />
          )}
          <h1 className="text-3xl font-semibold">{person.имя}</h1>
          {person.девечья_фамилия && (
            <p className="text-gray-500 text-lg">дівоче призвище:  {person.девечья_фамилия}</p>
          )}
          <p className="text-gray-600 mt-1">
            {birthDate}
            {deathDate ? ` — ${deathDate}` : ""}
          </p>
          {person.место_жительства && (
            <p className="text-gray-700 mt-2 italic">🏠мешка: {person.место_жительства}</p>
          )}
        </div>

        {/* Биография */}
        {bioParagraphs.length > 0 && (
          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-3">Біографія</h2>
            {bioParagraphs.map((p, i) => (
              <p key={i} className="mb-4 text-lg leading-relaxed">{p}</p>
            ))}
          </div>
        )}

        {/* Дополнительные фото */}
        {photos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Фото</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${person.имя} фото ${i + 1}`}
                  className="w-full h-48 object-cover rounded-xl border shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* Контакты */}
        {(person.facebook || person.viber || person.whatsapp) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Контакти</h2>
            <ul className="space-y-2 text-lg">
              {person.facebook && (
                <li>
                  📘{" "}
                  <a
                    href={person.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Facebook
                  </a>
                </li>
              )}
              {person.viber && <li>📱 Viber: {person.viber}</li>}
              {person.whatsapp && <li>💬 WhatsApp: {person.whatsapp}</li>}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
