import { RpcException } from "@nestjs/microservices";

import { RpcStatus } from "../../enums";

export interface GrpcError {
	code: RpcStatus;
	details?: string;
	message?: string;
}

export function isGrpcError(error: unknown): error is GrpcError {
	return (
		typeof error === "object" &&
		error !== null &&
		typeof (error as GrpcError).code === "number"
	);
}

export function toRpcException(
	error: unknown,
	fallbackMessage = "Internal error",
): RpcException {
	if (isGrpcError(error)) {
		return new RpcException({
			code: error.code,
			details: error.details ?? error.message ?? fallbackMessage,
		});
	}

	return new RpcException({
		code: RpcStatus.INTERNAL,
		details: fallbackMessage,
	});
}
