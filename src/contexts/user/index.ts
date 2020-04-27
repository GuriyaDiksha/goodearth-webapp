import { createContext } from "react";
import { UserContextType } from "./typings";
import { initialState } from "reducers/user";

const UserContext: UserContextType = createContext(initialState);

export default UserContext;
