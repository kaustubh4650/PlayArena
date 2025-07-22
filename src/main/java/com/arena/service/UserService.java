package com.arena.service;

import com.arena.dto.LoginReqDTO;
import com.arena.dto.UserReqDTO;
import com.arena.dto.UserResDTO;

public interface UserService {
	
	UserResDTO addUser(UserReqDTO dto);
	
	UserResDTO loginUser(LoginReqDTO loginDto);
}
