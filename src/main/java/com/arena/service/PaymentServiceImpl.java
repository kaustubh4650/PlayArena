package com.arena.service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.arena.custom_exception.ApiException;
import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.BookingDao;
import com.arena.dao.SlotDao;
import com.arena.dto.BookingReqDTO;
import com.arena.entities.BookingStatus;
import com.arena.entities.Slot;
import com.arena.entities.Turf;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PaymentServiceImpl {

	@Autowired
	private SlotDao slotDao;
	
	@Autowired
	private BookingDao bookingDao;

	@Value("${razorpay.key}")
	private String RAZORPAY_KEY;

	@Value("${razorpay.secret}")
	private String RAZORPAY_SECRET;
	
	public Map<String, Object> processRazorpayOrder(BookingReqDTO dto) {
		try {
			Slot slot = slotDao.findById(dto.getSlotId())
					.orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

			Turf turf = slot.getTurf();
			long durationInHours = Duration.between(slot.getStartTime(), slot.getEndTime()).toHours();

			if (durationInHours <= 0)
				throw new ApiException("Invalid slot duration");

			double amount = turf.getPricePerHour() * durationInHours;
			Order order = createRazorpayOrder(amount);

			JSONObject response = new JSONObject();
			response.put("orderId", order.get("id").toString());
			response.put("amount", order.get("amount").toString());
			response.put("currency", order.get("currency").toString());
			response.put("key", RAZORPAY_KEY);

			return response.toMap();

		} catch (RazorpayException e) {
			throw new ApiException("Failed to create Razorpay order. Please try again.");
		}
	}


	private Order createRazorpayOrder(double amount) throws RazorpayException {
		RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY, RAZORPAY_SECRET);

		JSONObject options = new JSONObject();
		options.put("amount", (int) (amount * 100));
		options.put("currency", "INR");
		options.put("receipt", "txn_" + System.currentTimeMillis());
		options.put("payment_capture", 1);

		return razorpayClient.orders.create(options);
	}

//----------------------------------------------------------------------------------------------------
	
	public boolean isSlotAvailable(Long slotId, LocalDate bookingDate) {
	    Slot slot = slotDao.findById(slotId)
	            .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

	    return !bookingDao.existsBySlotAndBookingDateAndStatusNot(slot, bookingDate, BookingStatus.CANCELLED);
	}
	
}
