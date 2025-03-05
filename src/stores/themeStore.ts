import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const getThemeFromCookies = (): 'light' | 'dark' => {
	if (browser) {
		const cookies = document.cookie.split('; ').reduce(
			(acc, cookie) => {
				const [key, value] = cookie.split('=');
				acc[key] = value;
				return acc;
			},
			{} as Record<string, string>
		);

		return cookies.theme === 'dark' ? 'dark' : 'light';
	}
	return 'light';
};

const setThemeInCookies = (theme: 'light' | 'dark') => {
	if (browser) {
		document.cookie = `theme=${theme}; path=/; max-age=31536000`;
	}
};

const initialTheme = getThemeFromCookies();
export const theme = writable<'light' | 'dark'>(initialTheme);

if (browser) {
	theme.subscribe((currentTheme) => {
		setThemeInCookies(currentTheme);
		document.body.classList.toggle('dark-theme', currentTheme === 'dark');
	});
}

export const toggleTheme = () => {
	theme.update((currentTheme) => {
		const newTheme = currentTheme === 'light' ? 'dark' : 'light';
		setThemeInCookies(newTheme);
		document.body.classList.toggle('dark-theme', newTheme === 'dark');
		return newTheme;
	});
};
