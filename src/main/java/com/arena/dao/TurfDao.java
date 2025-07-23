package com.arena.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arena.entities.Turf;

public interface TurfDao extends JpaRepository<Turf, Long> {

}
