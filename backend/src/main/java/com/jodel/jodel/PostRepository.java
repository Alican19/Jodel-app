
package com.jodel.jodel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query(value = "SELECT * FROM posts WHERE " +
            "earth_distance(ll_to_earth(:latitude, :longitude), ll_to_earth(latitude, longitude)) <= :radius " +
            "ORDER BY created_at DESC", nativeQuery = true)
    List<Post> findPostsByLocation(double latitude, double longitude, double radius);
}
