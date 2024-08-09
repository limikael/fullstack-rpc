import {createContext, useContext} from "react";
import {RpcClient} from "./fullstack-rpc-client.js";

let RpcContext=createContext();

export function RpcProvider({fetch, url, children}) {
	let api=new RpcClient({fetch, url});

	return (<>
		<RpcContext.Provider value={api}>
			{children}
		</RpcContext.Provider>
	</>);
}

export function useRpc() {
	return useContext(RpcContext).proxy;
}
