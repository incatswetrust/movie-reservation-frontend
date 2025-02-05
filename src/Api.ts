/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BookingCreateDto {
	/** @format int32 */
	userId?: number;
	/** @format int32 */
	showtimeId?: number;
	seatIds?: number[] | null;
}

export interface CinemaCreateDto {
	name?: string | null;
	address?: string | null;
}

export interface CinemaUpdateDto {
	name?: string | null;
	address?: string | null;
}

export interface HallCreateDto {
	name?: string | null;
	/** @format int32 */
	cinemaId?: number;
	/** @format int32 */
	numberOfRows?: number;
	/** @format int32 */
	seatsPerRow?: number;
}

export interface HallUpdateDto {
	name?: string | null;
	/** @format int32 */
	cinemaId?: number;
}

export interface MovieCreateDto {
	title?: string | null;
	description?: string | null;
	genre?: string | null;
	/** @format int32 */
	duration?: number;
	/** @format int32 */
	releaseYear?: number;
}

export interface MovieUpdateDto {
	title?: string | null;
	description?: string | null;
	genre?: string | null;
	/** @format int32 */
	duration?: number;
	/** @format int32 */
	releaseYear?: number;
}

export interface ShowtimeCreateDto {
	/** @format int32 */
	hallId?: number;
	/** @format int32 */
	movieId?: number;
	/** @format date-time */
	startTime?: string;
	/** @format double */
	price?: number;
}

export interface ShowtimeUpdateDto {
	/** @format date-time */
	startTime?: string;
	/** @format double */
	price?: number;
}

export interface UserLoginDto {
	username?: string | null;
	password?: string | null;
}

export interface UserRegisterDto {
	username?: string | null;
	password?: string | null;
	role?: UserRole;
}

/** @format int32 */
export enum UserRole {
	Value0 = 0,
	Value1 = 1
}

import type {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	HeadersDefaults,
	ResponseType
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
	extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean;
	/** request path */
	path: string;
	/** content type of request body */
	type?: ContentType;
	/** query params */
	query?: QueryParamsType;
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseType;
	/** request body */
	body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
	extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
	securityWorker?: (
		securityData: SecurityDataType | null
	) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
	secure?: boolean;
	format?: ResponseType;
}

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
	public instance: AxiosInstance;
	private securityData: SecurityDataType | null = null;
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
	private secure?: boolean;
	private format?: ResponseType;

	constructor({
		securityWorker,
		secure,
		format,
		...axiosConfig
	}: ApiConfig<SecurityDataType> = {}) {
		this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
		this.secure = secure;
		this.format = format;
		this.securityWorker = securityWorker;
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data;
	};

	protected mergeRequestParams(
		params1: AxiosRequestConfig,
		params2?: AxiosRequestConfig
	): AxiosRequestConfig {
		const method = params1.method || (params2 && params2.method);

		return {
			...this.instance.defaults,
			...params1,
			...(params2 || {}),
			headers: {
				...((method &&
					this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
					{}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {})
			}
		};
	}

	protected stringifyFormItem(formItem: unknown) {
		if (typeof formItem === 'object' && formItem !== null) {
			return JSON.stringify(formItem);
		} else {
			return `${formItem}`;
		}
	}

	protected createFormData(input: Record<string, unknown>): FormData {
		if (input instanceof FormData) {
			return input;
		}
		return Object.keys(input || {}).reduce((formData, key) => {
			const property = input[key];
			const propertyContent: any[] = property instanceof Array ? property : [property];

			for (const formItem of propertyContent) {
				const isFileType = formItem instanceof Blob || formItem instanceof File;
				formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
			}

			return formData;
		}, new FormData());
	}

	public request = async <T = any, _E = any>({
		secure,
		path,
		type,
		query,
		format,
		body,
		...params
	}: FullRequestParams): Promise<AxiosResponse<T>> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{};
		const requestParams = this.mergeRequestParams(params, secureParams);
		const responseFormat = format || this.format || undefined;

		if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
			body = this.createFormData(body as Record<string, unknown>);
		}

		if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
			body = JSON.stringify(body);
		}

		return this.instance.request({
			...requestParams,
			headers: {
				...(requestParams.headers || {}),
				...(type ? { 'Content-Type': type } : {})
			},
			params: query,
			responseType: responseFormat,
			data: body,
			url: path
		});
	};
}

