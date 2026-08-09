import { Api } from './Api';
import { setupApiClient } from '$lib/tools/apiClient';

export const api = new Api();

setupApiClient(api);
