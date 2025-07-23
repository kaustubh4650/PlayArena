package com.arena.dto;

import com.arena.entities.Status;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TurfResDTO {
	
	private String turfId;
	
	private String name;

	private String location;

	 private double pricePerHour;
	
	 private String description;
	
	 private Status status;
	 
	 private Long managerId;
	 
	 private String managerName;
}
