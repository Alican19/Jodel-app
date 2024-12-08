package com.jodel.jodel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;

    // Endpunkt zum Voten eines Kommentars
    @PostMapping
    public ResponseEntity<String> vote(
            @RequestParam Long commentId,
            @RequestParam Vote.VoteType voteType) {

        try {
            // Vote hinzufügen über den VoteService
            voteService.addVote(commentId, voteType);
            return ResponseEntity.ok("Vote erfolgreich abgegeben!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fehler beim Abgeben des Votes: " + e.getMessage());
        }
    }

    // Endpunkt zum Abrufen der Vote-Statistik eines Kommentars (optional)
    @GetMapping("/stats")
    public ResponseEntity<VoteStats> getVoteStats(@RequestParam Long commentId) {
        VoteStats stats = voteService.getVoteStats(commentId);
        return ResponseEntity.ok(stats);
    }

    // Response-Klasse für Vote-Statistiken
    public static class VoteStats {
        private long upvotes;
        private long downvotes;

        public VoteStats(long upvotes, long downvotes) {
            this.upvotes = upvotes;
            this.downvotes = downvotes;
        }

        public long getUpvotes() {
            return upvotes;
        }

        public void setUpvotes(long upvotes) {
            this.upvotes = upvotes;
        }

        public long getDownvotes() {
            return downvotes;
        }

        public void setDownvotes(long downvotes) {
            this.downvotes = downvotes;
        }
    }
}
