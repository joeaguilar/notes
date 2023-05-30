export const NOTE_FORMAT_REGEX =
	/\/\*\n\*\-{24}\n\*\s\/{23}\n\*\s{2}(.*)[\s\S]\*\s\/{23}\n\*\-{24}\n\*\/\n/gi;

export const TAG_REGEX = /##(\w*)##/gi;
export const TODO_REGEX = /(TODO:.*)/gi;
export const DATE_ZERO = "01/01/1991";

const parseDateFormat = (unformatted) =>
	unformatted.split(" ").reverse().join(" ");

const isValidNoteDate = (suspectDate) => {
	return new Date(parseDateFormat(suspectDate)) > new Date(DATE_ZERO);
};

const formatDateAfterSplit = (acc, val, index) => {
	if (isValidNoteDate(val)) {
		acc[index + 1] = { text: acc[index + 1], date: val };
	} else {
		acc[index] = val;
	}
	return acc;
};

const unwrapTagTemplate = (tag) => tag.split("##").filter((a) => a)[0];

const unwrapTodoTemplate = (todo) => {
	return todo;
};

const countOccurrencesWithReduce = (acc, tag) => {
	const weFoundIt = acc.find((t) => t?.name === tag);
	if (weFoundIt) {
		weFoundIt.count++;
	} else {
		acc.push({ name: tag, count: 1 });
	}
	return acc;
};

const identifyAllKeysFactory =
	(regex, handleUnwrap, shouldCount) =>
	(noteObject = {}) => {
		const { text } = noteObject || {};
		const results = text?.match(regex)?.map(handleUnwrap);

		return shouldCount
			? results?.reduce(countOccurrencesWithReduce, []) || []
			: results;
	};

const getAllTags = (noteObject = {}) => {
	const tagFinder = identifyAllKeysFactory(
		TAG_REGEX,
		unwrapTagTemplate,
		true
	);
	const tags = tagFinder(noteObject);
	noteObject.tags = tags;

	return noteObject;
};

const getAllTodos = (noteObject = {}) => {
	const todoFinder = identifyAllKeysFactory(TODO_REGEX, unwrapTodoTemplate);
	const todos = todoFinder(noteObject);
	noteObject.todos = todos;
	return noteObject;
};

const getNoteTextData = (noteText) =>
	Object.entries(
		noteText
			.trim()
			.split(NOTE_FORMAT_REGEX)
			.filter((a) => a)
			.reduceRight(formatDateAfterSplit, {}) || {}
	)
		.map((arr) => arr[1])
		.map(getAllTags)
		.map(getAllTodos);

export { parseDateFormat, isValidNoteDate, getNoteTextData };
