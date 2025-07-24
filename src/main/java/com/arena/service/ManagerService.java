package com.arena.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.arena.dto.ApiResponse;
import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ManagerResDTO;
import com.arena.dto.SlotReqDTO;
import com.arena.dto.SlotResDTO;
import com.arena.dto.TurfReqDTO;
import com.arena.dto.TurfResDTO;
import com.arena.dto.UpdateManagerDTO;
import com.arena.dto.UpdateTurfDTO;

public interface ManagerService {

	ManagerResDTO loginManager(LoginReqDTO dto);

	String changePassword(ChangePasswordDTO dto);

	ManagerResDTO getManagerById(Long id);

	ManagerResDTO updateManagerDetails(Long id, UpdateManagerDTO dto);
	
	//TURFS

	TurfResDTO addTurf(TurfReqDTO dto,MultipartFile  imageFile, Long managerId);

	ApiResponse deleteTurfById(Long id);

	TurfResDTO updateTurfDetails(Long id,UpdateTurfDTO dto,MultipartFile imageFile);

	TurfResDTO getTurfById(Long id);
	
	List<TurfResDTO> getAllTurfsByManager(Long managerId);

	//SLOTS
	
	SlotResDTO addSlot(SlotReqDTO dto, Long turfId);
	
	List<SlotResDTO> getAllSlotsByTurf(Long turfId);

	SlotResDTO getSlotById(Long slotId);
	
	SlotResDTO updateSlot(Long slotId, SlotReqDTO dto);

	ApiResponse deleteSlotById(Long slotId);
	
}
