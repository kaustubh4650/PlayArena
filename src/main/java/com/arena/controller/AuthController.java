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

//    @PostMapping("/user/login")
//    public LoginResDTO userLogin(@RequestBody LoginReqDTO request) {
//        userService.validateCredentials(request.getEmail(), request.getPassword());
//        UserResDTO user = userService.getByEmail(request.getEmail());
//        String token = jwtUtils.generateToken(request.getEmail(), "USER");
//        return new LoginResDTO(user.getEmail(),user.getName(), "USER", token);
//    }
//
//    @PostMapping("/manager/login")
//    public LoginResDTO managerLogin(@RequestBody LoginReqDTO request) {
//        managerService.validateCredentials(request.getEmail(), request.getPassword());
//        ManagerResDTO manager = managerService.getByEmail(request.getEmail());
//        String token = jwtUtils.generateToken(request.getEmail(), "MANAGER");
//        return new LoginResDTO(manager.getEmail(),manager.getName(), "MANAGER", token);
//    }
//
//    @PostMapping("/admin/login")
//    public LoginResDTO adminLogin(@RequestBody LoginReqDTO request) {
//        adminService.validateCredentials(request.getEmail(), request.getPassword());
//        AdminResDTO admin = adminService.getByEmail(request.getEmail());
//        String token = jwtUtils.generateToken(request.getEmail(), "ADMIN");
//        return new LoginResDTO(admin.getEmail(),admin.getName(), "ADMIN", token);
//    }

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

        return new LoginResDTO(request.getEmail(), name, role, token);
    }
    
}
