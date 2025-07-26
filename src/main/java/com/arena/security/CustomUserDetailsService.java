package com.arena.security;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.arena.dao.AdminDao;
import com.arena.dao.ManagerDao;
import com.arena.dao.UserDao;
import com.arena.entities.Admin;
import com.arena.entities.Manager;
import com.arena.entities.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDao userDao;
    private final ManagerDao managerDao;
    private final AdminDao adminDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Check in Users
        Optional<User> userOpt = userDao.findByEmail(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
            );
        }

        // Check in Managers
        Optional<Manager> managerOpt = managerDao.findByEmail(username);
        if (managerOpt.isPresent()) {
            Manager manager = managerOpt.get();
            return new org.springframework.security.core.userdetails.User(
                manager.getEmail(), manager.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + manager.getRole()))
            );
        }

        // Check in Admins
        Optional<Admin> adminOpt = adminDao.findByEmail(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return new org.springframework.security.core.userdetails.User(
                admin.getEmail(), admin.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + admin.getRole()))
            );
        }

        throw new UsernameNotFoundException("User not found with email: " + username);
    }
}
