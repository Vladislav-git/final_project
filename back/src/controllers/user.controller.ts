const {usersService} = require('../services/user.service');


class UsersController {

	service = usersService;

	login = async (req:any, res:any, next:any) => {
		res.send(await this.service.login(req.body));
	};

    register = async (req:any, res:any, next:any) => {
		res.send(await this.service.register(req.body));
	};
	
	google = async (req:any, res:any, next:any) => {
		res.send(await this.service.google(req.body));
	}

	addPost = async (req:any, res:any, next:any) => {
		res.send(await this.service.addPost(req.body));
	}

	addComment = async (req:any, res:any, next:any) => {
		res.send(await this.service.addComment(req.body));
	}

	getPosts = async (req:any, res:any, next:any) => {
		res.send(await this.service.getPosts());
	}

	addPhoto = async (req:any, res:any, next:any) => {
		res.send(await this.service.addPhoto(req.body));
	}

	updateProfile = async (req:any, res:any, next:any) => {
		res.send(await this.service.updateProfile(req.body));
	}

	getFriends = async (req:any, res:any, next:any) => {
		res.send(await this.service.getFriends(req.online));
	}
}
export const controller = new UsersController();