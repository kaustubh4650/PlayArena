package com.arena.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arena.entities.Booking;
import com.arena.entities.Slot;
import com.arena.entities.User;

public interface BookingDao extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findBySlot(Slot slot);
    
    boolean existsBySlotAndBookingDate(Slot slot, LocalDate bookingDate);
    
    List<Booking> findByUserUserid(Long userId);
    
    List<Booking> findBySlotTurfTurfId(Long turfId);


    
}
