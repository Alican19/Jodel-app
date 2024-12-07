package com.jodel.jodel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.jodel.jodel.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u.zahl FROM User u ORDER BY u.id DESC LIMIT 1")
    Integer findLatestZahl();
}
