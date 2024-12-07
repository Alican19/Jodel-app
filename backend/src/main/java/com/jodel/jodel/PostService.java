
package com.jodel.jodel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(Post post) {
    System.out.println("Daten vor dem Speichern: " + post);
    return postRepository.save(post);
}


    public List<Post> getPosts(double latitude, double longitude, double radius) {
        return postRepository.findPostsByLocation(latitude, longitude, radius);
    }
}
