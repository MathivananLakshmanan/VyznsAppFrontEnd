
import api from "../../api/api";

import type { LoginRequest, LoginResponse, RegisterRequest, User } from "../../types/auth";




export const loginUser =async (data:LoginRequest):Promise<LoginResponse>=>{

      const res = await api.post("/auth/login",data)
      return res.data;
}

export const registerUser = async (data:RegisterRequest):Promise<User> =>{

      const res = await api.post("/auth/register",data)
      return res.data;
}