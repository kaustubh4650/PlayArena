package com.arena.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.UpdateManagerDTO;
import com.arena.service.ManagerService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/managers")
@AllArgsConstructor
@Validated
public class ManagerController {
	
	private ManagerService managerService;
	
	//MANAGER LOGIN
	@PostMapping("/login")
	public ResponseEntity<?> loginManager(@RequestBody LoginReqDTO dto) {
		return ResponseEntity.ok(managerService.loginManager(dto));
	}
	
	//CHANGE PASSWORD 
	@PutMapping("/change-password")
	public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO dto) {
	    return ResponseEntity.ok(managerService.changePassword(dto));
	}
	
	//GET MANAGER BY ID
	@GetMapping("/{id}")
	public ResponseEntity<?>getManagerById(@PathVariable Long id){
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.getManagerById(id));
	}
	
	//UPDATE MANAGER
	@PutMapping("/{id}")
	public ResponseEntity<?> updateManager(@PathVariable Long id,
			@Valid @RequestBody UpdateManagerDTO dto){
		return ResponseEntity.status(HttpStatus.OK)
				.body(managerService.updateManagerDetails(id,dto));
	}
	

}
