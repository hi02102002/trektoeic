// with-script packages/scripts/src/toiecmax/get-all-courses.ts

import { getAllCourses } from "@trektoeic/crawler/toeic-max";

const main = async () => {
	await getAllCourses();
};

main();
