package com.arena.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arena.entities.Review;
import com.arena.entities.Turf;
import com.arena.entities.User;

public interface ReviewDao extends JpaRepository<Review, Long> {

	 boolean existsByUserAndTurf(User user, Turf turf);
	 
	 List<Review> findByTurf(Turf turf);
	 
	 List<Review> findByUser(User user);
	 
}
