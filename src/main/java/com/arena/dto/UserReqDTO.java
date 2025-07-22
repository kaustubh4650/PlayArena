package com.arena.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserReqDTO {
	@NotBlank
	private String name;
	@NotBlank
	private String address;
	@NotBlank
	private String email;
	@NotBlank
	private String password;
	@NotBlank
	private String phone;
}
