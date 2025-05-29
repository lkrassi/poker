import { claimDailyReward } from '../../../features/profile/api/dailyReward';
import { getUserByUsername } from '../../../features/profile/api/getUserByUsername';
import { updateUsername } from '../../../features/profile/api/updateUsername';
import { updateProfilePic } from '../../../features/profile/api/updateProfilePic';

import { loginUser } from '../../../features/auth/api/login';
import { registerUser } from '../../../features/auth/api/register';
import { refreshToken } from '../../../features/auth/api/refresh';

import { sendConfirmationCode } from '../../../features/auth/api/sendCode';
import { confirmEmail } from '../../../features/auth/api/confirmEmail';

import { createLobby } from '../../../features/lobby/api/createLobby';
import { getAllLobbies } from '../../../features/lobby/api/getAllLobbies';

import { withLoader } from '../../../shared/lib/utils/loader';

export const apiFacade = {
	claimDailyReward: () => withLoader(claimDailyReward()),
	updateUsername: (username: string) => withLoader(updateUsername(username)),
	updateProfilePic: (profilePic: File) => withLoader(updateProfilePic(profilePic)),
	confirmEmail: (email: string, code: string) => withLoader(confirmEmail(email, code)),
	getUserByUsername,
	createLobby: (lobbyData: {
		blind_increase_time: string;
		max_players: number;
		small_blind: number;
	}) => withLoader(createLobby(lobbyData)),
	getAllLobbies: (page: number) => withLoader(getAllLobbies(page)),
	loginUser,
	registerUser,
	refreshToken,
	sendConfirmationCode
};
