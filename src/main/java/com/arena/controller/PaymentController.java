package com.arena.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.arena.dto.BookingReqDTO;
import com.arena.service.PaymentServiceImpl;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/payment")
@AllArgsConstructor
public class PaymentController {

	private PaymentServiceImpl razorpayService;

	@PostMapping("/create-order")
	public ResponseEntity<?> createOrder(@RequestBody BookingReqDTO dto) {
		return ResponseEntity.ok(razorpayService.processRazorpayOrder(dto));
	}
	
	@GetMapping("/validate-slot")
	public ResponseEntity<?> validateSlotAvailability(
	    @RequestParam Long slotId,
	    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate) {

	    boolean isAvailable = razorpayService.isSlotAvailable(slotId, bookingDate);
	    return ResponseEntity.ok(isAvailable);
	}



}
