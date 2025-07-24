package com.arena.dto;

import java.time.LocalTime;

import com.arena.entities.Status;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SlotResDTO {
	
    private Long slotId;
    
    private LocalTime startTime;
    
    private LocalTime endTime;
    
    private Status status;
    
    private Long turfId;
    
    private String turfName;
}
