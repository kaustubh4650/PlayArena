package com.arena.service;

import java.util.List;

import com.arena.dto.AdminResDTO;
import com.arena.dto.ApiResponse;
import com.arena.dto.BookingResDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ManagerReqDTO;
import com.arena.dto.ManagerResDTO;
import com.arena.dto.ReviewResDTO;
import com.arena.dto.TurfResDTO;
import com.arena.dto.UserResDTO;

public interface AdminService {

	void validateCredentials(String email, String password);
	
	AdminResDTO getByEmail(String email);
	
	AdminResDTO loginAdmin(LoginReqDTO dto);

	List<UserResDTO> getAllUsers();

	UserResDTO getUserById(Long id);

	ManagerResDTO addManager(ManagerReqDTO dto);

	List<ManagerResDTO> getAllManagers();

	ApiResponse deleteManager(Long id);

	ManagerResDTO getManagerById(Long id);
	
	List<TurfResDTO> getAllTurfs();
	
	List<ReviewResDTO> getReviewsByTurf(Long turfId);
	
	List<BookingResDTO> getAllBookingsByTurfId(Long turfId);
	
	BookingResDTO getBookingById(Long bookingId);

	
}
