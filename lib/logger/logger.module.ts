import { DynamicModule, Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

@Module({})
export class ServiceLoggerModule {
	public static forRoot(service: string): DynamicModule {
		const isProduction = process.env.NODE_ENV === "production";

		return {
			module: ServiceLoggerModule,
			imports: [
				LoggerModule.forRoot({
					pinoHttp: {
						level:
							process.env.LOG_LEVEL ??
							(isProduction ? "info" : "debug"),
						base: { service },
						autoLogging: { ignore: req => req.url === "/metrics" },
						redact: [
							"req.headers.authorization",
							"req.headers.cookie",
						],
						transport: isProduction
							? undefined
							: {
									target: "pino-pretty",
									options: { singleLine: true },
								},
					},
				}),
			],
			exports: [LoggerModule],
		};
	}
}
