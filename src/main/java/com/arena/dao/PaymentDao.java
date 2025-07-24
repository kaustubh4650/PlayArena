package com.arena.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.arena.entities.Payment;

public interface PaymentDao extends JpaRepository<Payment, Long> {
    
	
}
