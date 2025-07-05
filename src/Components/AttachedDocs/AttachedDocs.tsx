import { useState } from "react";
import "./AttachedDocs.css";

export function AttachedDocs({ links, addLink }: {links: [string, string][], addLink: (label: string, link: string) => boolean}) {
    const [openField, setOpenField] = useState<boolean>(false);
    const [label, setLabel] = useState<string>("");
    const [link, setLink] = useState<string>("");

    return <div className="attached-docs">
        {links.map((val) => <a href={val[1]} target="_blank">{val[0]}</a>)}
        {(openField)?
            <div>
                <form className="new-doc-form" onSubmit={() => {
                    setOpenField(!addLink(label, link))}}>
                    <input placeholder="Document Name" onChange={(e) => setLabel(e.target.value)}/>
                    <input placeholder="Link" onChange={(e) => setLink(e.target.value)}/>
                    <input type="submit" value="Add Document" />
                </form>
            </div>
            : <h3 className="add-doc" onClick={() => setOpenField(true)}>+</h3>}
    </div>
}