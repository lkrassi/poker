import { isLoading } from '../../../shared/model/stores/loaderStore';

export async function withLoader<T>(promise: Promise<T>): Promise<T> {
	isLoading.set(true);
	try {
		const result = await promise;
		return result;
	} finally {
		isLoading.set(false);
	}
}
