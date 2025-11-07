import family from "../data/family.json";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center mb-6">
        🌳 Виберіть людину для перегляду дерева
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {family.map((p) => (
          <Link key={p.id} href={`/tree/${p.id}`}>
            <div className="cursor-pointer transform hover:scale-105 transition">
              <img
                src={p.фото}
                className="w-32 h-32 object-cover rounded-full shadow"
              />
              <p className="text-center mt-2 font-semibold">{p.имя}</p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
