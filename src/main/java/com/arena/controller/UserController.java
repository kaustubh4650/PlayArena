package com.arena.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arena.dto.LoginReqDTO;
import com.arena.dto.UserReqDTO;
import com.arena.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
	
	private UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<?> addUser(@Valid @RequestBody UserReqDTO dto){
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(userService.addUser(dto));
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginReqDTO dto) {
		return ResponseEntity.ok(userService.loginUser(dto));
	}
}
