package com.arena.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {
	private String msg;
	private LocalDateTime timeStamp;
	
	public ApiResponse(String msg) {
		this.msg = msg;
		this.timeStamp= LocalDateTime.now();
	}
}
