package com.arena.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arena.dto.LoginReqDTO;
import com.arena.dto.ManagerReqDTO;
import com.arena.service.AdminService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
@Validated
public class AdminController {
	
	private  AdminService adminService;
	
	//ADMIN LOGIN	
	@PostMapping("/login")
	public ResponseEntity<?> loginAdmin(@RequestBody LoginReqDTO dto) {
		return ResponseEntity.ok(adminService.loginAdmin(dto));
	}
	
	//GET ALL USERS
	@GetMapping("/users")
	public ResponseEntity<?> getAllUsers() {
	    return ResponseEntity.ok(adminService.getAllUsers());
	}
	
	//GET USER BY ID
	@GetMapping("/users/{id}")
	public ResponseEntity<?>getUserById(@PathVariable Long id){
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.getUserById(id));
	}
	
	//ADD MANAGER
	@PostMapping("/manager/register")
	public ResponseEntity<?> addManager(@Valid @RequestBody ManagerReqDTO dto){
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(adminService.addManager(dto));
	}
	
	//GET ALL MANAGERS
	@GetMapping("/managers")
	public ResponseEntity<?> getAllManagers() {
	    return ResponseEntity.ok(adminService.getAllManagers());
	}
	
	//GET MANAGER BY ID
	@GetMapping("/managers/{id}")
	public ResponseEntity<?>getManagerById(@PathVariable Long id){
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.getManagerById(id));
	}
	
	//DELETE MANAGER BY ID
	@DeleteMapping("/managers/{id}")
	public ResponseEntity<?> deleteManager(@PathVariable Long id){
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.deleteManager(id));
	}

}
