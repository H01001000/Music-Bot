import crypto from 'crypto';

export const genId = () => `${crypto.randomInt(1e10, 9e10)}${crypto.randomInt(1e5, 9e5)}`;
