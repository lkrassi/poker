import { claimDailyReward } from '../../../features/index';
import { getUserByUsername } from '../../../features/index';
import { updateUsername } from '../../../features/index';
import { updateProfilePic } from '../../../features/index';

import { loginUser } from '../../../features/index';
import { registerUser } from '../../../features/index';
import { refreshToken } from '../../../features/index';

import { sendConfirmationCode } from '../../../features/index';
import { confirmEmail } from '../../../features/index';

import { createLobby } from '../../../features/index';
import { getAllLobbies } from '../../../features/index';

import { withLoader } from '../../../shared/index';

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
