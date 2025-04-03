import { claimDailyReward } from '$api/user/dailyReward';
import { getUserByUsername } from '$api/user/getUserByUsername';
import { updateUsername } from '$api/user/updateUsername';
import { updateProfilePic } from '$api/user/updateProfilePic';

import { loginUser } from '$api/auth/login';
import { registerUser } from '$api/auth/register';
import { refreshToken } from '$api/auth/refresh';

import { sendConfirmationCode } from '$api/email/sendCode';
import { confirmEmail } from '$api/email/confirmEmail';

import { createLobby } from '$api/lobby/createLobby';
import { getAllLobbies } from '$api/lobby/getAllLobbies';

import { withLoader } from '$lib/loader';

export const apiFacade = {
	claimDailyReward: () => withLoader(claimDailyReward()),
	updateUsername: (username: string) => withLoader(updateUsername(username)),
	updateProfilePic: (profilePic: File) => withLoader(updateProfilePic(profilePic)),
	confirmEmail: (email: string, code: string) => withLoader(confirmEmail(email, code)),
	getUserByUsername,
	createLobby: (lobbyData: {
		ante: number;
		blind_increase_time: string;
		cache_game: boolean;
		max_players: number;
		small_blind: number;
	}) => withLoader(createLobby(lobbyData)),
	getAllLobbies: (page: number) => withLoader(getAllLobbies(page)),
	loginUser,
	registerUser,
	refreshToken,
	sendConfirmationCode
};
