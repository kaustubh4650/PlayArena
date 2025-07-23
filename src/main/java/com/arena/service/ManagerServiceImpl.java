package com.arena.service;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
	public TurfResDTO addTurf(TurfReqDTO dto,MultipartFile imageFile, Long managerId) {

		 Manager manager = managerDao.findById(managerId)
		            .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

		    Turf turf = modelMapper.map(dto, Turf.class);
		    turf.setStatus(Status.AVAILABLE);
		    turf.setManager(manager);

		    if (imageFile != null && !imageFile.isEmpty()) {
		        try {
		            String uploadDir =  System.getProperty("user.dir") +"/uploads/images/";
		            String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

		            File uploadPath = new File(uploadDir);
		            if (!uploadPath.exists()) {
		                System.out.println("Creating directory: " + uploadPath.getAbsolutePath());
		                uploadPath.mkdirs();
		            }

		            File destFile = new File(uploadDir + filename);
		            System.out.println("Final destination path: " + destFile.getAbsolutePath());
		            System.out.println("Image file exists? " + imageFile.isEmpty());
		            imageFile.transferTo(destFile);

		            turf.setImagePath("images/" + filename);

		        } catch (IOException e) {
		            throw new RuntimeException("Failed to store image", e);
		        }
		    }

		    Turf saved = turfDao.save(turf);

		    TurfResDTO res = modelMapper.map(saved, TurfResDTO.class);
		    res.setManagerId(manager.getManagerId());
		    res.setManagerName(manager.getName());
		    return res;
	}

//-------------------------------------------------------------------------------------------

	@Override
	public ApiResponse deleteTurfById(Long id) {
		Turf turf = turfDao.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Turf not found"));
		
	    // Delete associated image if exists
	    if (turf.getImagePath() != null) {
	        String imagePath = System.getProperty("user.dir") + "/uploads/" + turf.getImagePath();
	        File imageFile = new File(imagePath);
	        if (imageFile.exists()) {
	            boolean deleted = imageFile.delete();
	            System.out.println("Image deleted: " + deleted);
	        }
	    }
		
		 turfDao.delete(turf);
		 
		 return new ApiResponse("Turf deleted successfully");
	}

//-------------------------------------------------------------------------------------------
	
	@Override
	public TurfResDTO updateTurfDetails(Long id, UpdateTurfDTO dto,MultipartFile imageFile) {
		
		 Turf turf = turfDao.findById(id)
		            .orElseThrow(() -> new ResourceNotFoundException("Turf not found"));

		    // Update basic fields
		    modelMapper.map(dto, turf);

		    // Handle new image upload (optional)
		    if (imageFile != null && !imageFile.isEmpty()) {
		        try {
		            //  Delete old image file (if exists)
		            if (turf.getImagePath() != null) {
		                String oldImagePath = System.getProperty("user.dir") + "/uploads/" + turf.getImagePath();
		                File oldImageFile = new File(oldImagePath);
		                if (oldImageFile.exists()) {
		                    boolean deleted = oldImageFile.delete();
		                    System.out.println("Old image deleted: " + deleted);
		                }
		            }

		            //  Store new image
		            String uploadDir = System.getProperty("user.dir") + "/uploads/images/";
		            String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

		            File uploadPath = new File(uploadDir);
		            if (!uploadPath.exists()) uploadPath.mkdirs();

		            File destFile = new File(uploadDir + filename);
		            imageFile.transferTo(destFile);

		            turf.setImagePath("images/" + filename);

		        } catch (IOException e) {
		            e.printStackTrace();
		            throw new RuntimeException("Failed to store image", e);
		        }
		    }

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
