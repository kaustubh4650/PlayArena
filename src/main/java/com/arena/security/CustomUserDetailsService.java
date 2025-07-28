package com.arena.security;

import java.util.Collections;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.arena.dao.AdminDao;
import com.arena.dao.ManagerDao;
import com.arena.dao.UserDao;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final UserDao userDao;
	private final ManagerDao managerDao;
	private final AdminDao adminDao;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

		return userDao.findByEmail(email)
				.map(user -> new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
						Collections.singleton(() -> "ROLE_USER")))
				.or(() -> managerDao.findByEmail(email)
						.map(manager -> new org.springframework.security.core.userdetails.User(manager.getEmail(),
								manager.getPassword(), Collections.singleton(() -> "ROLE_MANAGER"))))
				.or(() -> adminDao.findByEmail(email)
						.map(admin -> new org.springframework.security.core.userdetails.User(admin.getEmail(),
								admin.getPassword(), Collections.singleton(() -> "ROLE_ADMIN"))))
				.orElseThrow(() -> new UsernameNotFoundException("Email not found in any table: " + email));

	}
}
