import { claimDailyReward } from '../api/user/dailyReward';
import { getUserByUsername } from '../api/user/getUserByUsername';
import { updateUsername } from '../api/user/updateUsername';
import { updateProfilePic } from '../api/user/updateProfilePic';

import { loginUser } from '../api/auth/login';
import { registerUser } from '../api/auth/register';
import { refreshToken } from '../api/auth/refresh';

import { sendConfirmationCode } from '../api/email/sendCode';
import { confirmEmail } from '../api/email/confirmEmail';

import { withLoader } from '$lib/loader';

export const apiFacade = {
	claimDailyReward: () => withLoader(claimDailyReward()),
	updateUsername: (username: string) => withLoader(updateUsername(username)),
	updateProfilePic: (profilePic: File) => withLoader(updateProfilePic(profilePic)),
	confirmEmail: (email: string, code: string) => withLoader(confirmEmail(email, code)),
	getUserByUsername,
	loginUser,
	registerUser,
	refreshToken,
	sendConfirmationCode
};
