import { useState } from "react";
import type { TaskClass } from "../../DataClasses/TaskClass";
import "./SearchBox.css";

type categories = "All" | "Title" | "Description" | "Progress" | "Due Date";

export function SearchBox({
  tasks,
  setResults,
}: {
  tasks: TaskClass[];
  results: [string, string, string, string, TaskClass][];
  setResults: React.Dispatch<
    React.SetStateAction<[string, string, string, string, TaskClass][]>
  >;
}) {
  const [category, setCategory] = useState<categories>("All");
  const [search, setSearch] = useState<string>("");
  const [searchArchived, setSearchArchived] = useState<boolean>(false);

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
    searchCategory: categories,
    searchArchived: boolean
  ): [string, string, string, string, TaskClass][] {
    let matches: [string, string, string, string, TaskClass][] = [];
    const query: string = search.trim().toLowerCase();
    let currentLevel = taskList;

    if (query.length == 0) return [];

    while (currentLevel.length > 0) {
      let nextLevel: TaskClass[] = [];
      for (let i = 0; i < currentLevel.length; i++) {
        if (currentLevel[i].archived == true && !searchArchived) continue;

        const currentTask = currentLevel[i];
        const categories = ["Title", "Description", "Progress", "Due Date"];
        for (const category of categories) {
          const propertyKey = category.toLowerCase() as keyof TaskClass;
          const propertyValue = currentTask[propertyKey];

          if (
            (searchCategory == "All" || searchCategory == category) &&
            typeof propertyValue === "string" &&
            propertyValue.toLowerCase().includes(query)
          ) {
            matches = [
              ...matches,
              [category, ...breakText(propertyValue, query), currentTask],
            ];
            break;
          }
        }

        nextLevel = [...nextLevel, ...currentTask.tasks];
      }

      currentLevel = nextLevel;
    }

    console.log(matches.map((m) => m[4].title));

    return matches;
  }

  return (
    <div className="search-box">
      <div>
        <button
          className="search-archive-button"
          style={searchArchived ? { color: "green", borderColor: "green" } : {}}
          onClick={() => {
            setResults(searchTasks(tasks, search, category, !searchArchived));
            setSearchArchived((prev) => !prev);
          }}
        >
          Archived
        </button>
        <select
          className="search-select"
          onChange={(e) => {
            setCategory(e.target.value as categories);
            setResults(
              searchTasks(
                tasks,
                search,
                e.target.value as categories,
                searchArchived
              )
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
          autoFocus
          onChange={(e) => {
            setSearch(e.target.value);
            setResults(
              searchTasks(tasks, e.target.value, category, searchArchived)
            );
          }}
        />
      </div>
    </div>
  );
}
