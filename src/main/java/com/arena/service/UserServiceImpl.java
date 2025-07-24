package com.arena.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.arena.custom_exception.ApiException;
import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.ReviewDao;
import com.arena.dao.TurfDao;
import com.arena.dao.UserDao;
import com.arena.dto.ApiResponse;
import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ReviewReqDTO;
import com.arena.dto.ReviewResDTO;
import com.arena.dto.UpdateUserDTO;
import com.arena.dto.UserReqDTO;
import com.arena.dto.UserResDTO;
import com.arena.entities.Review;
import com.arena.entities.Role;
import com.arena.entities.Turf;
import com.arena.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {
	
	private UserDao userDao;
	private ReviewDao reviewDao;
	private TurfDao turfDao;
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

	@Override
	public ReviewResDTO addReview(Long turfId, Long userId, ReviewReqDTO dto) {
		Turf turf = turfDao.findById(turfId).orElseThrow(() -> new ResourceNotFoundException("Turf not found"));
		User user = userDao.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (reviewDao.existsByUserAndTurf(user, turf)) {
			throw new ApiException("You have already reviewed this turf.");
		}

		Review review = modelMapper.map(dto, Review.class);
		review.setUser(user);
		review.setTurf(turf);

		Review saved = reviewDao.save(review);

		ReviewResDTO res = modelMapper.map(saved, ReviewResDTO.class);
		res.setUserId(user.getUserid());
		res.setUserName(user.getName());
		res.setTurfId(turf.getTurfId());
		res.setTurfName(turf.getName());

		return res;
	}

//-------------------------------------------------------------------------------------

	@Override
	public ReviewResDTO updateReview(Long reviewId, ReviewReqDTO dto) {
		Review review = reviewDao.findById(reviewId)
				.orElseThrow(() -> new ResourceNotFoundException("Review not found"));

		review.setRating(dto.getRating());
		review.setComment(dto.getComment());

		Review updated = reviewDao.save(review);

		ReviewResDTO res = modelMapper.map(updated, ReviewResDTO.class);
		res.setUserId(updated.getUser().getUserid());
		res.setUserName(updated.getUser().getName());
		res.setTurfId(updated.getTurf().getTurfId());
		res.setTurfName(updated.getTurf().getName());

		return res;
	}

//-------------------------------------------------------------------------------------

	@Override
	public ApiResponse deleteReview(Long reviewId) {
		Review review = reviewDao.findById(reviewId)
				.orElseThrow(() -> new ResourceNotFoundException("Review not found"));

		reviewDao.delete(review);
		return new ApiResponse("Review deleted successfully");
	}

//-------------------------------------------------------------------------------------

	@Override
	public List<ReviewResDTO> getAllReviewsForTurf(Long turfId) {
		Turf turf = turfDao.findById(turfId).orElseThrow(() -> new ResourceNotFoundException("Turf not found"));

		List<Review> reviews = reviewDao.findByTurf(turf);

		return reviews.stream().map(r -> {
			ReviewResDTO dto = modelMapper.map(r, ReviewResDTO.class);
			dto.setUserId(r.getUser().getUserid());
			dto.setUserName(r.getUser().getName());
			dto.setTurfId(r.getTurf().getTurfId());
			dto.setTurfName(r.getTurf().getName());
			return dto;
		}).collect(Collectors.toList());
	}

//-------------------------------------------------------------------------------------

	@Override
	public List<ReviewResDTO> getAllReviewsByUser(Long userId) {
		User user = userDao.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		List<Review> reviews = reviewDao.findByUser(user);

		return reviews.stream().map(r -> {
			ReviewResDTO dto = modelMapper.map(r, ReviewResDTO.class);
			dto.setUserId(r.getUser().getUserid());
			dto.setUserName(r.getUser().getName());
			dto.setTurfId(r.getTurf().getTurfId());
			dto.setTurfName(r.getTurf().getName());

			return dto;
		}).collect(Collectors.toList());
	}

//-------------------------------------------------------------------------------------

	
	
}
