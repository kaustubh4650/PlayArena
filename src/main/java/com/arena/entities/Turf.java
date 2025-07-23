package com.arena.entities;

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
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "turfs")
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(of = "name", callSuper = false)
public class Turf extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long turfId;

	@Column(length = 100, nullable = false)
	private String name;

	@Column(length = 100, nullable = false)
	private String location;

	@Column(nullable = false)
	private double pricePerHour;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status = Status.AVAILABLE;
	
	@Column(length = 255, nullable = false)
	private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private Manager manager;
	
    @Column(length = 255)
    private String imagePath;

}
