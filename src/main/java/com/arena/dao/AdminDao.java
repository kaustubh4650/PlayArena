package com.arena.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arena.entities.Admin;

public interface AdminDao extends JpaRepository<Admin, Long> {

	Optional<Admin> findByEmail(String email);
	
}
