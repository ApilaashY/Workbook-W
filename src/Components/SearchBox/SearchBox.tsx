import { useState } from "react";
import type { TaskClass } from "../../DataClasses/TaskClass";
import "./SearchBox.css";
import { Link } from "react-router-dom";

export function SearchBox({ tasks }: { tasks: TaskClass[] }) {
    const [results, setResults] = useState<[string, string, string, string, TaskClass][]>([]);
    const [page, setPage] = useState<number>(1);

    function breakText(search: string, query: string): [string, string, string] {
        let lowerSearch = search.toLowerCase();
        let lowerQuery = query.toLowerCase();
        let leftIndex = lowerSearch.indexOf(lowerQuery);
        let rightIndex = leftIndex + lowerQuery.length - 1;
        let leftSpace = false, rightSpace = false;
        let left = leftIndex, right = rightIndex;

        while (left > 0 && (lowerSearch.charAt(left) != ' ' || !leftSpace)) {
            if (lowerSearch.charAt(left) == ' ') leftSpace = true;
            left--;
        }
        while (right < lowerSearch.length && (lowerSearch.charAt(right) != ' ' || !rightSpace)) {
            if (lowerSearch.charAt(right) == ' ') rightSpace = true;
            right++;
        }

        return [search.substring(left, leftIndex), search.substring(leftIndex, rightIndex + 1), search.substring(rightIndex + 1, right)];
    }

    function searchTasks(taskList: TaskClass[], search: string): [string, string, string, string, TaskClass][] {
        let matches: [string, string, string, string, TaskClass][] = [];
        let query: string = search.trim().toLowerCase();
        let currentLevel = taskList;

        setPage(1)

        if (query.length == 0) return [];

        while (currentLevel.length > 0) {
            let nextLevel: TaskClass[] = [];
            for (let i = 0; i < currentLevel.length; i++) {
                let currentTask = currentLevel[i];
                if (currentTask.title.toLowerCase().includes(query)) {
                    matches = [...matches, ["Title", ...breakText(currentTask.title, query), currentTask]];
                }
                else if (currentTask.description.toLowerCase().includes(query)) {
                    matches = [...matches, ["Description", ...breakText(currentTask.description, query), currentTask]];
                }
                else if (currentTask.progress.toLowerCase().includes(query)) {
                    matches = [...matches, ["Progress", ...breakText(currentTask.progress, query), currentTask]];
                }
                else if (currentTask.dueDate?.toLowerCase().includes(query)) {
                    matches = [...matches, ["Due Date", ...breakText(currentTask.dueDate, query), currentTask]];
                }

                nextLevel = [...nextLevel, ...currentTask.tasks]
            }

            currentLevel = nextLevel;
        }

        return matches;
    }

    function backPage() {
        if (page == 1) return;
        setPage(prev => prev - 1);
    }

    function forwardPage() {
        if (page == Math.ceil(results.length / 3)) return;
        setPage(prev => prev + 1);
    }

    return <div className="search-box">
        <input placeholder="Search" className="search-field" onChange={(e) => setResults(searchTasks(tasks, e.target.value))} />
        {results.slice((page - 1) * 3, (Math.ceil(results.length / 3) == page) ? undefined : page * 3)
            .map(e => <Link to={`/project/task/${e[4].id}`} key={e[4].id}>
                <div className="search-result"  >
                    <h2 style={{ fontWeight: 400 }}>{e[4].title}</h2>
                    <h3 style={{ fontWeight: 400 }}>{e[0]}: {e[1]}<b>{e[2]}</b>{e[3]}</h3>
                </div>
            </Link>)
        }

        {(results.length <= 3) ? null :
            <div className="change-page-menu">
                <button onClick={backPage}>-</button>
                <h3> {page}/{Math.ceil(results.length / 3)} </h3>
                <button onClick={forwardPage}>+</button>
            </div>}
    </div >
}