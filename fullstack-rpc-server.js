import {urlGetArgs, splitPath, jsonEq} from "./js-util.js";

export class RpcServer {
	constructor(path) {
		//console.log("consructor: "+path);
		this.path=path;
	}	

	async handleRequest(req, {handlerFactory}) {
		if (req.method.toUpperCase()!="POST")
			return;

		let args=urlGetArgs(req.url);
		if (jsonEq(args,splitPath(this.path))) {
			let instance;
			try {
				instance=handlerFactory();
			}

			catch (e) {
				console.log("unable to create api instance...");
				console.log(e);
				throw e;
			}

			//console.log("instance created...");

			let body=await req.json();
			if (!instance[body.method])
				throw new Error("Not found: "+body.method);
				//throw new HttpError("Not found: "+body.method,{status: 404});

			try {
				let result=await instance[body.method](...body.params);
				if (result===undefined)
					result=null;

				return Response.json({result: result});
			}

			catch (e) {
				console.error(e);
				return new Response(e.message,{
					status: 500
				});
			}
		}
	}
}
