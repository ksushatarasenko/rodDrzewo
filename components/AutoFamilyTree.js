// components/AutoFamilyTree.js
import family from "../data/family.json";
import PersonCard from "./PersonCard";
import ColoredConnector from "./ColoredConnector";
import { useRouter } from "next/router";
import CoupleBlock from "./CoupleBlock";

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
    return family.filter(
        (x) => Number(x.мать) === Number(p.id) || Number(x.отец) === Number(p.id)
    );
};

/* супруги */
const getSpouse = (p) => {
    if (!p) return null;

    if (p.муж && p.муж !== "" && p.муж !== "0") {
        return getPerson(p.муж);
    }

    if (p.жена && p.жена !== "" && p.жена !== "0") {
        return getPerson(p.жена);
    }

    return null;
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

/* многоуровневые предки для заданного лица
   (anc[0] = родители, anc[1] = бабушки/дедушки и т.д.) */
function buildAncestorsFor(person) {
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
    // rootId может приходить как строка; стандартизируем
    const root = getPerson(Number(rootId));
    if (!root) return <p>Не знайдено</p>;

    const children = getChildren(root); // дети (верх)
    const siblings = getSiblings(root); // братья/сёстры
    const father = root.отец ? getPerson(root.отец) : null;
    const mother = root.мать ? getPerson(root.мать) : null;

    // отдельные предки по папиной и маминой линии
    const paternalAnc = father ? buildAncestorsFor(father) : [];
    const maternalAnc = mother ? buildAncestorsFor(mother) : [];

    // удобные переменные
    const parents = [father, mother].filter(Boolean);
    // уровень бабушек/дедушек: берем 0-й уровень от каждой линии
    const paternalGrand = paternalAnc[0] || [];
    const maternalGrand = maternalAnc[0] || [];
    const paternalGreat = paternalAnc[1] || [];
    const maternalGreat = maternalAnc[1] || [];
    const spouse = getSpouse(root);

    let spouseLabel = "";
    if (root.муж) spouseLabel = "Муж";
    if (root.жена) spouseLabel = "Жена";


    const isRootMale = root.пол === "м";
    const husband =
        root.пол === "м"
            ? root
            : spouse?.пол === "м"
                ? spouse
                : null;

    const wife =
        root.пол === "ж"
            ? root
            : spouse?.пол === "ж"
                ? spouse
                : null;




    return (
        <div className="flex flex-col items-center mt-10 space-y-12 w-full">

            {/* Навигакуия сверху — делай в pages/tree/[id].js (у тебя уже) */}

            {/* Дети (если есть) */}
            {children.length > 0 && (
                <>
                    <TreeLevel
                        title="Діти"
                        people={children}
                        highlightId={Number(root.id)}
                        rootId={Number(root.id)}
                    />
                    <Connector />
                </>
            )}

            {/* Братья/сестры + главный */}
            <TreeLevel
                title="Сім'я"
                people={[root, spouse].filter(Boolean)}
                highlightId={root.id}
                spouse={spouse}
            />

            <TreeLevel
                title="Брати та Сестри"
                people={siblings}
                highlightId={root.id}
            />

            <Connector />

            {/* РОДИТЕЛИ - показываем отдельно отец/мать с цветными вертикальными линиями */}
            <div className="w-full flex justify-center gap-20 items-start">
                {/* Отец (слева) */}
                <div className="flex flex-col items-center">
                    {father && <ColoredConnector color="#2563eb" height={40} width={6} />}
                    {father && (
                        <TreeLevel
                            title="Батько"
                            people={[father]}
                            highlightId={Number(root.id)}
                            rootId={Number(root.id)}
                        />
                    )}
                </div>

                {/* Центр — пустое пространство, можно тут показывать муш/связи */}
                <div className="w-24" />

                {/* Мать (справа) */}
                <div className="flex flex-col items-center">
                    {mother && <ColoredConnector color="#ef4444" height={40} width={6} />}
                    {mother && (
                        <TreeLevel
                            title="Мати"
                            people={[mother]}
                            highlightId={Number(root.id)}
                            rootId={Number(root.id)}
                        />
                    )}
                </div>
            </div>

            <Connector />

            {/* БАБУШКИ / ДЕДУШКИ - рисуем две колонки: отцовские слева (синие), материнские справа (красные) */}
            <div className="w-full flex justify-center gap-12">
                <div className="flex-1 flex flex-col items-center">
                    {paternalGrand.length > 0 && (
                        <>
                            <TreeLevel
                                title="Бабусі та Дідусі (батьківська лінія)"
                                people={paternalGrand}
                                highlightId={Number(root.id)}
                                rootId={Number(root.id)}
                            />
                            <div className="mt-2">
                                <ColoredConnector color="#2563eb" height={30} width={4} />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex-1 flex flex-col items-center">
                    {maternalGrand.length > 0 && (
                        <>
                            <TreeLevel
                                title="Бабусі та Дідусі (материнська лінія)"
                                people={maternalGrand}
                                highlightId={Number(root.id)}
                                rootId={Number(root.id)}
                            />
                            <div className="mt-2">
                                <ColoredConnector color="#ef4444" height={30} width={4} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Connector />

            {/* ПРАБАБУШКИ / ПРАДІДУШКИ - две колонки */}
            <div className="w-full flex justify-center gap-12">
                <div className="flex-1 flex flex-col items-center">
                    {paternalGreat.length > 0 && (
                        <TreeLevel
                            title="Прабабусі/Прадідусі (батьківська)"
                            people={paternalGreat}
                            highlightId={Number(root.id)}
                            rootId={Number(root.id)}
                        />
                    )}
                </div>

                <div className="flex-1 flex flex-col items-center">
                    {maternalGreat.length > 0 && (
                        <TreeLevel
                            title="Прабабусі/Прадідусі (материнська)"
                            people={maternalGreat}
                            highlightId={Number(root.id)}
                            rootId={Number(root.id)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/* Компонент одного уровня */
function TreeLevel({ title, people = [], highlightId, spouse }) {
    const router = useRouter();

    // Если в наборе есть пара — показываем красиво
    if (spouse) {
        const root = people.find((p) => Number(p.id) === Number(highlightId));
        const partner = spouse;

        if (root && partner) {
            const isRootMale = root.пол === "м";
            const husband = isRootMale ? root : partner;
            const wife = isRootMale ? partner : root;

            return (
                <div className="flex flex-col items-center w-full">
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                    <CoupleBlock husband={husband} wife={wife} highlightId={highlightId} />
                </div>
            );
        }
    }

    // Обычный вывод списка
    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            <div className="flex flex-wrap justify-center gap-6 p-4 bg-white shadow rounded-xl">
                {people.map((p) => (
                    <div
                        key={p.id}
                        className={`
              cursor-pointer transition transform
              ${Number(p.id) === Number(highlightId)
                                ? "scale-110 shadow-xl ring-4 ring-blue-500 rounded-2xl bg-blue-50 p-2"
                                : "hover:scale-105"
                            }
            `}
                        onClick={() => router.push(`/tree/${p.id}`)}
                    >
                        <PersonCard person={p} />

                        {Number(p.id) === Number(highlightId) && (
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
    return <div className="w-1 h-16 bg-gray-300 rounded" />;
}
