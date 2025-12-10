import { env } from "@trektoiec/env";
import { Unosend } from "@unosend/node";

export const unosend = new Unosend(env.UNOSEND_API_KEY);
