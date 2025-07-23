package com.arena.service;

import com.arena.dto.ApiResponse;
import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ManagerResDTO;
import com.arena.dto.TurfReqDTO;
import com.arena.dto.TurfResDTO;
import com.arena.dto.UpdateManagerDTO;
import com.arena.dto.UpdateTurfDTO;

import jakarta.validation.Valid;

public interface ManagerService {

	ManagerResDTO loginManager(LoginReqDTO dto);

	String changePassword(ChangePasswordDTO dto);

	ManagerResDTO getManagerById(Long id);

	ManagerResDTO updateManagerDetails(Long id, UpdateManagerDTO dto);

	TurfResDTO addTurf(TurfReqDTO dto, Long managerId);

	ApiResponse deleteTurfById(Long id);

	TurfResDTO updateTurfDetails(Long id,UpdateTurfDTO dto);

	TurfResDTO getTurfById(Long id);

	
}
