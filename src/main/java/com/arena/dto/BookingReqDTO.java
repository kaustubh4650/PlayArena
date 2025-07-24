package com.arena.dto;

import java.time.LocalDate;

import com.arena.entities.BookingStatus;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingReqDTO {

	@NotNull(message = "Slot ID is required")
	private Long slotId;

	@NotNull(message = "User ID is required")
	private Long userId;

	@NotNull
	private BookingStatus status;

	@NotNull(message = "Payment details are required")
	private PaymentReqDTO payment;

	@NotNull(message = "Booking date is required")
	@FutureOrPresent(message = "Booking date must be today or in the future")
	private LocalDate bookingDate;
}
