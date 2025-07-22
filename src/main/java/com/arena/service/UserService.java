package com.arena.service;

import com.arena.dto.ApiResponse;
import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.UpdateUserDTO;
import com.arena.dto.UserReqDTO;
import com.arena.dto.UserResDTO;

public interface UserService {
	
	UserResDTO addUser(UserReqDTO dto);
	
	UserResDTO loginUser(LoginReqDTO loginDto);
	
	 String changePassword(ChangePasswordDTO dto);

	UserResDTO getUserById(Long id);

	UserResDTO updateUserDetails(Long id, UpdateUserDTO dto);

	ApiResponse deleteUser(Long id);
}
