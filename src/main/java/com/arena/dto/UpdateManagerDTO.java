package com.arena.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateManagerDTO {
	@NotBlank
	private String name;
	@NotBlank
	private String address;
	@NotBlank
	private String phone;
}
