import { useState } from "react";
import type { TaskClass } from "../../DataClasses/TaskClass";
import "./SearchBox.css";
import Link from "next/link";

type categories = "All" | "Title" | "Description" | "Progress" | "Due Date";

export function SearchBox({ tasks }: { tasks: TaskClass[] }) {
  const [results, setResults] = useState<
    [string, string, string, string, TaskClass][]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<categories>("All");
  const [search, setSearch] = useState<string>("");

  function breakText(search: string, query: string): [string, string, string] {
    const lowerSearch = search.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const leftIndex = lowerSearch.indexOf(lowerQuery);
    const rightIndex = leftIndex + lowerQuery.length - 1;
    let leftSpace = false,
      rightSpace = false;
    let left = leftIndex,
      right = rightIndex;

    while (left > 0 && (lowerSearch.charAt(left) != " " || !leftSpace)) {
      if (lowerSearch.charAt(left) == " ") leftSpace = true;
      left--;
    }
    while (
      right < lowerSearch.length &&
      (lowerSearch.charAt(right) != " " || !rightSpace)
    ) {
      if (lowerSearch.charAt(right) == " ") rightSpace = true;
      right++;
    }

    return [
      search.substring(left, leftIndex),
      search.substring(leftIndex, rightIndex + 1),
      search.substring(rightIndex + 1, right),
    ];
  }

  function searchTasks(
    taskList: TaskClass[],
    search: string,
    searchCategory: categories
  ): [string, string, string, string, TaskClass][] {
    let matches: [string, string, string, string, TaskClass][] = [];
    const query: string = search.trim().toLowerCase();
    let currentLevel = taskList;

    setPage(1);

    if (query.length == 0) return [];

    while (currentLevel.length > 0) {
      let nextLevel: TaskClass[] = [];
      for (let i = 0; i < currentLevel.length; i++) {
        const currentTask = currentLevel[i];
        if (
          (searchCategory == "All" || searchCategory == "Title") &&
          currentTask.title.toLowerCase().includes(query)
        ) {
          matches = [
            ...matches,
            ["Title", ...breakText(currentTask.title, query), currentTask],
          ];
        } else if (
          (searchCategory == "All" || searchCategory == "Description") &&
          currentTask.description.toLowerCase().includes(query)
        ) {
          matches = [
            ...matches,
            [
              "Description",
              ...breakText(currentTask.description, query),
              currentTask,
            ],
          ];
        } else if (
          (searchCategory == "All" || searchCategory == "Progress") &&
          currentTask.progress.toLowerCase().includes(query)
        ) {
          matches = [
            ...matches,
            [
              "Progress",
              ...breakText(currentTask.progress, query),
              currentTask,
            ],
          ];
        } else if (
          (searchCategory == "All" || searchCategory == "Due Date") &&
          currentTask.dueDate?.toLowerCase().includes(query)
        ) {
          matches = [
            ...matches,
            ["Due Date", ...breakText(currentTask.dueDate, query), currentTask],
          ];
        }

        nextLevel = [...nextLevel, ...currentTask.tasks];
      }

      currentLevel = nextLevel;
    }

    return matches;
  }

  function backPage() {
    if (page == 1) return;
    setPage((prev) => prev - 1);
  }

  function forwardPage() {
    if (page == Math.ceil(results.length / 3)) return;
    setPage((prev) => prev + 1);
  }

  return (
    <div className="search-box">
      <div>
        <select
          className="search-select"
          onChange={(e) => {
            setCategory(e.target.value as categories);
            setResults(
              searchTasks(tasks, search, e.target.value as categories)
            );
          }}
        >
          <option>All</option>
          <option>Title</option>
          <option>Description</option>
          <option>Progress</option>
          <option>Due Date</option>
        </select>
        <input
          placeholder="Search"
          className="search-field"
          onChange={(e) => {
            setSearch(e.target.value);
            setResults(searchTasks(tasks, e.target.value, category));
          }}
        />
      </div>
      {results
        .slice(
          (page - 1) * 3,
          Math.ceil(results.length / 3) == page ? undefined : page * 3
        )
        .map((e) => (
          <Link href={`/app/project/task/${e[4].id}`} key={e[4].id}>
            <div className="search-result">
              <h2 style={{ fontWeight: 400 }}>
                {e[0] == "Title" ? (
                  <>
                    {e[1]}
                    <b>{e[2]}</b>
                    {e[3]}
                  </>
                ) : (
                  e[4].title
                )}
              </h2>
              {e[0] != "Title" ? (
                <h3 style={{ fontWeight: 400 }}>
                  {e[0]}: {e[1]}
                  <b>{e[2]}</b>
                  {e[3]}
                </h3>
              ) : null}
            </div>
          </Link>
        ))}

      {results.length <= 3 ? null : (
        <div className="change-page-menu">
          <button onClick={backPage}>-</button>
          <h3>
            {" "}
            {page}/{Math.ceil(results.length / 3)}{" "}
          </h3>
          <button onClick={forwardPage}>+</button>
        </div>
      )}
    </div>
  );
}
