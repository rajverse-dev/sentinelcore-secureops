package com.sentinelcore.assetservice.repository;


import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sentinelcore.assetservice.entity.User;

public interface UserRepository 
                extends JpaRepository<User, UUID>{

                    Optional<User> findByEmail(String email);

                    boolean existsByEmail(String email);

                    Optional<User> findByUsername(String username);

                    boolean existsByUsername(String username);

                    Optional<User> findByEmailOrUsername(String email, String username);
 } 


