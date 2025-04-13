package com.employee.service;

import com.employee.dto.UserDto;
import com.employee.exception.ResourceNotFoundException;
import com.employee.exception.UnauthorizedException;
import com.employee.model.Role;
import com.employee.model.User;
import com.employee.repository.RoleRepository;
import com.employee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDto(user);
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Check if email is being changed and if it's already in use
        if (!user.getEmail().equals(userDto.getEmail()) 
                && userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        
        // Check if username is being changed and if it's already in use
        if (!user.getUsername().equals(userDto.getUsername()) 
                && userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("Username already in use");
        }
        
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        
        // Only update password if it's provided
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        
        // Only admin can update roles
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
                && userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
            
            Set<Role> roles = new HashSet<>();
            userDto.getRoles().forEach(roleName -> {
                Role role = roleRepository.findByName(Role.RoleName.valueOf(roleName))
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            });
            
            user.setRoles(roles);
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDto updateUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setActive(active);
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Current user not found"));
        
        return convertToDto(user);
    }
    
    public boolean isCurrentUser(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Current user not found"));
        
        return user.getId().equals(userId);
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