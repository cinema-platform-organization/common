import { Inject } from "@nestjs/common";

import { GRPC_CLIENT_PREFIX } from "../constants/grpc.constants";

export function InjectGrpcClient(name: string) {
	return Inject(`${GRPC_CLIENT_PREFIX}_${name}`);
}
