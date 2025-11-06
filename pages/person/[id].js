import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import family from "../../data/family.json";

export default function PersonPage() {
  const router = useRouter();
  const { id } = router.query;
  const person = family.find((p) => p.id === Number(id));

  if (!person) return <Layout>Человек не найден</Layout>;

  const related = {
    мать: getPerson(person.мать),
    отец: getPerson(person.отец),
    супруг: getPerson(person.супруг),
    сестры: [getPerson(person.сестра1), getPerson(person.сестра2)].filter(Boolean),
    братья: [getPerson(person.брат1),getPerson(person.брат3), getPerson(person.брат2)].filter(Boolean),
    дети: (person.дети || []).map((id) => getPerson(id)).filter(Boolean),
    бабушка_по_отцу: getPerson(person.бабушка_по_отцу),
    дедушка_по_отцу: getPerson(person.дедушка_по_отцу),
    бабушка_по_матери: getPerson(person.бабушка_по_матери),
    дедушка_по_матери: getPerson(person.дедушка_по_матери),
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 underline block mb-6">
          ← Назад на головну
        </Link>

        {/* Основная информация */}
        <div className="text-center mb-10">
          {person.фото && (
            <img
              src={person.фото}
              alt={person.имя}
              className="w-48 h-48 object-cover rounded-full border mx-auto mb-4 shadow-md"
            />
          )}
          <h1 className="text-3xl font-semibold">{person.имя}</h1>
          <p className="text-gray-600">
            {person.год_рождения}
            {person.год_смерти ? ` — ${person.год_смерти}` : ""}
          </p>

          <div className="mt-3">
            <Link
              href={`/person/${person.id}/full`}
              className="text-blue-600 underline"
            >
              Детальніше →
            </Link>
          </div>
        </div>

        {/* РОДИТЕЛИ И СУПРУГ */}
<RelationGroup title="Батьки та подружжя">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {related.мать ? (
      <PersonMiniCard person={related.мать} relation="Мати" />
    ) : (
      <div className="p-4 bg-gray-50 rounded-2xl shadow-sm text-center">
        <h3 className="font-semibold mb-2">Мати</h3>
        <p className="text-gray-500 italic">Не вказано</p>
      </div>
    )}

    {related.отец ? (
      <PersonMiniCard person={related.отец} relation="Батько" />
    ) : (
      <div className="p-4 bg-gray-50 rounded-2xl shadow-sm text-center">
        <h3 className="font-semibold mb-2">Батько</h3>
        <p className="text-gray-500 italic">Не вказано</p>
      </div>
    )}

    {related.супруг ? (
      <PersonMiniCard person={related.супруг} relation="Чоловік/Дружина" />
    ) : (
      <div className="p-4 bg-gray-50 rounded-2xl shadow-sm text-center">
        <h3 className="font-semibold mb-2">Подружжя</h3>
        <p className="text-gray-500 italic">Не женат / не замужем</p>
      </div>
    )}
  </div>
</RelationGroup>

        {/* БРАТЬЯ И СЁСТРЫ */}
        {(related.сестры.length > 0 || related.братья.length > 0) && (
          <RelationGroup title="Брати та сестри">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {related.братья.map((p) => (
                <PersonMiniCard key={p.id} person={p} relation="Брат" />
              ))}
              {related.сестры.map((p) => (
                <PersonMiniCard key={p.id} person={p} relation="Сестра" />
              ))}
            </div>
          </RelationGroup>
        )}

        {/* ДЕТИ */}
        {related.дети.length > 0 && (
          <RelationGroup title="Діти">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {related.дети.map((p) => (
                <PersonMiniCard key={p.id} person={p} relation="Дитина" />
              ))}
            </div>
          </RelationGroup>
        )}

        {/* БАБУШКИ И ДЕДУШКИ */}
        {(related.бабушка_по_матери ||
          related.дедушка_по_матери ||
          related.бабушка_по_отцу ||
          related.дедушка_по_отцу) && (
          <RelationGroup title="Бабусі та дідусі">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.дедушка_по_матери && (
                <PersonMiniCard
                  person={related.дедушка_по_матери}
                  relation="Дідусь (по матері)"
                />
              )}
              {related.бабушка_по_матери && (
                <PersonMiniCard
                  person={related.бабушка_по_матери}
                  relation="Бабуся (по матері)"
                />
              )}
              {related.дедушка_по_отцу && (
                <PersonMiniCard
                  person={related.дедушка_по_отцу}
                  relation="Дідусь (по батькові)"
                />
              )}
              {related.бабушка_по_отцу && (
                <PersonMiniCard
                  person={related.бабушка_по_отцу}
                  relation="Бабуся (по батькові)"
                />
              )}
            </div>
          </RelationGroup>
        )}
      </div>
    </Layout>
  );
}

/* ————————————————————————
   Общий блок для группы родственников
———————————————————————— */
function RelationGroup({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3 border-b pb-1">{title}</h2>
      {children}
    </div>
  );
}

/* ————————————————————————
   Мини-карточка родственника
———————————————————————— */
function PersonMiniCard({ person, relation }) {
  return (
    <Link
      href={`/person/${person.id}`}
      className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
    >
      {person.фото && (
        <img
          src={person.фото}
          alt={person.имя}
          className="w-24 h-24 object-cover rounded-full border mb-2"
        />
      )}
      <p className="font-medium text-center">{person.имя}</p>
      <p className="text-sm text-gray-600">
        {person.год_рождения}
        {person.год_смерти ? ` — ${person.год_смерти}` : ""}
      </p>
      {relation && <p className="text-xs text-gray-500 mt-1">{relation}</p>}
    </Link>
  );
}

/* ————————————————————————
   Вспомогательная функция
———————————————————————— */
function getPerson(id) {
  if (!id) return null;
  return family.find((p) => String(p.id) === String(id)) || null;
}
