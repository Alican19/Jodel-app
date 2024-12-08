package com.jodel.jodel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private CommentRepository commentRepository;

    public void addVote(Long commentId, Vote.VoteType voteType) throws Exception {
        // Überprüfen, ob der Kommentar existiert
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new Exception("Kommentar nicht gefunden"));

        // Vote erstellen und speichern
        Vote vote = new Vote();
        vote.setComment(comment);
        vote.setVoteType(voteType);
        voteRepository.save(vote);
    }

    public VoteController.VoteStats getVoteStats(Long commentId) {
        long upvotes = voteRepository.countByCommentAndVoteType(commentId, Vote.VoteType.UPVOTE);
        long downvotes = voteRepository.countByCommentAndVoteType(commentId, Vote.VoteType.DOWNVOTE);
        return new VoteController.VoteStats(upvotes, downvotes);
    }
}
