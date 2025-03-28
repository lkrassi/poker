import { claimDailyReward } from '../api/user/dailyReward';
import { getUserByUsername } from '../api/user/getUserByUsername';
import { updateUsername } from '../api/user/updateUsername';
import { updateProfilePic } from '../api/user/updateProfilePic';

import { loginUser } from '../api/auth/login';
import { registerUser } from '../api/auth/register';
import { refreshToken } from '../api/auth/refresh';

import { sendConfirmationCode } from '../api/email/sendCode';
import { confirmEmail } from '../api/email/confirmEmail';

export const apiFacade = {
	claimDailyReward,
	getUserByUsername,
	updateUsername,
	updateProfilePic,
	loginUser,
	registerUser,
	refreshToken,
	sendConfirmationCode,
	confirmEmail
};
