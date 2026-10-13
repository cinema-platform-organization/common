import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import type { Counter, Histogram } from "prom-client";
import { Observable, tap } from "rxjs";

import { RpcStatus } from "../enums";
import { isGrpcError } from "../grpc/errors";

export const GRPC_REQUESTS_TOTAL = "grpc_requests_total";
export const GRPC_REQUEST_DURATION = "grpc_request_duration_seconds";

@Injectable()
export class GrpcMetricsInterceptor implements NestInterceptor {
	public constructor(
		@InjectMetric(GRPC_REQUESTS_TOTAL)
		private readonly counter: Counter<string>,
		@InjectMetric(GRPC_REQUEST_DURATION)
		private readonly histogram: Histogram<string>,
	) {}

	public intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<unknown> {
		if (context.getType() !== "rpc") {
			return next.handle();
		}

		const method = `${context.getClass().name}.${context.getHandler().name}`;
		const endTimer = this.histogram.startTimer({ method });

		const record = (status: string) => {
			endTimer({ status });
			this.counter.inc({ method, status });
		};

		return next.handle().pipe(
			tap({
				next: () => record("OK"),
				error: (error: unknown) => record(statusName(error)),
			}),
		);
	}
}

function statusName(error: unknown): string {
	let code: number = RpcStatus.INTERNAL;

	if (error instanceof RpcException) {
		const payload = error.getError();
		if (isGrpcError(payload)) code = payload.code;
	} else if (isGrpcError(error)) {
		code = error.code;
	}

	return (RpcStatus as unknown as Record<number, string>)[code] ?? "UNKNOWN";
}
