import fs from "fs";
import { getNoteTextData } from "./utils.js";

const NOTE_FILE = "notes.java";
const OUTPUT_JSON_FILE = "notes.json";

const fileFetch = async (filePath = "") => {
	return await fs.promises.readFile(filePath, { encoding: "utf-8" });
};

const writeFile = async (filename, data, encoding = "utf-8") => {
	return await fs.promises.writeFile(filename, data, encoding);
};

const notes = (await fileFetch(NOTE_FILE)) || "";
const noteData = getNoteTextData(notes);
try {
	// TODO: Add extractor fn to clean data
	const json = JSON.stringify(noteData, null, 4);
	const result = await writeFile(OUTPUT_JSON_FILE, json);
	console.log("Success!?", result);
} catch (err) {
	console.error("This went south real fast - Error Saving ", err);
}
