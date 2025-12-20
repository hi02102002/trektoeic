import { createStorage } from "unstorage";
import indexedDbDriver from "unstorage/drivers/indexedb";

export const storage = createStorage({
	driver: indexedDbDriver({ base: "app:" }),
});
