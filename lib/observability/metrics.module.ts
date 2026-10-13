import { DynamicModule, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import {
	makeCounterProvider,
	makeHistogramProvider,
	PrometheusModule,
} from "@willsoto/nestjs-prometheus";

import {
	GRPC_REQUEST_DURATION,
	GRPC_REQUESTS_TOTAL,
	GrpcMetricsInterceptor,
} from "./grpc-metrics.interceptor";

@Module({})
export class MetricsModule {
	public static forRoot(service: string): DynamicModule {
		return {
			module: MetricsModule,
			global: true,
			imports: [
				PrometheusModule.register({
					path: "/metrics",
					defaultMetrics: { enabled: true },
					defaultLabels: { service },
				}),
			],
			providers: [
				makeHistogramProvider({
					name: GRPC_REQUEST_DURATION,
					help: "gRPC request latency",
					labelNames: ["method", "status"],
					buckets: [
						0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5,
					],
				}),
				makeCounterProvider({
					name: GRPC_REQUESTS_TOTAL,
					help: "Total gRPC requests",
					labelNames: ["method", "status"],
				}),
				{
					provide: APP_INTERCEPTOR,
					useClass: GrpcMetricsInterceptor,
				},
			],
			exports: [PrometheusModule],
		};
	}
}
