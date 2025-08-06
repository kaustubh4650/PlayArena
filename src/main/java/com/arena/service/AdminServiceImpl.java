package com.arena.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.arena.custom_exception.ApiException;
import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.AdminDao;
import com.arena.dao.BookingDao;
import com.arena.dao.ManagerDao;
import com.arena.dao.ReviewDao;
import com.arena.dao.TurfDao;
import com.arena.dao.UserDao;
import com.arena.dto.AdminResDTO;
import com.arena.dto.ApiResponse;
import com.arena.dto.BookingResDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ManagerReqDTO;
import com.arena.dto.ManagerResDTO;
import com.arena.dto.ReviewResDTO;
import com.arena.dto.TurfResDTO;
import com.arena.dto.UserResDTO;
import com.arena.entities.Admin;
import com.arena.entities.Booking;
import com.arena.entities.Manager;
import com.arena.entities.Payment;
import com.arena.entities.Review;
import com.arena.entities.Role;
import com.arena.entities.Slot;
import com.arena.entities.Turf;
import com.arena.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class AdminServiceImpl implements AdminService {

	private AdminDao adminDao;
	private UserDao userDao;
	private ManagerDao managerDao;
	private ReviewDao reviewDao;
	private TurfDao turfDao;
	private BookingDao bookingDao;
	private BCryptPasswordEncoder passwordEncoder;
	private ModelMapper modelMapper;

	public AdminResDTO getByEmail(String email) {

		return adminDao.findByEmail(email).map(admin -> modelMapper.map(admin, AdminResDTO.class))
				.orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

	}

//---------------------------------------------------------------------------------------------

	@Override
	public void validateCredentials(String email, String password) {
		Admin admin = adminDao.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

		if (!passwordEncoder.matches(password, admin.getPassword())) {
			throw new BadCredentialsException("Invalid password");
		}
	}

//---------------------------------------------------------------------------------------------

	@Override
	public AdminResDTO loginAdmin(LoginReqDTO dto) {
		Admin admin = adminDao.findByEmail(dto.getEmail())
				.orElseThrow(() -> new ApiException("Invalid email or password"));

		if (!admin.getPassword().equals(dto.getPassword())) {
			throw new ApiException("Invalid email or password");
		}

		return modelMapper.map(admin, AdminResDTO.class);
	}

//---------------------------------------------------------------------------------------------

	@Override
	public List<UserResDTO> getAllUsers() {
		List<User> users = userDao.findAll();

		if (users.isEmpty()) {
			throw new ResourceNotFoundException("No User found.");
		}

		return users.stream().map(user -> modelMapper.map(user, UserResDTO.class)).collect(Collectors.toList());
	}

//----------------------------------------------------------------------------------------------

	@Override
	public UserResDTO getUserById(Long id) {

		return userDao.findById(id).map(user -> modelMapper.map(user, UserResDTO.class))
				.orElseThrow(() -> new ApiException("User not found"));
	}

//----------------------------------------------------------------------------------------	

	@Override
	public ManagerResDTO addManager(ManagerReqDTO dto) {
		// Checking for duplicate email
		if (managerDao.existsByEmail(dto.getEmail())) {
			throw new ApiException("Email already registered.");
		}

		Manager manager = modelMapper.map(dto, Manager.class);
		// Encode the password
		manager.setPassword(passwordEncoder.encode(dto.getPassword()));
		// save the role to user
		manager.setRole(Role.MANAGER);
		managerDao.save(manager);
		return modelMapper.map(manager, ManagerResDTO.class);
	}

//----------------------------------------------------------------------------------------	

	@Override
	public List<ManagerResDTO> getAllManagers() {

		List<Manager> managers = managerDao.findAll();

		if (managers.isEmpty()) {
			throw new ResourceNotFoundException("No Manager found.");
		}

		return managers.stream().map(manager -> modelMapper.map(manager, ManagerResDTO.class))
				.collect(Collectors.toList());
	}

//----------------------------------------------------------------------------------------

	@Override
	public ApiResponse deleteManager(Long id) {
		Manager manager = managerDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
		managerDao.delete(manager);
		return new ApiResponse("Manager deleted successfully");
	}

//----------------------------------------------------------------------------------------	

	@Override
	public List<TurfResDTO> getAllTurfs() {
		
		List<Turf> turfs = turfDao.findAll();

		if (turfs.isEmpty()) {
			throw new ResourceNotFoundException("No Turf found.");
		}

		return turfs.stream().map(turf -> {
	        TurfResDTO dto = modelMapper.map(turf, TurfResDTO.class);
	        dto.setManagerId(turf.getManager().getManagerId());
	        dto.setManagerName(turf.getManager().getName());
	        return dto;
	    }).collect(Collectors.toList());
	}

//----------------------------------------------------------------------------------------	

	@Override
	public ManagerResDTO getManagerById(Long id) {
		return managerDao.findById(id).map(manager -> modelMapper.map(manager, ManagerResDTO.class))
				.orElseThrow(() -> new ApiException("Manager not found"));
	}

//----------------------------------------------------------------------------------------	

	@Override
	public List<ReviewResDTO> getReviewsByTurf(Long turfId) {
		Turf turf = turfDao.findById(turfId).orElseThrow(() -> new ResourceNotFoundException("Turf not found"));

		List<Review> reviews = reviewDao.findByTurf(turf);

		return reviews.stream().map(review -> {
			ReviewResDTO dto = new ReviewResDTO();
			dto.setReviewId(review.getReviewId());
			dto.setComment(review.getComment());
			dto.setRating(review.getRating());
			dto.setReviewedOn(review.getReviewedOn());

			dto.setUserId(review.getUser().getUserid());
			dto.setUserName(review.getUser().getName());

			dto.setTurfId(turfId);
			dto.setTurfName(turf.getName());

			return dto;
		}).collect(Collectors.toList());
	}

//----------------------------------------------------------------------------------------

	@Override
	public List<BookingResDTO> getAllBookingsByTurfId(Long turfId) {
		List<Booking> bookings = bookingDao.findBySlotTurfTurfId(turfId);

		return bookings.stream().map(booking -> {
			Slot slot = booking.getSlot();
			Turf turf = slot.getTurf();
			User user = booking.getUser();
			Payment payment = booking.getPayment();

			BookingResDTO res = modelMapper.map(booking, BookingResDTO.class);
			res.setSlotId(slot.getSlotId());
			res.setSlotDate(booking.getBookingDate());
			res.setStartTime(slot.getStartTime().toString());
			res.setEndTime(slot.getEndTime().toString());

			res.setTurfId(turf.getTurfId());
			res.setTurfName(turf.getName());
			res.setPricePerHour(turf.getPricePerHour());

			res.setUserId(user.getUserid());
			res.setUserName(user.getName());

			res.setPaymentId(payment.getPaymentId());
			res.setAmount(payment.getAmount());
			res.setPaymentStatus(payment.getStatus());
			res.setPaymentDate(payment.getPaidAt());

			return res;
		}).collect(Collectors.toList());
	}

//----------------------------------------------------------------------------------------

	@Override
	public BookingResDTO getBookingById(Long bookingId) {
		Booking booking = bookingDao.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

		Slot slot = booking.getSlot();
		Turf turf = slot.getTurf();
		User user = booking.getUser();
		Payment payment = booking.getPayment();

		BookingResDTO res = modelMapper.map(booking, BookingResDTO.class);
		res.setSlotId(slot.getSlotId());
		res.setSlotDate(booking.getBookingDate());
		res.setStartTime(slot.getStartTime().toString());
		res.setEndTime(slot.getEndTime().toString());

		res.setTurfId(turf.getTurfId());
		res.setTurfName(turf.getName());
		res.setPricePerHour(turf.getPricePerHour());

		res.setUserId(user.getUserid());
		res.setUserName(user.getName());

		res.setPaymentId(payment.getPaymentId());
		res.setAmount(payment.getAmount());
		res.setPaymentStatus(payment.getStatus());
		res.setPaymentDate(payment.getPaidAt());

		return res;
	}

//-------------------------------------------------------------------------------------------

}
