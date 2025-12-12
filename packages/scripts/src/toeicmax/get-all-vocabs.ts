// with-script scripts/toeicmax/get-all-vocabs.ts

import { getAllVocabs } from "@trektoeic/crawler/toeic-max";

const main = async () => {
	await getAllVocabs();
};

main();
