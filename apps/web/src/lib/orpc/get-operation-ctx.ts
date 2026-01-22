import type { ClientContext } from "@orpc/client";
import type { OperationType } from "@orpc/tanstack-query";

interface OperationContext {
	key: unknown[];
	type: OperationType;
}

/**
 * Extract operation context from oRPC context using Symbol
 * The context has Symbol(ORPC_OPERATION_CONTEXT) with { key, type }
 */
export function getOperationContext<C extends ClientContext>(
	context: C,
): OperationContext | undefined {
	const symbols = Object.getOwnPropertySymbols(context);

	const operationSymbol = symbols.find(
		(s) => s.description === "ORPC_OPERATION_CONTEXT",
	);
	if (operationSymbol) {
		return context[operationSymbol] as OperationContext;
	}

	return undefined;
}
