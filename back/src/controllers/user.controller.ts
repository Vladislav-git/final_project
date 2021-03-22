const {usersService} = require('../services/user.service');
const {graphqlService} = require('../services/graphqlServices')


class UsersController {

	service = usersService;
	graphqlService = graphqlService

	login = async (req:any, res:any, next:any) => {
		res.send(await this.service.login(req.body));
	};

    register = async (req:any, res:any, next:any) => {
		res.send(await this.service.register(req.body));
	};
	
	google = async (req:any, res:any, next:any) => {
		res.send(await this.service.google(req.body));
	}

	// addPost = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.addPost(req.body));
	// }
	
	// addChat = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.addChat(req.body, req.online));
	// }

	// addComment = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.addComment(req.body));
	// }

	// getUserPosts = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.getUserPosts(req.params.id));
	// }

	// addPhoto = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.addPhoto(req.body));
	// }

	// addFriend = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.addFriend(req.body, req.online));
	// }

	// removeFriend = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.removeFriend(req.body, req.online));
	// }

	// updateProfile = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.updateProfile(req.body));
	// }

	// getFriends = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.getFriends(req.online));
	// }

	// getChats = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.getChats(req.online));
	// }

	// getUsers = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.getUsers(req.online));
	// }

	// getAllPosts = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.getAllPosts(req.online));
	// }

	// changeLike = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.changeLike(req.body, req.online));
	// }

	// getPostComments = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.getPostComments(req.params.id));
	// }

	// getUserProfile = async (req:any, res:any, next:any) => {
	// 	res.send(await this.service.getUserProfile(req.params.id));
	// }

}
export const controller = new UsersController();