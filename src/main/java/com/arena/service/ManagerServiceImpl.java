package com.arena.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.arena.custom_exception.ApiException;
import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.BookingDao;
import com.arena.dao.ManagerDao;
import com.arena.dao.SlotDao;
import com.arena.dao.TurfDao;
import com.arena.dto.ApiResponse;
import com.arena.dto.BookingResDTO;
import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ManagerResDTO;
import com.arena.dto.SlotReqDTO;
import com.arena.dto.SlotResDTO;
import com.arena.dto.TurfReqDTO;
import com.arena.dto.TurfResDTO;
import com.arena.dto.UpdateManagerDTO;
import com.arena.dto.UpdateTurfDTO;
import com.arena.entities.Booking;
import com.arena.entities.Manager;
import com.arena.entities.Payment;
import com.arena.entities.Slot;
import com.arena.entities.Status;
import com.arena.entities.Turf;
import com.arena.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ManagerServiceImpl implements ManagerService {

	private ManagerDao managerDao;
	private TurfDao turfDao;
	private SlotDao slotDao;
	private BookingDao bookingDao;
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
	public TurfResDTO addTurf(TurfReqDTO dto, MultipartFile imageFile, Long managerId) {

		Manager manager = managerDao.findById(managerId)
				.orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

		Turf turf = modelMapper.map(dto, Turf.class);
		turf.setStatus(Status.AVAILABLE);
		turf.setManager(manager);

		if (imageFile != null && !imageFile.isEmpty()) {
			try {
				String uploadDir = System.getProperty("user.dir") + "/uploads/images/";
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
		Turf turf = turfDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("Turf not found"));

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
	public TurfResDTO updateTurfDetails(Long id, UpdateTurfDTO dto, MultipartFile imageFile) {

		Turf turf = turfDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("Turf not found"));

		// Update basic fields
		modelMapper.map(dto, turf);

		// Handle new image upload (optional)
		if (imageFile != null && !imageFile.isEmpty()) {
			try {
				// Delete old image file (if exists)
				if (turf.getImagePath() != null) {
					String oldImagePath = System.getProperty("user.dir") + "/uploads/" + turf.getImagePath();
					File oldImageFile = new File(oldImagePath);
					if (oldImageFile.exists()) {
						boolean deleted = oldImageFile.delete();
						System.out.println("Old image deleted: " + deleted);
					}
				}

				// Store new image
				String uploadDir = System.getProperty("user.dir") + "/uploads/images/";
				String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

				File uploadPath = new File(uploadDir);
				if (!uploadPath.exists())
					uploadPath.mkdirs();

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

		Turf turf = turfDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("Turf not found"));

		TurfResDTO dto = modelMapper.map(turf, TurfResDTO.class);
		dto.setManagerId(turf.getManager().getManagerId());
		dto.setManagerName(turf.getManager().getName());

		return dto;
	}

//-------------------------------------------------------------------------------------------

	@Override
	public List<TurfResDTO> getAllTurfsByManager(Long managerId) {
		Manager manager = managerDao.findById(managerId)
				.orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

		List<Turf> turfs = turfDao.findByManager(manager);

		return turfs.stream().map(t -> {
			TurfResDTO dto = modelMapper.map(t, TurfResDTO.class);
			dto.setManagerId(manager.getManagerId());
			dto.setManagerName(manager.getName());
			return dto;
		}).collect(Collectors.toList());
	}

// -------------------------------------------------------------------------------------------

	@Override
	public SlotResDTO addSlot(SlotReqDTO dto, Long turfId) {

		Turf turf = turfDao.findById(turfId).orElseThrow(() -> new ResourceNotFoundException("Turf not found"));

		boolean exists = slotDao.existsOverlappingSlot(
		        turf, dto.getStartTime(), dto.getEndTime()
		);

		if (exists) {
			throw new ApiException("Slot already taken for the given time");
		}

		Slot slot = modelMapper.map(dto, Slot.class);
		slot.setStatus(Status.AVAILABLE);
		slot.setTurf(turf);

		Slot saved = slotDao.save(slot);

		SlotResDTO res = modelMapper.map(saved, SlotResDTO.class);
		res.setTurfId(turf.getTurfId());
		res.setTurfName(turf.getName());

		return res;
	}

// -------------------------------------------------------------------------------------------

	@Override
	public List<SlotResDTO> getAllSlotsByTurf(Long turfId) {
		Turf turf = turfDao.findById(turfId).orElseThrow(() -> new ResourceNotFoundException("Turf not found"));

		List<Slot> slots = slotDao.findByTurf(turf);

		return slotDao.findByTurf(turf).stream().map(slot -> {
			SlotResDTO dto = modelMapper.map(slot, SlotResDTO.class);
			dto.setTurfId(turf.getTurfId());
			dto.setTurfName(turf.getName());
			return dto;
		}).collect(Collectors.toList());
	}

// ---------------------------------------------------------------------------------------

	@Override
	public SlotResDTO getSlotById(Long slotId) {
		Slot slot = slotDao.findById(slotId).orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

		SlotResDTO dto = modelMapper.map(slot, SlotResDTO.class);

		// Set turf details manually
		if (slot.getTurf() != null) {
			dto.setTurfId(slot.getTurf().getTurfId());
			dto.setTurfName(slot.getTurf().getName());
		}
		return dto;
	}

// ---------------------------------------------------------------------------------------

	@Override
	public SlotResDTO updateSlot(Long slotId, SlotReqDTO dto) {
		Slot slot = slotDao.findById(slotId).orElseThrow(() -> new ResourceNotFoundException("Slot not found"));
		
	    Turf turf = slot.getTurf();


	    boolean overlaps = slotDao.existsOverlappingSlotExceptSelf(
	            turf, dto.getStartTime(), dto.getEndTime(), slotId
	    );
	    if (overlaps) {
	        throw new ApiException("Slot overlaps with an existing slot");
	    }
	

		modelMapper.map(dto, slot);

		Slot updatedSlot = slotDao.save(slot);

		SlotResDTO resDto = modelMapper.map(updatedSlot, SlotResDTO.class);
		resDto.setTurfId(updatedSlot.getTurf().getTurfId());
		resDto.setTurfName(updatedSlot.getTurf().getName());

		return resDto;
	}

// ---------------------------------------------------------------------------------------

	@Override
	public ApiResponse deleteSlotById(Long slotId) {
		Slot slot = slotDao.findById(slotId).orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

		slotDao.delete(slot);

		return new ApiResponse("Slot deleted successfully");
	}

// ---------------------------------------------------------------------------------------

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


// ---------------------------------------------------------------------------------------

}
