package com.arena.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.arena.custom_exception.ApiException;
import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.ManagerDao;
import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ManagerResDTO;
import com.arena.dto.UpdateManagerDTO;
import com.arena.entities.Manager;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ManagerServiceImpl implements ManagerService {
	
	private ManagerDao managerDao;
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
		return managerDao.findById(id)
				.map(manager -> modelMapper.map(manager, ManagerResDTO.class))
				.orElseThrow(()-> new ApiException("Manager not found"));
	}
	
//-------------------------------------------------------------------------------------------

	@Override
	public ManagerResDTO updateManagerDetails(Long id, UpdateManagerDTO dto) {
		Manager manager = managerDao.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("User not found"));
		modelMapper.map(dto, manager);
		managerDao.save(manager);
		return modelMapper.map(manager,ManagerResDTO.class);
	}
	
	
//-------------------------------------------------------------------------------------------

}
