package com.arena.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arena.entities.Manager;
import com.arena.entities.User;

public interface ManagerDao extends JpaRepository<Manager, Long> {
	
	Optional<Manager> findByEmail(String email);
	
	boolean existsByEmail(String email);

	
}
