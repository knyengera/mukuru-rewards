export function registrationVerifyEmail(verifyUrl: string) {
  return {
    subject: 'Verify your Mukuru Rewards account',
    html: `<p>Welcome to Mukuru Rewards!</p><p>Please verify your email:</p><p><a href="${verifyUrl}">Verify my account</a></p>`,
  };
}

export function forgotPasswordEmail(resetUrl: string) {
  return {
    subject: 'Reset your Mukuru Rewards password',
    html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset Password</a></p>`
  };
}

export function resetPasswordConfirmationEmail() {
  return {
    subject: 'Your Mukuru Rewards password was changed',
    html: `<p>Your password has been updated successfully. If this wasn't you, please contact support immediately.</p>`
  };
}

export function transactionSentEmail(amount: number, currency: string, points: number) {
  return {
    subject: 'Transfer sent — Mukuru Miles earned',
    html: `<p>Your transfer of <strong>${currency} ${amount}</strong> is processed.</p><p>You earned <strong>${points}</strong> Mukuru Miles. 🎉</p>`,
  };
}

export function rewardRedeemedEmail(rewardName: string, pointsCost: number) {
  return {
    subject: 'Reward redeemed successfully',
    html: `<p>You redeemed <strong>${rewardName}</strong> for <strong>${pointsCost}</strong> Mukuru Miles. Enjoy!</p>`,
  };
}

export function achievementUnlockedEmail(name: string) {
  return {
    subject: `Badge unlocked: ${name}`,
    html: `<p>Congrats! You unlocked the <strong>${name}</strong> badge. Keep it up! ✨</p>`,
  };
}


