
package com.jodel.jodel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
public Post createPost(@RequestBody Post post) {
    System.out.println("Empfangenes Post-Objekt: " + post);
    return postService.createPost(post);
}


    @GetMapping
    public List<Post> getPosts(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radius) {
        return postService.getPosts(latitude, longitude, radius);
    }
}
