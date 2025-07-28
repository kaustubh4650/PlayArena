package com.arena.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResDTO {
	
	private Long id;
	 
	private String email;
	
	private String name; 
	
	private String role;
	
	private String token;
}
