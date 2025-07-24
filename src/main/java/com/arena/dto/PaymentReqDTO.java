package com.arena.dto;

import com.arena.entities.PaymentStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentReqDTO {

	@NotNull(message = "Payment status is required")
	private PaymentStatus status;
}
