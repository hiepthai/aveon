export default {
  fetch(): Response {
    return new Response(`Running in ${navigator.userAgent}!`);
  },
};
