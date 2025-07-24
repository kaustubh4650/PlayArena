package com.arena.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.ReviewReqDTO;
import com.arena.dto.UpdateUserDTO;
import com.arena.dto.UserReqDTO;
import com.arena.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
@Validated
public class UserController {

	private UserService userService;

	// USER REGISTRATION
	@PostMapping("/register")
	public ResponseEntity<?> addUser(@Valid @RequestBody UserReqDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userService.addUser(dto));
	}

	// USER LOGIN
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginReqDTO dto) {
		return ResponseEntity.ok(userService.loginUser(dto));
	}

	// CHANGE PASSWORD
	@PutMapping("/change-password")
	public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO dto) {
		return ResponseEntity.ok(userService.changePassword(dto));
	}

	// GET USER BY ID
	@GetMapping("/{id}")
	public ResponseEntity<?> getUserById(@PathVariable Long id) {
		return ResponseEntity.status(HttpStatus.OK).body(userService.getUserById(id));
	}

	// UPDATE USER DETAILS
	@PutMapping("/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserDTO dto) {
		return ResponseEntity.status(HttpStatus.OK).body(userService.updateUserDetails(id, dto));
	}

	// DELETE USERBYID
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {
		return ResponseEntity.status(HttpStatus.OK).body(userService.deleteUser(id));
	}

	// ADD REVIEW
	@PostMapping("/reviews/{turfId}/{userId}")
	public ResponseEntity<?> addReview(@PathVariable Long turfId, @PathVariable Long userId,
			@Valid @RequestBody ReviewReqDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userService.addReview(turfId, userId, dto));
	}

	// UPDATE REVIEW
	@PutMapping("/reviews/{reviewId}")
	public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @Valid @RequestBody ReviewReqDTO dto) {
		return ResponseEntity.ok(userService.updateReview(reviewId, dto));
	}

	// DELETE REVIEW
	@DeleteMapping("/reviews/{reviewId}")
	public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
		return ResponseEntity.ok(userService.deleteReview(reviewId));
	}

	// GET ALL REVIEWS FOR TURFID
	@GetMapping("/turfs/{turfId}/reviews")
	public ResponseEntity<?> getAllReviewsForTurf(@PathVariable Long turfId) {
		return ResponseEntity.ok(userService.getAllReviewsForTurf(turfId));
	}

	// GET ALL REVIEWS BY USERID
	@GetMapping("/{userId}/reviews")
	public ResponseEntity<?> getAllReviewsByUser(@PathVariable Long userId) {
		return ResponseEntity.ok(userService.getAllReviewsByUser(userId));
	}

}
