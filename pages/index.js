import family from "../data/family.json";
import Layout from "../components/Layout";
import PersonCard from "../components/PersonCard";

export default function Home() {
  // Группы ID для разных рядов
  const row1 = [11,1,2,9,12]; // дети
  const row2 = [10,3,4,13,14]; // родители
  const row3 = [5,6,7,8]; // бабушки и дедушки
  const row4 = []; // например, прабабушки и прадедушки

  const getPeople = (ids) => family.filter((p) => ids.includes(p.id));

  // Можно задать стили для каждого ряда
  const rowStyles = [
    "bg-blue-50 p-4 rounded-xl shadow-sm",   // ряд 1 — дети
    "bg-green-50 p-4 rounded-xl shadow-sm",  // ряд 2 — родители
    "bg-yellow-50 p-4 rounded-xl shadow-sm", // ряд 3 — бабушки/дедушки
    "bg-gray-50 p-4 rounded-xl shadow-sm",   // ряд 4 — прабабушки/прадедушки
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center mb-6">🌳 Семейное древо</h1>

      <div className="space-y-10">
        {[row1, row2, row3, row4].map((row, i) => (
          <section
            key={i}
            className={`${rowStyles[i]} text-center`}
          >
            <h2 className="text-lg font-semibold mb-4">
              {i === 0 && "Дети"}
              {i === 1 && "Родители"}
              {i === 2 && "Бабушки и Дедушки"}
              {i === 3 && "Прабабушки и Прадедушки"}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {getPeople(row).map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}

