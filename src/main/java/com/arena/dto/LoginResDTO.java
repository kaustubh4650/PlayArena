package com.arena.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResDTO {
	 private String email;
	 private String role;
	 private String token;
}
