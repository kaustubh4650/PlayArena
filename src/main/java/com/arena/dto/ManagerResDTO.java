package com.arena.dto;

import com.arena.entities.Role;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManagerResDTO {
	
	private Long managerId;
	
	private String name;

	private String address;

	private String email;
	
	private String phone;
	
	private Role role;
}
