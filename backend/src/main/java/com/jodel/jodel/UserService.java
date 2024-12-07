package com.jodel.jodel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.jodel.jodel.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Integer getLatestZahl() {
        return userRepository.findLatestZahl();
    }
}
