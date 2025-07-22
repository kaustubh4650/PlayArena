package com.arena.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.arena.custom_exception.ApiException;
import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.UserDao;
import com.arena.dto.ApiResponse;
import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.UpdateUserDTO;
import com.arena.dto.UserReqDTO;
import com.arena.dto.UserResDTO;
import com.arena.entities.Role;
import com.arena.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {
	
	private UserDao userDao;
	private ModelMapper modelMapper;
	private BCryptPasswordEncoder passwordEncoder;

	@Override
	public UserResDTO addUser(UserReqDTO dto) {
			//Checking for duplicate email
			 if (userDao.existsByEmail(dto.getEmail())) {
			        throw new ApiException("Email already registered.");
			    }
			
			User user = modelMapper.map(dto, User.class);
			//Encode the password
			user.setPassword(passwordEncoder.encode(dto.getPassword()));
			//save the role to user
			user.setRole(Role.USER);
			userDao.save(user);
			return modelMapper.map(user,UserResDTO.class);	
	}
	
//-------------------------------------------------------------------------------------

	@Override
	public UserResDTO loginUser(LoginReqDTO loginDto) {
	    User user = userDao.findByEmail(loginDto.getEmail())
	            .orElseThrow(() -> new ApiException("Invalid email or password"));

	    if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
	        throw new ApiException("Invalid email or password");
	    }

	    return modelMapper.map(user, UserResDTO.class);
	}
	
//-------------------------------------------------------------------------------------

	@Override
	public String changePassword(ChangePasswordDTO dto) {
	    User user = userDao.findByEmail(dto.getEmail())
	            .orElseThrow(() -> new ApiException("User not found"));

	    // Validate old password
	    if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
	        throw new ApiException("Old password is incorrect");
	    }

	    // Encode and update new password
	    user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
	    userDao.save(user);

	    return "Password updated successfully";
	}
	
//-------------------------------------------------------------------------------------

	@Override
	public UserResDTO getUserById(Long id) {
		
		return userDao.findById(id)
				.map(user -> modelMapper.map(user, UserResDTO.class))
				.orElseThrow(()-> new ApiException("User not found"));
	}
	
//-------------------------------------------------------------------------------------

	@Override
	public UserResDTO updateUserDetails(Long id, UpdateUserDTO dto) {
		User user = userDao.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("User not found"));
		modelMapper.map(dto, user);
		userDao.save(user);
		return modelMapper.map(user,UserResDTO.class);
	}

//-------------------------------------------------------------------------------------

	@Override
	public ApiResponse deleteUser(Long id) {
		User user = userDao.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("User not found"));
		userDao.delete(user);
		return new ApiResponse("User deleted successfully");
	}

//-------------------------------------------------------------------------------------

	
	
}
