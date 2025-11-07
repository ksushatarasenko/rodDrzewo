import { useRouter } from "next/router";
import AutoFamilyTree from "../../components/AutoFamilyTree";
import Layout from "../../components/Layout";

export default function TreePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  return (
    <Layout>
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow"
      >
        ← Назад
      </button>
     <span className="px-6 mb-6"></span>
      <button
        onClick={() => router.push("/")}
        className="mb-6 px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow"
      >
        ← 🏠 Home
      </button>

      <AutoFamilyTree rootId={id} />
    </Layout>
  );
}
