package com.arena.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.arena.custom_exception.ApiException;
import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.BookingDao;
import com.arena.dao.ReviewDao;
import com.arena.dao.SlotDao;
import com.arena.dao.TurfDao;
import com.arena.dao.UserDao;
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
import com.arena.entities.Booking;
import com.arena.entities.BookingStatus;
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
public class UserServiceImpl implements UserService {
	
	private UserDao userDao;
	private ReviewDao reviewDao;
	private TurfDao turfDao;
	private BookingDao bookingDao;
	private SlotDao slotDao;
	private ModelMapper modelMapper;
	private BCryptPasswordEncoder passwordEncoder;

	
	public UserResDTO getByEmail(String email) {
		
		return userDao.findByEmail(email)
				.map(user -> modelMapper.map(user, UserResDTO.class))
				.orElseThrow(()-> new ResourceNotFoundException("User not found"));

	}
	
//-------------------------------------------------------------------------------------
	
	@Override
	public void validateCredentials(String email, String password) {
	    User user = userDao.findByEmail(email)
	        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    if (!passwordEncoder.matches(password, user.getPassword())) {
	        throw new BadCredentialsException("Invalid password");
	    }
	}
	
//-------------------------------------------------------------------------------------
	
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
				.orElseThrow(()-> new ResourceNotFoundException("User not found"));
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

	@Override
	public BookingResDTO addBooking(BookingReqDTO dto) {
	    User user = userDao.findById(dto.getUserId())
	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    Slot slot = slotDao.findById(dto.getSlotId())
	            .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

	    if (bookingDao.existsBySlotAndBookingDate(slot, dto.getBookingDate())) {
	        throw new ApiException("Slot already booked for this date and time");
	    }

	    // Create Booking
	    Booking booking = new Booking();
	    booking.setSlot(slot);
	    booking.setUser(user);
	    booking.setStatus(dto.getStatus() != null ? dto.getStatus() : BookingStatus.CONFIRMED);
	    booking.setBookedOn(LocalDateTime.now());
	    booking.setBookingDate(dto.getBookingDate());
	    
	    Turf turf = slot.getTurf();
	    
	    // Calculate duration in hours
	    long durationInHours = Duration.between(slot.getStartTime(), slot.getEndTime()).toHours();
	    if (durationInHours <= 0) {
	        throw new ApiException("Invalid time range for slot");
	    }

	    double totalAmount = turf.getPricePerHour() * durationInHours;

	    // Handle payment
	    Payment payment = new Payment();
	    payment.setAmount(totalAmount);
	    payment.setStatus(dto.getPayment().getStatus());
	    payment.setPaidAt(LocalDateTime.now());
	    payment.setBooking(booking); 

	    booking.setPayment(payment); // associate with booking

	    Booking saved = bookingDao.save(booking);

	    // Map to response
	    BookingResDTO res = modelMapper.map(saved, BookingResDTO.class);
	    res.setSlotId(slot.getSlotId());
	    res.setSlotDate(saved.getBookingDate());
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

//-----------------------------------------------------------------------------------------

	@Override
	public List<BookingResDTO> getAllBookingsByUser(Long userId) {
	    User user = userDao.findById(userId)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    List<Booking> bookings = bookingDao.findByUserUserid(userId);

	    return bookings.stream().map(booking -> {
	        BookingResDTO dto = modelMapper.map(booking, BookingResDTO.class);

	        Slot slot = booking.getSlot();
	        Turf turf = slot.getTurf();
	        Payment payment = booking.getPayment();

	        dto.setSlotId(slot.getSlotId());
	        dto.setSlotDate(booking.getBookingDate());
	        dto.setStartTime(slot.getStartTime().toString());
	        dto.setEndTime(slot.getEndTime().toString());

	        dto.setTurfId(turf.getTurfId());
	        dto.setTurfName(turf.getName());
	        dto.setPricePerHour(turf.getPricePerHour());

	        dto.setUserId(user.getUserid());
	        dto.setUserName(user.getName());

	        dto.setPaymentId(payment.getPaymentId());
	        dto.setAmount(payment.getAmount());
	        dto.setPaymentStatus(payment.getStatus());
	        dto.setPaymentDate(payment.getPaidAt());

	        return dto;
	    }).collect(Collectors.toList());
	}

	
//-------------------------------------------------------------------------------------------
	
	@Override
	public BookingResDTO cancelBooking(Long bookingId) {

	    Booking booking = bookingDao.findById(bookingId)
	        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

	    if (booking.getStatus() == BookingStatus.CANCELLED) {
	        throw new ApiException("Booking is already cancelled");
	    }

	    booking.setStatus(BookingStatus.CANCELLED);
	    booking.setUpdatedOn(LocalDateTime.now());

	    Booking cancelled = bookingDao.save(booking);

	    // Map to response
	    BookingResDTO res = modelMapper.map(cancelled, BookingResDTO.class);

	    Slot slot = booking.getSlot();
	    Turf turf = slot.getTurf();
	    Payment payment = booking.getPayment();
	    User user = booking.getUser();

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
