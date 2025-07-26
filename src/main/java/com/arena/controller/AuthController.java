package com.arena.controller;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arena.dto.LoginReqDTO;
import com.arena.dto.LoginResDTO;
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
    private final UserService userService;
    private final ManagerService managerService;
    private final AdminService adminService;

    @PostMapping("/user/login")
    public LoginResDTO userLogin(@RequestBody LoginReqDTO request) {
        userService.validateCredentials(request.getEmail(), request.getPassword());
        String token = jwtUtils.generateToken(request.getEmail(), "USER");
        return new LoginResDTO(request.getEmail(), "USER", token);
    }

    @PostMapping("/manager/login")
    public LoginResDTO managerLogin(@RequestBody LoginReqDTO request) {
        managerService.validateCredentials(request.getEmail(), request.getPassword());
        String token = jwtUtils.generateToken(request.getEmail(), "MANAGER");
        return new LoginResDTO(request.getEmail(), "MANAGER", token);
    }

    @PostMapping("/admin/login")
    public LoginResDTO adminLogin(@RequestBody LoginReqDTO request) {
        adminService.validateCredentials(request.getEmail(), request.getPassword());
        String token = jwtUtils.generateToken(request.getEmail(), "ADMIN");
        return new LoginResDTO(request.getEmail(), "ADMIN", token);
    }

}
