package com.employee.service;

import com.employee.dto.AuthRequest;
import com.employee.dto.AuthResponse;
import com.employee.dto.UserDto;
import com.employee.exception.UnauthorizedException;
import com.employee.model.Role;
import com.employee.model.User;
import com.employee.repository.RoleRepository;
import com.employee.repository.UserRepository;
import com.employee.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        UserDto userDto = convertToDto(user);
        return new AuthResponse(jwt, userDto);
    }

    @Transactional
    public UserDto registerUser(UserDto userDto) {
        // Check if username is already taken
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        // Check if email is already in use
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        // Create new user account
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        // Assign default role
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        roles.add(userRole);

        // Add admin role if requested (and validated)
        if (userDto.getRoles() != null && userDto.getRoles().contains("ROLE_ADMIN")) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));
            roles.add(adminRole);
        }

        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setActive(user.isActive());
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet()));
        return dto;
    }
}