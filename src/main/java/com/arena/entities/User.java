package com.arena.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true,exclude = "reviews")
@EqualsAndHashCode(of = "name", callSuper = false)
public class User extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userid;
	
	@Column(length = 100)
	private String name;
	
	@Column(length = 255)
	private String address;
	
	@Column(unique = true,length = 50)
	private String email;
	
	@Column(length = 200)
	private String password;
	
	@Column(length = 10)
	private String phone;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role = Role.USER;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Review> reviews = new ArrayList<>();
	
}
