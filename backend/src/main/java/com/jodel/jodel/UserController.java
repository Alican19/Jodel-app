package com.jodel.jodel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jodel.jodel.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/latest-zahl")
    public Integer getLatestZahl() {
        return userService.getLatestZahl();
    }
}
