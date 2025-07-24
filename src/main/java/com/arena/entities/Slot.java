package com.arena.entities;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "slots")
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
public class Slot extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long slotId;

	@Column(nullable = false)
	private LocalDate date;

	@Column(nullable = false)
	private LocalTime startTime;

	@Column(nullable = false)
	private LocalTime endTime;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status = Status.AVAILABLE;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "turf_id", nullable = false)
	private Turf turf;

}
