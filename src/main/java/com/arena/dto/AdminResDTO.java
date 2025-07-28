package com.arena.dto;

import com.arena.entities.Role;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminResDTO {

	private Long adminId;
	
	private String name;
	
	private String email;

	private Role role;
}
