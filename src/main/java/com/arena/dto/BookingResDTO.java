package com.arena.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.arena.entities.BookingStatus;
import com.arena.entities.PaymentStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingResDTO {

    private Long bookingId;
    private LocalDateTime bookedOn;
    private BookingStatus status;

    private Long slotId;
    private LocalDate slotDate;
    private String startTime;
    private String endTime;

    private Long turfId;
    private String turfName;
    private double pricePerHour;

    private Long userId;
    private String userName;

    private Long paymentId;
    private double amount;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
}
