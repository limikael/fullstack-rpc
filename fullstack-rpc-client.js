let proxyMethodHandler={
	get: (target,prop,_receiver)=>{
		return async (...params)=>{
			return await target.callMethod(prop,params);
		}
	}
};

export class RpcClient {
	constructor({fetch, url, headers}) {
		if (!fetch)
			fetch=globalThis.fetch.bind(globalThis);

		this.fetch=fetch;
		this.url=url;
		this.proxy=new Proxy(this,proxyMethodHandler);
		this.headers=new Headers(headers);
		this.headers.set("content-type","application/json");
	}

	async callMethod(method, params) {
		//console.log("calling: "+method);
		//console.log("fetch",this.fetch);

		let response=await this.fetch(this.url,{
			method: "POST",
			headers: this.headers,
			body: JSON.stringify({
				method: method,
				params: params
			})
		});

		if (response.status<200 || response.status>=300)
			throw new Error(await response.text());

		//console.log("call complete...");

		return (await response.json()).result;
	}
}

export function createRpcProxy(params) {
	let rpcClient=new RpcClient(params);
	return rpcClient.proxy;
}
