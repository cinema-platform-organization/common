import { PROTO_PATHS } from "@cinema-platform/contracts";

export const GRPC_CLIENTS = {
	AUTH_PACKAGE: {
		package: "auth.v1",
		protoPath: PROTO_PATHS.AUTH,
		env: "AUTH_GRPC_URL",
	},
	ACCOUNT_PACKAGE: {
		package: "account.v1",
		protoPath: PROTO_PATHS.ACCOUNT,
		env: "AUTH_GRPC_URL",
	},
	USERS_PACKAGE: {
		package: "users.v1",
		protoPath: PROTO_PATHS.USERS,
		env: "USERS_GRPC_URL",
	},
	MEDIA_PACKAGE: {
		package: "media.v1",
		protoPath: PROTO_PATHS.MEDIA,
		env: "MEDIA_GRPC_URL",
	},
	MOVIE_PACKAGE: {
		package: "movie.v1",
		protoPath: PROTO_PATHS.MOVIE,
		env: "MOVIE_GRPC_URL",
	},
	CATEGORY_PACKAGE: {
		package: "category.v1",
		protoPath: PROTO_PATHS.CATEGORY,
		env: "MOVIE_GRPC_URL",
	},
	THEATER_PACKAGE: {
		package: "theater.v1",
		protoPath: PROTO_PATHS.THEATER,
		env: "MOVIE_GRPC_URL",
	},
} as const;
