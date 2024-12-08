package com.jodel.jodel;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByCommentAndUser(Comment comment);
    long countByCommentAndVoteType(Long commentId, Vote.VoteType voteType);
}
