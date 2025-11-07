// components/AutoFamilyTree.js
import family from "../data/family.json";
import PersonCard from "./PersonCard";
import { useRouter } from "next/router";

/* найти человека по id */
const getPerson = (id) => family.find((p) => Number(p.id) === Number(id));

/* родители */
const getParents = (p) => {
  const res = [];
  if (!p) return res;
  if (p.мать) res.push(getPerson(p.мать));
  if (p.отец) res.push(getPerson(p.отец));
  return res.filter(Boolean);
};

/* дети */
const getChildren = (p) => {
  if (!p) return [];
  return family.filter((x) => Number(x.мать) === Number(p.id) || Number(x.отец) === Number(p.id));
};

/* братья/сестры */
const getSiblings = (p) => {
  if (!p) return [];
  const parents = getParents(p);
  if (!parents.length) return [];

  let siblings = [];
  parents.forEach((par) => {
    siblings.push(...getChildren(par));
  });

  // убрать самого человека и дубли
  const uniq = Array.from(new Set(siblings.map((s) => Number(s.id))))
    .filter((id) => id !== Number(p.id))
    .map((id) => getPerson(id));

  return uniq;
};

/* многоуровневые предки (ancestors[0] = родители, ancestors[1] = бабушки/дедушки и т.д.) */
function buildAncestors(person) {
  const result = [];
  const first = getParents(person);
  if (!first.length) return result;

  result[0] = first;

  let current = first;
  let idx = 1;

  while (current.length > 0) {
    const next = current
      .map((p) => getParents(p))
      .flat()
      .filter(Boolean);

    // удалить дубли в next
    const uniqIds = Array.from(new Set(next.map((n) => Number(n.id))));
    const uniq = uniqIds.map((id) => getPerson(id));

    if (uniq.length === 0) break;

    result[idx] = uniq;
    current = uniq;
    idx++;
  }

  return result;
}

export default function AutoFamilyTree({ rootId }) {
  const root = getPerson(rootId);
  if (!root) return <p>Не знайдено</p>;

  const children = getChildren(root);        // дети (верхний уровень)
  const siblings = getSiblings(root);        // братья/сёстры (рядом с root)
  const ancestors = buildAncestors(root);    // массив поколений: [parents, grandparents, greatGrandparents, ...]

  // удобные переменные
  const parents = ancestors[0] || getParents(root);
  const grandparents = ancestors[1] || [];
  const greatGrandparents = ancestors[2] || [];

  return (
    <div className="flex flex-col items-center mt-10 space-y-16">

      {/* ДЕТИ (если есть) */}
      {children.length > 0 && (
        <>
          <TreeLevel
            title="Діти"
            people={children}
            highlightId={root.id}
            rootId={root.id}
          />
          <Connector />
        </>
      )}

      {/* БРАТЬЯ / СЕСТРЫ + ГЛАВНЫЙ (в центре) */}
      <TreeLevel
        title="Брати та Сестри"
        people={[...siblings, root]}
        highlightId={root.id}
        rootId={root.id}
        horizontal
      />

      <Connector />

      {/* РОДИТЕЛИ */}
      {parents.length > 0 && (
        <>
          <TreeLevel
            title="Батьки"
            people={parents}
            highlightId={root.id}
            rootId={root.id}
          />
          <Connector />
        </>
      )}

      {/* БАБУШКИ / ДЕДУШКИ */}
      {grandparents.length > 0 && (
        <>
          <TreeLevel
            title="Бабусі і дідусі"
            people={grandparents}
            highlightId={root.id}
            rootId={root.id}
          />
          <Connector />
        </>
      )}

      {/* ПРАБАБУШКИ / ПРАДІДУШКИ */}
      {greatGrandparents.length > 0 && (
        <TreeLevel
          title="Прабабусі і прадідусі"
          people={greatGrandparents}
          highlightId={root.id}
          rootId={root.id}
        />
      )}

    </div>
  );
}

/* Компонент одного уровня */
function TreeLevel({ title, people = [], highlightId, rootId, horizontal }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div
        className={`flex ${horizontal ? "flex-row" : "flex-wrap"} justify-center gap-6 p-4 bg-white shadow rounded-xl`}
      >
        {people.map((p) => (
          <div
            key={p.id}
            className={`
              cursor-pointer transition transform
              ${p.id === highlightId
                ? "scale-110 shadow-xl ring-4 ring-blue-500 rounded-2xl bg-blue-50 p-2"
                : "hover:scale-105"
              }
            `}
            onClick={() => {
              // если это главный — открыть биографию
              if (p.id === highlightId) router.push(`/person/${p.id}/full`);
              else router.push(`/tree/${p.id}`);
            }}
          >
            <PersonCard person={p} />

            {p.id === highlightId && (
              <p className="text-center text-blue-600 font-semibold mt-1">
                ⭐ Головний персонаж
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Линия между уровнями */
function Connector() {
  return <div className="w-1 h-20 bg-gray-400"></div>;
}
