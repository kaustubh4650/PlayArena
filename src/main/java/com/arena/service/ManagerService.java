package com.arena.service;

import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ManagerResDTO;
import com.arena.dto.UpdateManagerDTO;

import jakarta.validation.Valid;

public interface ManagerService {

	ManagerResDTO loginManager(LoginReqDTO dto);

	String changePassword(ChangePasswordDTO dto);

	ManagerResDTO getManagerById(Long id);

	ManagerResDTO updateManagerDetails(Long id, UpdateManagerDTO dto);

	
}
