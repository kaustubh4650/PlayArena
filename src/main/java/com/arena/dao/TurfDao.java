package com.arena.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arena.entities.Manager;
import com.arena.entities.Turf;

public interface TurfDao extends JpaRepository<Turf, Long> {

	List<Turf> findByManager(Manager manager);
}
