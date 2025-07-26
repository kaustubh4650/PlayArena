package com.arena.service;

import java.util.List;

import com.arena.dto.ApiResponse;
import com.arena.dto.BookingReqDTO;
import com.arena.dto.BookingResDTO;
import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ReviewReqDTO;
import com.arena.dto.ReviewResDTO;
import com.arena.dto.UpdateUserDTO;
import com.arena.dto.UserReqDTO;
import com.arena.dto.UserResDTO;

public interface UserService {
	
	void validateCredentials(String email, String password);

	UserResDTO addUser(UserReqDTO dto);

	UserResDTO loginUser(LoginReqDTO loginDto);

	String changePassword(ChangePasswordDTO dto);

	UserResDTO getUserById(Long id);

	UserResDTO updateUserDetails(Long id, UpdateUserDTO dto);

	ApiResponse deleteUser(Long id);

	// REVIEW

	ReviewResDTO addReview(Long turfId, Long userId, ReviewReqDTO dto);

	ReviewResDTO updateReview(Long reviewId, ReviewReqDTO dto);

	ApiResponse deleteReview(Long reviewId);

	List<ReviewResDTO> getAllReviewsForTurf(Long turfId);

	List<ReviewResDTO> getAllReviewsByUser(Long userId);
	
	//BOOKING

	BookingResDTO  addBooking(BookingReqDTO dto);
	
	List<BookingResDTO> getAllBookingsByUser(Long userId);
	
	BookingResDTO cancelBooking(Long bookingId) ;
	
	BookingResDTO getBookingById(Long bookingId);
	
}
