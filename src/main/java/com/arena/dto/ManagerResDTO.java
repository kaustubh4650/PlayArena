package com.arena.dto;

import com.arena.entities.Role;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManagerResDTO {
	
	private String name;

	private String address;

	private String email;
	
	private String phone;
	
	private Role role;
}
