# Instagram story fetcher
It fetchs the instagram private API to get the stories of speciefied users and it sends updates to the client using socket.io.  
Each registered users (max: 100, better to prevent a ban from Instagram) receive a token at registration (POST `http://localhost:4000/story`, in the `StoryRouter.ts`) and they can use it to subscribe at the update event with socket.io-client (`StoryWs.ts`).

## Login
You need to enter a username and a password of an account to the `InstagramService.ts` because we need a SessionID to perform requests to the Instagram private API.

## License
MIT - Owen Calvin
