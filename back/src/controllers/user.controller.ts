const {usersService} = require('../services/user.service');


class UsersController {

	service = usersService;

	login = async (req:any, res:any, next:any) => {
		res.send(await this.service.login(req.body));
	};

    register = async (req:any, res:any, next:any) => {
		res.send(await this.service.register(req.body));
    };

}
export const controller = new UsersController();