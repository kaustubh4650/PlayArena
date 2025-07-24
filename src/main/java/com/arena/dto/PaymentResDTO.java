package com.arena.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentResDTO {

    private Long paymentId;
    
    private double amount;
    
    private String status;
    
    private LocalDateTime paymentDate;

    private Long bookingId;
}
