/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    alchemyApiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  },
};
