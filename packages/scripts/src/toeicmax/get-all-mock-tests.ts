//  with-script scripts/toeicmax/get-all-mock-tests.ts

import { getAllMockTests } from "@trektoeic/crawler/toeic-max";

const main = async () => {
	await getAllMockTests();
};

main();
