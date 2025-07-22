package com.arena.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public class BaseEntity {
		
	@CreationTimestamp
	@Column(name="created_on")
	private LocalDate createdOn;
	
	@UpdateTimestamp
	@Column(name="updated_on")
	 private LocalDateTime updatedOn;
}
