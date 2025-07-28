package com.arena.controller;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arena.dto.LoginReqDTO;
import com.arena.dto.LoginResDTO;
import com.arena.security.CustomUserDetailsService;
import com.arena.security.jwt.JwtUtils;
import com.arena.service.AdminService;
import com.arena.service.ManagerService;
import com.arena.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;
    
    private final UserService userService;
    private final ManagerService managerService;
    private final AdminService adminService;


    @PostMapping("/login")
    public LoginResDTO login(@RequestBody LoginReqDTO request) {
        // Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        // Extract role from granted authorities (ROLE_USER / ROLE_MANAGER / ROLE_ADMIN)
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");

        // Generate JWT token
        String token = jwtUtils.generateToken(request.getEmail(), role);

        // Fetch user's name from appropriate table
        String name = switch (role) {
            case "USER" -> userService.getByEmail(request.getEmail()).getName();
            case "MANAGER" -> managerService.getByEmail(request.getEmail()).getName();
            case "ADMIN" -> adminService.getByEmail(request.getEmail()).getName();
            default -> "Unknown";
        };
        
        Long id = switch (role) {
        case "USER" -> userService.getByEmail(request.getEmail()).getUserid();
        case "MANAGER" -> managerService.getByEmail(request.getEmail()).getManagerId();
        case "ADMIN" -> adminService.getByEmail(request.getEmail()).getAdminId();
        default -> null;
    };


        return new LoginResDTO(id,request.getEmail(), name, role, token);
    }
    
}