/**
 * @title Movie Reservation API
 * @version v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
	auth = {
		/**
		 * No description
		 *
		 * @tags Auth
		 * @name AuthRegisterCreate
		 * @request POST:/api/Auth/register
		 */
		authRegisterCreate: (data: UserRegisterDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Auth/register`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Auth
		 * @name AuthLoginCreate
		 * @request POST:/api/Auth/login
		 */
		authLoginCreate: (data: UserLoginDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Auth/login`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Auth
		 * @name AuthLogoutCreate
		 * @request POST:/api/Auth/logout
		 */
		authLogoutCreate: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Auth/logout`,
				method: 'POST',
				...params
			})
	};
	bookings = {
		/**
		 * No description
		 *
		 * @tags Bookings
		 * @name BookingsList
		 * @request GET:/api/Bookings
		 */
		bookingsList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Bookings`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Bookings
		 * @name BookingsCreate
		 * @request POST:/api/Bookings
		 */
		bookingsCreate: (data: BookingCreateDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Bookings`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Bookings
		 * @name BookingsMyList
		 * @request GET:/api/Bookings/my
		 */
		bookingsMyList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Bookings/my`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Bookings
		 * @name BookingsCancelCreate
		 * @request POST:/api/Bookings/{id}/cancel
		 */
		bookingsCancelCreate: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Bookings/${id}/cancel`,
				method: 'POST',
				...params
			})
	};
	cinemas = {
		/**
		 * No description
		 *
		 * @tags Cinemas
		 * @name CinemasList
		 * @request GET:/api/Cinemas
		 */
		cinemasList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Cinemas`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Cinemas
		 * @name CinemasCreate
		 * @request POST:/api/Cinemas
		 */
		cinemasCreate: (data: CinemaCreateDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Cinemas`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Cinemas
		 * @name CinemasDetail
		 * @request GET:/api/Cinemas/{id}
		 */
		cinemasDetail: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Cinemas/${id}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Cinemas
		 * @name CinemasUpdate
		 * @request PUT:/api/Cinemas/{id}
		 */
		cinemasUpdate: (id: number, data: CinemaUpdateDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Cinemas/${id}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Cinemas
		 * @name CinemasDelete
		 * @request DELETE:/api/Cinemas/{id}
		 */
		cinemasDelete: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Cinemas/${id}`,
				method: 'DELETE',
				...params
			})
	};
	halls = {
		/**
		 * No description
		 *
		 * @tags Halls
		 * @name HallsList
		 * @request GET:/api/Halls
		 */
		hallsList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Halls`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Halls
		 * @name HallsCreate
		 * @request POST:/api/Halls
		 */
		hallsCreate: (data: HallCreateDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Halls`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Halls
		 * @name HallsDetail
		 * @request GET:/api/Halls/{id}
		 */
		hallsDetail: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Halls/${id}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Halls
		 * @name HallsUpdate
		 * @request PUT:/api/Halls/{id}
		 */
		hallsUpdate: (id: number, data: HallUpdateDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Halls/${id}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Halls
		 * @name HallsDelete
		 * @request DELETE:/api/Halls/{id}
		 */
		hallsDelete: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Halls/${id}`,
				method: 'DELETE',
				...params
			})
	};
	movies = {
		/**
		 * No description
		 *
		 * @tags Movies
		 * @name MoviesList
		 * @request GET:/api/Movies
		 */
		moviesList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Movies`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Movies
		 * @name MoviesCreate
		 * @request POST:/api/Movies
		 */
		moviesCreate: (data: MovieCreateDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Movies`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Movies
		 * @name MoviesDetail
		 * @request GET:/api/Movies/{id}
		 */
		moviesDetail: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Movies/${id}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Movies
		 * @name MoviesUpdate
		 * @request PUT:/api/Movies/{id}
		 */
		moviesUpdate: (id: number, data: MovieUpdateDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Movies/${id}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Movies
		 * @name MoviesDelete
		 * @request DELETE:/api/Movies/{id}
		 */
		moviesDelete: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Movies/${id}`,
				method: 'DELETE',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Movies
		 * @name MoviesGenreDetail
		 * @request GET:/api/Movies/genre/{genre}
		 */
		moviesGenreDetail: (genre: string, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Movies/genre/${genre}`,
				method: 'GET',
				...params
			})
	};
	showtimes = {
		/**
		 * No description
		 *
		 * @tags Showtimes
		 * @name ShowtimesList
		 * @request GET:/api/Showtimes
		 */
		showtimesList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Showtimes`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Showtimes
		 * @name ShowtimesCreate
		 * @request POST:/api/Showtimes
		 */
		showtimesCreate: (data: ShowtimeCreateDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Showtimes`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Showtimes
		 * @name ShowtimesDetail
		 * @request GET:/api/Showtimes/{id}
		 */
		showtimesDetail: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Showtimes/${id}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Showtimes
		 * @name ShowtimesUpdate
		 * @request PUT:/api/Showtimes/{id}
		 */
		showtimesUpdate: (id: number, data: ShowtimeUpdateDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Showtimes/${id}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Showtimes
		 * @name ShowtimesDelete
		 * @request DELETE:/api/Showtimes/{id}
		 */
		showtimesDelete: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Showtimes/${id}`,
				method: 'DELETE',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Showtimes
		 * @name ShowtimesMovieDetail
		 * @request GET:/api/Showtimes/movie/{movieId}
		 */
		showtimesMovieDetail: (movieId: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Showtimes/movie/${movieId}`,
				method: 'GET',
				...params
			})
	};
	users = {
		/**
		 * No description
		 *
		 * @tags Users
		 * @name UsersList
		 * @request GET:/api/Users
		 */
		usersList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Users`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Users
		 * @name UsersDetail
		 * @request GET:/api/Users/{id}
		 */
		usersDetail: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Users/${id}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Users
		 * @name UsersDelete
		 * @request DELETE:/api/Users/{id}
		 */
		usersDelete: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Users/${id}`,
				method: 'DELETE',
				...params
			})
	};
}
