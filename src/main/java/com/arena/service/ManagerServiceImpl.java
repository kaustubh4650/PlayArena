package com.arena.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.arena.custom_exception.ApiException;
import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.ManagerDao;
import com.arena.dao.TurfDao;
import com.arena.dto.ApiResponse;
import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ManagerResDTO;
import com.arena.dto.TurfReqDTO;
import com.arena.dto.TurfResDTO;
import com.arena.dto.UpdateManagerDTO;
import com.arena.dto.UpdateTurfDTO;
import com.arena.entities.Manager;
import com.arena.entities.Status;
import com.arena.entities.Turf;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ManagerServiceImpl implements ManagerService {

	private ManagerDao managerDao;
	private TurfDao turfDao;
	private ModelMapper modelMapper;
	private BCryptPasswordEncoder passwordEncoder;

	@Override
	public ManagerResDTO loginManager(LoginReqDTO dto) {
		Manager manager = managerDao.findByEmail(dto.getEmail())
				.orElseThrow(() -> new ApiException("Invalid email or password"));

		if (!passwordEncoder.matches(dto.getPassword(), manager.getPassword())) {
			throw new ApiException("Invalid email or password");
		}

		return modelMapper.map(manager, ManagerResDTO.class);
	}

//-------------------------------------------------------------------------------------------

	@Override
	public String changePassword(ChangePasswordDTO dto) {

		Manager manager = managerDao.findByEmail(dto.getEmail())
				.orElseThrow(() -> new ApiException("Manager not found"));

		// Validate old password
		if (!passwordEncoder.matches(dto.getOldPassword(), manager.getPassword())) {
			throw new ApiException("Old password is incorrect");
		}

		// Encode and update new password
		manager.setPassword(passwordEncoder.encode(dto.getNewPassword()));
		managerDao.save(manager);

		return "Password updated successfully";
	}

//-------------------------------------------------------------------------------------------

	@Override
	public ManagerResDTO getManagerById(Long id) {
		return managerDao.findById(id).map(manager -> modelMapper.map(manager, ManagerResDTO.class))
				.orElseThrow(() -> new ApiException("Manager not found"));
	}

//-------------------------------------------------------------------------------------------

	@Override
	public ManagerResDTO updateManagerDetails(Long id, UpdateManagerDTO dto) {
		Manager manager = managerDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
		modelMapper.map(dto, manager);
		managerDao.save(manager);
		return modelMapper.map(manager, ManagerResDTO.class);
	}

//-------------------------------------------------------------------------------------------

	@Override
	public TurfResDTO addTurf(@Valid TurfReqDTO dto, Long managerId) {

		Manager manager = managerDao.findById(managerId)
				.orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

		Turf turf = modelMapper.map(dto, Turf.class);
		turf.setStatus(Status.AVAILABLE);
		turf.setManager(manager);

		Turf savedTurf = turfDao.save(turf);

		TurfResDTO res = modelMapper.map(savedTurf, TurfResDTO.class);
		res.setManagerId(manager.getManagerId());
		res.setManagerName(manager.getName());

		return res;
	}

//-------------------------------------------------------------------------------------------

	@Override
	public ApiResponse deleteTurfById(Long id) {
		Turf turf = turfDao.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Turf not found"));
		
		 turfDao.delete(turf);
		 
		 return new ApiResponse("Turf deleted successfully");
	}

//-------------------------------------------------------------------------------------------
	
	@Override
	public TurfResDTO updateTurfDetails(Long id, UpdateTurfDTO dto) {
		
		Turf turf = turfDao.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Turf not found"));
		
		 modelMapper.map(dto, turf);
		 
		 Turf updated = turfDao.save(turf);
		 
		 TurfResDTO res = modelMapper.map(updated, TurfResDTO.class);
		    res.setManagerId(updated.getManager().getManagerId());
		    res.setManagerName(updated.getManager().getName());
		
		return res;
	}

//------------------------------------------------------------------------------------------
	
	@Override
	public TurfResDTO getTurfById(Long id) {

		Turf turf =  turfDao.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("Turf not found"));
		
		 TurfResDTO dto = modelMapper.map(turf, TurfResDTO.class);
		    dto.setManagerId(turf.getManager().getManagerId());
		    dto.setManagerName(turf.getManager().getName());
		    
		    return dto;
	}

//-------------------------------------------------------------------------------------------

}
