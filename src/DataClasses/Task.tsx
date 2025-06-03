export interface TaskObject { name: string; id?: string }

export class Task {
    public name: string;
    public id: string;

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }

    static fromMap(allData: { name: string; id?: string; projectId?: string }): Task {
        let task: Task = new Task(
            allData.name,
            allData.id || "0",
        );
        return task;
    }
}