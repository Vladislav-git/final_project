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

	get = async (req:any, res:any, next:any) => {
		res.send(await this.service.get(req.body));
	}

	addPhoto = async (req:any, res:any, next:any) => {
		res.send(await this.service.addPhoto(req.body));
	}

	updateProfile = async (req:any, res:any, next:any) => {
		res.send(await this.service.updateProfile(req.body));
	}
}
export const controller = new UsersController();