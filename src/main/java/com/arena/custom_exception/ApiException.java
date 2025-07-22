package com.arena.custom_exception;

@SuppressWarnings("serial")
public class ApiException extends RuntimeException{
	public ApiException(String msg) {
		super(msg);
	}
}
