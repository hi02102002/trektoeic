// with-script scripts/toeicmax/get-all-listenings.ts

import { getAllListeningsWithDetail } from "@trektoeic/crawler/toeic-max";

const main = async () => {
	await getAllListeningsWithDetail();
};

main();
